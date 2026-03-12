-- ══════════════════════════════════════════════════════
-- invita-do: Initial Database Schema
-- Run this in the Supabase SQL Editor
-- ══════════════════════════════════════════════════════

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "pgvector";
CREATE EXTENSION IF NOT EXISTS "pg_trgm"; -- For fuzzy search on guest names

-- ── Enums ────────────────────────────────────────────
CREATE TYPE subscription_tier AS ENUM ('FREE', 'PREMIUM', 'ENTERPRISE');
CREATE TYPE guest_status AS ENUM ('PENDING', 'VIEWED', 'CONFIRMED', 'DECLINED');
CREATE TYPE photo_status AS ENUM ('PENDING_MODERATION', 'APPROVED', 'REJECTED');
CREATE TYPE table_shape AS ENUM ('ROUND', 'RECTANGULAR');

-- ── Profiles (extends auth.users) ────────────────────
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  stripe_customer_id TEXT,
  subscription_tier subscription_tier NOT NULL DEFAULT 'FREE',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Auto-create profile when a new user signs up
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, email, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', ''),
    COALESCE(NEW.raw_user_meta_data->>'avatar_url', NEW.raw_user_meta_data->>'picture', '')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- ── Events ───────────────────────────────────────────
CREATE TABLE events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  slug TEXT NOT NULL,
  title TEXT NOT NULL,
  niche_type TEXT NOT NULL DEFAULT 'WEDDING',
  date TIMESTAMPTZ NOT NULL,
  end_date TIMESTAMPTZ,
  location_name TEXT,
  location_address TEXT,
  location_geo JSONB,
  theme_config JSONB,
  music_url TEXT,
  cover_image_url TEXT,
  pin TEXT CHECK (pin IS NULL OR length(pin) = 4),
  is_published BOOLEAN NOT NULL DEFAULT false,
  is_private BOOLEAN NOT NULL DEFAULT false,
  max_guests_free INTEGER NOT NULL DEFAULT 50,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- UNIQUE INDEX on slug for O(1) lookup + collision prevention
CREATE UNIQUE INDEX idx_events_slug ON events(slug);
CREATE INDEX idx_events_user_id ON events(user_id);

CREATE TRIGGER events_updated_at
  BEFORE UPDATE ON events
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- ── Guest Groups ─────────────────────────────────────
CREATE TABLE guest_groups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  max_companions INTEGER NOT NULL DEFAULT 0,
  tags TEXT[] NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_guest_groups_event_id ON guest_groups(event_id);

-- ── Guests ───────────────────────────────────────────
CREATE TABLE guests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id UUID NOT NULL REFERENCES guest_groups(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  status guest_status NOT NULL DEFAULT 'PENDING',
  qr_code_id TEXT,
  dietary_restrictions TEXT,
  is_child BOOLEAN NOT NULL DEFAULT false,
  is_primary BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_guests_group_id ON guests(group_id);
-- Trigram index for fuzzy name search on RSVP
CREATE INDEX idx_guests_name_trgm ON guests USING gin(name gin_trgm_ops);

CREATE TRIGGER guests_updated_at
  BEFORE UPDATE ON guests
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- ── Event Tables (Seating) ───────────────────────────
CREATE TABLE event_tables (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  shape table_shape NOT NULL DEFAULT 'ROUND',
  capacity INTEGER NOT NULL DEFAULT 8,
  position_x REAL NOT NULL DEFAULT 0,
  position_y REAL NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_event_tables_event_id ON event_tables(event_id);

-- ── Seats ────────────────────────────────────────────
CREATE TABLE seats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  table_id UUID NOT NULL REFERENCES event_tables(id) ON DELETE CASCADE,
  seat_number INTEGER NOT NULL,
  guest_id UUID REFERENCES guests(id) ON DELETE SET NULL,
  UNIQUE(table_id, seat_number),
  UNIQUE(guest_id) -- A guest can only sit in one seat
);

CREATE INDEX idx_seats_table_id ON seats(table_id);

-- ── Gallery Photos ───────────────────────────────────
CREATE TABLE gallery_photos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  guest_id UUID REFERENCES guests(id) ON DELETE SET NULL,
  url TEXT NOT NULL,
  thumbnail_url TEXT,
  status photo_status NOT NULL DEFAULT 'PENDING_MODERATION',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_gallery_photos_event_id ON gallery_photos(event_id);
CREATE INDEX idx_gallery_photos_status ON gallery_photos(event_id, status);

-- ── AI Knowledge Base (Vector) ───────────────────────
CREATE TABLE ai_knowledge_base (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  embedding vector(1536),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_ai_kb_event_id ON ai_knowledge_base(event_id);

-- ══════════════════════════════════════════════════════
-- Row Level Security (RLS)
-- ══════════════════════════════════════════════════════

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE guest_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE guests ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_tables ENABLE ROW LEVEL SECURITY;
ALTER TABLE seats ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery_photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_knowledge_base ENABLE ROW LEVEL SECURITY;

-- ── Profiles: Users can read/update own profile ──────
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- ── Events: Owners can CRUD, public can read published
CREATE POLICY "Owners can manage their events"
  ON events FOR ALL
  USING (auth.uid() = user_id);

CREATE POLICY "Anyone can view published events by slug"
  ON events FOR SELECT
  USING (is_published = true);

-- ── Guest Groups: Owner of event can manage ──────────
CREATE POLICY "Event owners can manage guest groups"
  ON guest_groups FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM events
      WHERE events.id = guest_groups.event_id
      AND events.user_id = auth.uid()
    )
  );

CREATE POLICY "Public can view guest groups of published events"
  ON guest_groups FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM events
      WHERE events.id = guest_groups.event_id
      AND events.is_published = true
    )
  );

-- ── Guests: Owner of event can manage ────────────────
CREATE POLICY "Event owners can manage guests"
  ON guests FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM guest_groups
      JOIN events ON events.id = guest_groups.event_id
      WHERE guest_groups.id = guests.group_id
      AND events.user_id = auth.uid()
    )
  );

CREATE POLICY "Public can view guests of published events"
  ON guests FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM guest_groups
      JOIN events ON events.id = guest_groups.event_id
      WHERE guest_groups.id = guests.group_id
      AND events.is_published = true
    )
  );

-- ── Event Tables + Seats: Owner manages ──────────────
CREATE POLICY "Event owners can manage tables"
  ON event_tables FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM events
      WHERE events.id = event_tables.event_id
      AND events.user_id = auth.uid()
    )
  );

CREATE POLICY "Event owners can manage seats"
  ON seats FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM event_tables
      JOIN events ON events.id = event_tables.event_id
      WHERE event_tables.id = seats.table_id
      AND events.user_id = auth.uid()
    )
  );

-- ── Gallery Photos: Owner manages, public views approved
CREATE POLICY "Event owners can manage photos"
  ON gallery_photos FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM events
      WHERE events.id = gallery_photos.event_id
      AND events.user_id = auth.uid()
    )
  );

CREATE POLICY "Public can view approved photos"
  ON gallery_photos FOR SELECT
  USING (
    status = 'APPROVED'
    AND EXISTS (
      SELECT 1 FROM events
      WHERE events.id = gallery_photos.event_id
      AND events.is_published = true
    )
  );

-- Allow anonymous inserts for gallery (guests upload photos)
CREATE POLICY "Anyone can upload photos to published events"
  ON gallery_photos FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM events
      WHERE events.id = gallery_photos.event_id
      AND events.is_published = true
    )
  );

-- ── AI Knowledge Base: Owner manages ─────────────────
CREATE POLICY "Event owners can manage knowledge base"
  ON ai_knowledge_base FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM events
      WHERE events.id = ai_knowledge_base.event_id
      AND events.user_id = auth.uid()
    )
  );

// ──────────────────────────────────────────────────────────────
// Supabase Database Types — invita-do
// These types mirror the database schema for full type safety.
// When Supabase CLI is configured, replace with auto-generated types.
// ──────────────────────────────────────────────────────────────

export type SubscriptionTier = "FREE" | "PREMIUM" | "ENTERPRISE";

export type GuestStatus = "PENDING" | "VIEWED" | "CONFIRMED" | "DECLINED";

export type PhotoStatus = "PENDING_MODERATION" | "APPROVED" | "REJECTED";

export type TableShape = "ROUND" | "RECTANGULAR";

export interface Profile {
    id: string;
    email: string;
    full_name: string | null;
    avatar_url: string | null;
    payment_customer_id: string | null;
    subscription_tier: SubscriptionTier;
    created_at: string;
    updated_at: string;
}

export interface Event {
    id: string;
    user_id: string;
    slug: string;
    title: string;
    event_type: string;
    date: string;
    end_date: string | null;
    location_name: string | null;
    location_address: string | null;
    location_geo: { lat: number; lng: number } | null;
    theme_config: ThemeConfig | null;
    music_url: string | null;
    cover_image_url: string | null;
    pin: string | null;
    is_published: boolean;
    is_private: boolean;
    max_guests_free: number;
    created_at: string;
    updated_at: string;
}

export interface ThemeConfig {
    palette: {
        primary: string;
        secondary: string;
        accent: string;
        background: string;
        text: string;
    };
    fonts: {
        heading: string;
        body: string;
    };
    texts: {
        headline: string;
        subheadline: string;
        invitation_body: string;
        closing: string;
    };
    style: string;
}

export interface GuestGroup {
    id: string;
    event_id: string;
    name: string;
    max_companions: number;
    tags: string[];
    created_at: string;
}

export interface Guest {
    id: string;
    group_id: string;
    name: string;
    email: string | null;
    phone: string | null;
    status: GuestStatus;
    dietary_restrictions: string | null;
    is_child: boolean;
    is_primary: boolean;
    created_at: string;
    updated_at: string;
}

export interface EventTable {
    id: string;
    event_id: string;
    name: string;
    shape: TableShape;
    capacity: number;
    position_x: number;
    position_y: number;
    created_at: string;
}

export interface Seat {
    id: string;
    table_id: string;
    seat_number: number;
    guest_id: string | null;
}

export interface GalleryPhoto {
    id: string;
    event_id: string;
    guest_id: string | null;
    url: string;
    thumbnail_url: string | null;
    status: PhotoStatus;
    created_at: string;
}

// ──────────────────────────────────────────────────────────────
// Supabase Database generic type (placeholder)
// Replace this with `npx supabase gen types typescript` output
// ──────────────────────────────────────────────────────────────
export interface Database {
    public: {
        Tables: {
            profiles: {
                Row: Profile;
                Insert: Omit<Profile, "created_at" | "updated_at">;
                Update: Partial<Omit<Profile, "id" | "created_at">>;
            };
            events: {
                Row: Event;
                Insert: Omit<Event, "id" | "created_at" | "updated_at">;
                Update: Partial<Omit<Event, "id" | "created_at">>;
            };
            guest_groups: {
                Row: GuestGroup;
                Insert: Omit<GuestGroup, "id" | "created_at">;
                Update: Partial<Omit<GuestGroup, "id" | "created_at">>;
            };
            guests: {
                Row: Guest;
                Insert: Omit<Guest, "id" | "created_at" | "updated_at">;
                Update: Partial<Omit<Guest, "id" | "created_at">>;
            };
            event_tables: {
                Row: EventTable;
                Insert: Omit<EventTable, "id" | "created_at">;
                Update: Partial<Omit<EventTable, "id" | "created_at">>;
            };
            seats: {
                Row: Seat;
                Insert: Omit<Seat, "id">;
                Update: Partial<Omit<Seat, "id">>;
            };
            gallery_photos: {
                Row: GalleryPhoto;
                Insert: Omit<GalleryPhoto, "id" | "created_at">;
                Update: Partial<Omit<GalleryPhoto, "id" | "created_at">>;
            };
        };
        Views: Record<string, never>;
        Functions: Record<string, never>;
        Enums: {
            subscription_tier: SubscriptionTier;
            guest_status: GuestStatus;
            photo_status: PhotoStatus;
            table_shape: TableShape;
        };
    };
}

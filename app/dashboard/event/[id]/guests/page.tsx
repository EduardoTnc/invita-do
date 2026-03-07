import { createClient } from "@/lib/supabase/server";
import { connection } from "next/server";

import { notFound } from "next/navigation";
import { GuestManager } from "@/components/dashboard/guest-manager";

interface GuestsPageProps {
    params: Promise<{ id: string }>;
}

interface GuestRow {
    id: string;
    name: string;
    email: string | null;
    phone: string | null;
    status: string;
    dietary_restrictions: string | null;
    is_child: boolean;
    is_primary: boolean;
}

interface GuestGroupRow {
    id: string;
    name: string;
    max_companions: number;
    tags: string[];
    guests: GuestRow[];
}

export default async function GuestsPage({ params }: GuestsPageProps) {
    await connection();
    const { id: eventId } = await params;
    const supabase = await createClient();

    const { data: eventData } = await supabase
        .from("events")
        .select("id, title, max_guests_free")
        .eq("id", eventId)
        .single();

    const event = eventData as { id: string; title: string; max_guests_free: number } | null;
    if (!event) notFound();

    const { data: groupsData } = await supabase
        .from("guest_groups")
        .select("*, guests(*)")
        .eq("event_id", eventId)
        .order("created_at", { ascending: true });

    const groups = (groupsData as GuestGroupRow[] | null) ?? [];

    return (
        <GuestManager
            eventId={eventId}
            eventTitle={event.title}
            maxGuestsFree={event.max_guests_free}
            initialGroups={groups}
        />
    );
}

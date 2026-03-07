import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY! // Use service role to bypass RLS for public search
    );
    try {
        const { eventId, name } = await req.json();

        if (!eventId || !name || name.trim().length < 2) {
            return NextResponse.json({ error: "Invalid search parameters" }, { status: 400 });
        }

        // Fuzzy search for guests in this event
        const { data: guests, error } = await supabase
            .from("guests")
            .select("id, name, guest_group_id")
            .eq("event_id", eventId)
            .ilike("name", `%${name.trim()}%`)
            .limit(5);

        if (error) throw error;

        // If a guest belongs to a group, fetch the whole group
        const results = await Promise.all(
            guests.map(async (guest) => {
                if (!guest.guest_group_id) {
                    return { groupName: guest.name, members: [guest] };
                }

                // Fetch everyone in the group
                const { data: groupData } = await supabase
                    .from("guest_groups")
                    .select("id, name, guests(id, name, status, dietary_restrictions)")
                    .eq("id", guest.guest_group_id)
                    .single();

                if (groupData) {
                    return {
                        groupId: groupData.id,
                        groupName: groupData.name,
                        members: groupData.guests,
                    };
                }

                return { groupName: guest.name, members: [guest] };
            })
        );

        // Deduplicate groups (since multiple search results might belong to the same group)
        const uniqueResults = Array.from(new Map(results.map(r => [r.groupId || r.groupName, r])).values());

        return NextResponse.json(uniqueResults);
    } catch (error: any) {
        console.error("RSVP Search error:", error);
        return NextResponse.json({ error: "Failed to search for guest" }, { status: 500 });
    }
}

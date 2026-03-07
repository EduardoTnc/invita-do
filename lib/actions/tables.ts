"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function getTablesByEventId(eventId: string) {
    const supabase = await createClient();
    const { data: tables, error } = await supabase
        .from("event_tables")
        .select(`
            *,
            seats (
                *,
                guest:guests (*)
            )
        `)
        .eq("event_id", eventId)
        .order("created_at", { ascending: true });

    if (error) throw new Error(error.message);
    return tables;
}

export async function createTable(eventId: string, name: string, capacity: number = 8) {
    const supabase = await createClient();

    // Insert table
    const { data: table, error: tableError } = await supabase
        .from("event_tables")
        .insert([{ event_id: eventId, name, capacity }])
        .select()
        .single();

    if (tableError) throw new Error(tableError.message);

    // Generate seats for the table
    const seatsToInsert = Array.from({ length: capacity }).map((_, i) => ({
        table_id: table.id,
        seat_number: i + 1,
    }));

    const { error: seatsError } = await supabase
        .from("seats")
        .insert(seatsToInsert);

    if (seatsError) throw new Error(seatsError.message);

    revalidatePath(`/dashboard/event/${eventId}/tables`);
    return table;
}

export async function deleteTable(tableId: string, eventId: string) {
    const supabase = await createClient();
    const { error } = await supabase
        .from("event_tables")
        .delete()
        .eq("id", tableId);

    if (error) throw new Error(error.message);
    revalidatePath(`/dashboard/event/${eventId}/tables`);
}

export async function assignSeat(seatId: string, guestId: string | null, eventId: string) {
    const supabase = await createClient();

    // Check if guest is already seated elsewhere and unseat them if true and guestId is not null
    if (guestId) {
        // Find existing seat of guest (join with tables to ensure it's in the same event)
        const { data: existingSeat } = await supabase
            .from("seats")
            .select(`
                id,
                event_tables!inner(event_id)
            `)
            .eq("guest_id", guestId)
            .eq("event_tables.event_id", eventId)
            .maybeSingle();

        if (existingSeat) {
            // Unseat from previous seat
            await supabase
                .from("seats")
                .update({ guest_id: null })
                .eq("id", existingSeat.id);
        }
    }

    // Assign to new seat
    const { error } = await supabase
        .from("seats")
        .update({ guest_id: guestId })
        .eq("id", seatId);

    if (error) throw new Error(error.message);
    revalidatePath(`/dashboard/event/${eventId}/tables`);
}

export async function getUnseatedGuests(eventId: string) {
    const supabase = await createClient();

    // Get all guests for this event
    const { data: guests, error: guestsError } = await supabase
        .from("guests")
        .select(`
            *,
            group:guest_groups!inner(event_id)
        `)
        .eq("guest_groups.event_id", eventId)
        .order("name", { ascending: true });

    if (guestsError) throw new Error(guestsError.message);

    // Get all seated guest IDs
    const { data: seatedGuests, error: seatedError } = await supabase
        .from("seats")
        .select("guest_id")
        .not("guest_id", "is", null);

    if (seatedError) throw new Error(seatedError.message);

    const seatedGuestIds = new Set(seatedGuests.map((s) => s.guest_id));

    // Filter unseated guests
    return guests.filter((g) => !seatedGuestIds.has(g.id));
}

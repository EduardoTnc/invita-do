"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function createGuestGroup(
    eventId: string,
    name: string,
    maxCompanions: number,
    tags: string[]
) {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error("No autenticado");

    const { data, error } = await supabase
        .from("guest_groups")
        .insert({
            event_id: eventId,
            name,
            max_companions: maxCompanions,
            tags,
        })
        .select()
        .single();

    if (error) throw new Error("Error creando grupo: " + error.message);
    revalidatePath(`/dashboard/event/${eventId}/guests`);
    return data;
}

export async function addGuest(
    groupId: string,
    eventId: string,
    guest: {
        name: string;
        email?: string;
        phone?: string;
        dietary_restrictions?: string;
        is_child?: boolean;
        is_primary?: boolean;
    }
) {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error("No autenticado");

    const { error } = await supabase.from("guests").insert({
        group_id: groupId,
        name: guest.name,
        email: guest.email || null,
        phone: guest.phone || null,
        dietary_restrictions: guest.dietary_restrictions || null,
        is_child: guest.is_child ?? false,
        is_primary: guest.is_primary ?? false,
    });

    if (error) throw new Error("Error agregando invitado: " + error.message);
    revalidatePath(`/dashboard/event/${eventId}/guests`);
}

export async function updateGuestStatus(
    guestId: string,
    eventId: string,
    status: string
) {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error("No autenticado");

    const { error } = await supabase
        .from("guests")
        .update({ status })
        .eq("id", guestId);

    if (error) throw new Error("Error actualizando estado: " + error.message);
    revalidatePath(`/dashboard/event/${eventId}/guests`);
}

export async function deleteGuest(guestId: string, eventId: string) {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error("No autenticado");

    const { error } = await supabase.from("guests").delete().eq("id", guestId);

    if (error) throw new Error("Error eliminando invitado: " + error.message);
    revalidatePath(`/dashboard/event/${eventId}/guests`);
}

export async function deleteGuestGroup(groupId: string, eventId: string) {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error("No autenticado");

    const { error } = await supabase
        .from("guest_groups")
        .delete()
        .eq("id", groupId);

    if (error) throw new Error("Error eliminando grupo: " + error.message);
    revalidatePath(`/dashboard/event/${eventId}/guests`);
}

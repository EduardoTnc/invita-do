"use server";

import { createClient } from "@/lib/supabase/server";
import { createEventSchema } from "@/lib/validations/events";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createEvent(formData: FormData) {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        throw new Error("No autenticado");
    }

    const raw = {
        title: formData.get("title") as string,
        slug: formData.get("slug") as string,
        event_type: formData.get("event_type") as string,
        date: formData.get("date") as string,
        end_date: (formData.get("end_date") as string) || undefined,
        location_name: (formData.get("location_name") as string) || undefined,
        location_address: (formData.get("location_address") as string) || undefined,
        is_private: formData.get("is_private") === "true",
        pin: (formData.get("pin") as string) || undefined,
    };

    const validated = createEventSchema.parse(raw);

    const { data, error } = await supabase
        .from("events")
        .insert({
            user_id: user.id,
            slug: validated.slug,
            title: validated.title,
            event_type: validated.event_type,
            date: validated.date,
            end_date: validated.end_date || null,
            location_name: validated.location_name || null,
            location_address: validated.location_address || null,
            is_private: validated.is_private,
            pin: validated.pin || null,
            is_published: false,
        })
        .select("id")
        .single();

    if (error) {
        if (error.code === "23505") {
            throw new Error("Este slug ya existe. Prueba con otro.");
        }
        throw new Error("Error al crear el evento: " + error.message);
    }

    revalidatePath("/dashboard");
    redirect(`/dashboard/event/${data.id}`);
}

export async function checkSlugAvailability(slug: string) {
    const supabase = await createClient();
    const { data } = await supabase
        .from("events")
        .select("id")
        .eq("slug", slug)
        .single();

    return { available: !data };
}

export async function updateEvent(eventId: string, formData: FormData) {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) throw new Error("No autenticado");

    const updates: Record<string, unknown> = {};
    const fields = [
        "title",
        "event_type",
        "date",
        "end_date",
        "location_name",
        "location_address",
        "music_url",
        "cover_image_url",
        "is_published",
        "is_private",
        "pin",
    ];

    for (const field of fields) {
        const value = formData.get(field);
        if (value !== null) {
            if (field === "is_published" || field === "is_private") {
                updates[field] = value === "true";
            } else {
                updates[field] = value || null;
            }
        }
    }

    const { error } = await supabase
        .from("events")
        .update(updates)
        .eq("id", eventId)
        .eq("user_id", user.id);

    if (error) throw new Error("Error actualizando evento: " + error.message);

    revalidatePath(`/dashboard/event/${eventId}`);
    revalidatePath("/dashboard");
}

export async function deleteEvent(eventId: string) {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) throw new Error("No autenticado");

    const { error } = await supabase
        .from("events")
        .delete()
        .eq("id", eventId)
        .eq("user_id", user.id);

    if (error) throw new Error("Error eliminando evento: " + error.message);

    revalidatePath("/dashboard");
    redirect("/dashboard");
}

export async function toggleEventPublished(
    eventId: string,
    isPublished: boolean
) {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) throw new Error("No autenticado");

    const { error } = await supabase
        .from("events")
        .update({ is_published: isPublished })
        .eq("id", eventId)
        .eq("user_id", user.id);

    if (error) throw new Error("Error publicando evento: " + error.message);

    revalidatePath(`/dashboard/event/${eventId}`);
    revalidatePath("/dashboard");
}

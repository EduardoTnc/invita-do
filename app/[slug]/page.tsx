import { createClient } from "@/lib/supabase/server";
import { connection } from "next/server";

import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { MicrositeContent } from "@/components/microsite/microsite-content";
import type { Event } from "@/types/database";

interface MicrositePageProps {
    params: Promise<{ slug: string }>;
}

export async function generateMetadata({
    params,
}: MicrositePageProps): Promise<Metadata> {
    await connection();
    const { slug } = await params;
    const supabase = await createClient();
    const { data } = await supabase
        .from("events")
        .select("title, event_type, date, location_name")
        .eq("slug", slug)
        .eq("is_published", true)
        .single();

    const event = data as { title: string; event_type: string; date: string; location_name: string | null } | null;
    if (!event) return { title: "Evento no encontrado" };

    const eventDate = new Date(event.date).toLocaleDateString("es-PE", {
        day: "numeric",
        month: "long",
        year: "numeric",
    });

    return {
        title: event.title,
        description: `${event.title} — ${eventDate}${event.location_name ? ` en ${event.location_name}` : ""
            }. Confirma tu asistencia ahora.`,
        openGraph: {
            title: event.title,
            description: `Estás invitado a ${event.title}. Confirma tu asistencia.`,
            type: "website",
            locale: "es_PE",
        },
    };
}

export default async function MicrositePage({ params }: MicrositePageProps) {
    await connection();
    const { slug } = await params;
    const supabase = await createClient();

    const { data } = await supabase
        .from("events")
        .select("*")
        .eq("slug", slug)
        .eq("is_published", true)
        .single();

    const event = data as Event | null;
    if (!event) notFound();

    // Fetch approved photos
    const { data: photos } = await supabase
        .from("gallery_photos")
        .select("*")
        .eq("event_id", event.id)
        .eq("status", "APPROVED")
        .order("created_at", { ascending: false });

    return <MicrositeContent event={event} photos={photos || []} />;
}

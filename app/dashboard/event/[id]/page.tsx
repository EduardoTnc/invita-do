import { createClient } from "@/lib/supabase/server";
import { connection } from "next/server";

import { notFound } from "next/navigation";
import Link from "next/link";
import {
    Calendar,
    Users,
    MapPin,
    LayoutGrid,
    Image,
    ArrowLeft,
    ExternalLink,
    Globe,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PublishToggle } from "@/components/dashboard/publish-toggle";
import type { Event } from "@/types/database";

interface EventPageProps {
    params: Promise<{ id: string }>;
}

export default async function EventDetailPage({ params }: EventPageProps) {
    await connection();
    const { id } = await params;
    const supabase = await createClient();

    const { data } = await supabase
        .from("events")
        .select("*")
        .eq("id", id)
        .single();

    const event = data as Event | null;
    if (!event) notFound();

    // Get guest group IDs for this event
    const { data: groupData } = await supabase
        .from("guest_groups")
        .select("id")
        .eq("event_id", id);

    const groupIds = (groupData as { id: string }[] | null)?.map((g) => g.id) ?? [];

    let guestCount = 0;
    let confirmedCount = 0;

    if (groupIds.length > 0) {
        const { count: total } = await supabase
            .from("guests")
            .select("id", { count: "exact", head: true })
            .in("group_id", groupIds);
        guestCount = total ?? 0;

        const { count: confirmed } = await supabase
            .from("guests")
            .select("id", { count: "exact", head: true })
            .eq("status", "CONFIRMED")
            .in("group_id", groupIds);
        confirmedCount = confirmed ?? 0;
    }

    const modules = [
        {
            href: `/dashboard/event/${id}/guests`,
            label: "Invitados",
            icon: Users,
            description: "Gestionar lista de invitados y RSVP",
            count: guestCount,
        },
        {
            href: `/dashboard/event/${id}/tables`,
            label: "Mesas",
            icon: LayoutGrid,
            description: "Organizar distribución de mesas",
        },
        {
            href: `/dashboard/event/${id}/gallery`,
            label: "Galería",
            icon: Image,
            description: "Fotos del evento en vivo",
            badge: "Premium",
        },
    ];

    return (
        <div>
            {/* Back */}
            <Link href="/dashboard">
                <Button variant="ghost" className="gap-2 mb-6">
                    <ArrowLeft className="h-4 w-4" />
                    Mis Eventos
                </Button>
            </Link>

            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
                <div>
                    <div className="flex items-center gap-3 mb-1">
                        <h1 className="text-3xl font-heading font-bold tracking-tight">
                            {event.title}
                        </h1>
                        <Badge variant={event.is_published ? "default" : "secondary"}>
                            {event.is_published ? "Publicado" : "Borrador"}
                        </Badge>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1.5">
                            <Calendar className="h-4 w-4" />
                            {new Date(event.date).toLocaleDateString("es-PE", {
                                day: "numeric",
                                month: "long",
                                year: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                            })}
                        </span>
                        {event.location_name && (
                            <span className="flex items-center gap-1.5">
                                <MapPin className="h-4 w-4" />
                                {event.location_name}
                            </span>
                        )}
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    {event.is_published && (
                        <Link href={`/${event.slug}`} target="_blank">
                            <Button variant="outline" size="sm" className="gap-2">
                                <ExternalLink className="h-4 w-4" />
                                Ver micrositio
                            </Button>
                        </Link>
                    )}
                    <PublishToggle eventId={event.id} isPublished={event.is_published} />
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
                <Card>
                    <CardContent className="p-4 text-center">
                        <p className="text-2xl font-bold font-heading text-primary">
                            {guestCount}
                        </p>
                        <p className="text-xs text-muted-foreground">Invitados</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4 text-center">
                        <p className="text-2xl font-bold font-heading text-green-600">
                            {confirmedCount}
                        </p>
                        <p className="text-xs text-muted-foreground">Confirmados</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4 text-center">
                        <p className="text-2xl font-bold font-heading">
                            {guestCount - confirmedCount}
                        </p>
                        <p className="text-xs text-muted-foreground">Pendientes</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                            <Globe className="h-4 w-4 text-muted-foreground" />
                            <p className="text-sm font-medium truncate">/{event.slug}</p>
                        </div>
                        <p className="text-xs text-muted-foreground">URL</p>
                    </CardContent>
                </Card>
            </div>

            {/* Modules Grid */}
            <h2 className="text-lg font-heading font-semibold mb-4">
                Módulos del evento
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {modules.map((mod) => (
                    <Link key={mod.href} href={mod.href}>
                        <Card className="h-full hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 cursor-pointer group">
                            <CardContent className="p-6">
                                <div className="flex items-start justify-between mb-3">
                                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                                        <mod.icon className="h-5 w-5 text-primary" />
                                    </div>
                                    {mod.badge && (
                                        <Badge variant="outline" className="text-xs">
                                            {mod.badge}
                                        </Badge>
                                    )}
                                    {mod.count !== undefined && (
                                        <Badge variant="secondary" className="text-xs">
                                            {mod.count}
                                        </Badge>
                                    )}
                                </div>
                                <h3 className="font-heading font-semibold mb-1">
                                    {mod.label}
                                </h3>
                                <p className="text-sm text-muted-foreground">
                                    {mod.description}
                                </p>
                            </CardContent>
                        </Card>
                    </Link>
                ))}
            </div>
        </div>
    );
}

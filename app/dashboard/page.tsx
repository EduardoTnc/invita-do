import { createClient } from "@/lib/supabase/server";
import { connection } from "next/server";

import Link from "next/link";
import { Plus, Calendar, Users, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Event } from "@/types/database";

interface EventWithGroups extends Event {
    guest_groups: {
        id: string;
        guests: { id: string; status: string }[];
    }[];
}

export default async function DashboardPage() {
    await connection();
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    const { data } = await supabase
        .from("events")
        .select("*, guest_groups(id, guests(id, status))")
        .eq("user_id", user!.id)
        .order("created_at", { ascending: false });

    const eventList = (data as EventWithGroups[] | null) ?? [];

    return (
        <div>
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-heading font-bold tracking-tight">
                        Mis Eventos
                    </h1>
                    <p className="text-muted-foreground mt-1">
                        Gestiona tus invitaciones digitales
                    </p>
                </div>
                <Link href="/dashboard/event/create">
                    <Button className="gap-2">
                        <Plus className="h-4 w-4" />
                        Nuevo evento
                    </Button>
                </Link>
            </div>

            {/* Events Grid */}
            {eventList.length === 0 ? (
                <Card className="border-dashed border-2 border-border/50">
                    <CardContent className="flex flex-col items-center justify-center py-16">
                        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                            <Calendar className="h-8 w-8 text-primary" />
                        </div>
                        <h2 className="text-xl font-heading font-semibold mb-2">
                            No tienes eventos aún
                        </h2>
                        <p className="text-muted-foreground text-center mb-6 max-w-sm">
                            Crea tu primer evento y comparte invitaciones digitales
                            inolvidables.
                        </p>
                        <Link href="/dashboard/event/create">
                            <Button className="gap-2">
                                <Plus className="h-4 w-4" />
                                Crear mi primer evento
                            </Button>
                        </Link>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {eventList.map((event) => {
                        const allGuests = event.guest_groups?.flatMap((g) => g.guests ?? []) ?? [];
                        const confirmed = allGuests.filter((g) => g.status === "CONFIRMED").length;

                        return (
                            <Link key={event.id} href={`/dashboard/event/${event.id}`}>
                                <Card className="group hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 cursor-pointer h-full">
                                    <CardHeader className="pb-3">
                                        <div className="flex items-start justify-between">
                                            <CardTitle className="text-lg font-heading line-clamp-2">
                                                {event.title}
                                            </CardTitle>
                                            <Badge
                                                variant={event.is_published ? "default" : "secondary"}
                                                className="shrink-0 ml-2"
                                            >
                                                {event.is_published ? "Publicado" : "Borrador"}
                                            </Badge>
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-3">
                                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                <Calendar className="h-4 w-4" />
                                                <span>
                                                    {new Date(event.date).toLocaleDateString("es-PE", {
                                                        day: "numeric",
                                                        month: "long",
                                                        year: "numeric",
                                                    })}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                                <div className="flex items-center gap-1.5">
                                                    <Users className="h-4 w-4" />
                                                    <span>
                                                        {confirmed}/{allGuests.length} confirmados
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-1.5">
                                                    <Eye className="h-4 w-4" />
                                                    <span>/{event.slug}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </Link>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

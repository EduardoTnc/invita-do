import { createClient } from "@/lib/supabase/server";
import { connection } from "next/server";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, XCircle, Clock, Trash } from "lucide-react";
import { revalidatePath } from "next/cache";
import Image from "next/image";

export default async function GalleryModerationPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    await connection();
    const { id } = await params;
    const supabase = await createClient();

    const { data: event } = await supabase
        .from("events")
        .select("subscription_tier")
        .eq("id", id)
        .single();

    // En el esquema real profiles tiene subscription_tier, lo dejo simple por ahora
    const isPremium = true; // TODO: Check actual subscription status

    const { data: photos } = await supabase
        .from("gallery_photos")
        .select(`
            *,
            guest:guests(name)
        `)
        .eq("event_id", id)
        .order("created_at", { ascending: false });

    async function approvePhoto(photoId: string) {
        "use server";
        const sb = await createClient();
        await sb.from("gallery_photos").update({ status: "APPROVED" }).eq("id", photoId);
        revalidatePath(`/dashboard/event/${id}/gallery`);
    }

    async function rejectPhoto(photoId: string) {
        "use server";
        const sb = await createClient();
        await sb.from("gallery_photos").update({ status: "REJECTED" }).eq("id", photoId);
        revalidatePath(`/dashboard/event/${id}/gallery`);
    }

    if (!isPremium) {
        return (
            <div className="flex flex-col items-center justify-center p-12 text-center border rounded-xl bg-muted/20">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                    <span className="text-2xl">📸</span>
                </div>
                <h3 className="text-xl font-bold mb-2">Galería en Vivo Premium</h3>
                <p className="text-muted-foreground mb-6 max-w-md">
                    Actualiza a un plan Premium para permitir que tus invitados suban fotos en tiempo real durante tu evento.
                </p>
                <Button>Mejorar Plan</Button>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold tracking-tight">Moderación de Galería</h2>
                <p className="text-muted-foreground mt-1">
                    Aprueba o rechaza las fotos subidas por tus invitados antes de que aparezcan en el micrositio.
                </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {!photos || photos.length === 0 ? (
                    <div className="col-span-full py-12 text-center text-muted-foreground">
                        Aún no hay fotos subidas a la galería.
                    </div>
                ) : (
                    photos.map((photo) => (
                        <Card key={photo.id} className="overflow-hidden group">
                            <div className="relative aspect-[4/5] bg-muted">
                                {photo.url ? (
                                    <Image
                                        src={photo.url}
                                        alt="Event photo"
                                        fill
                                        className="object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                                        Sin previsualización
                                    </div>
                                )}
                                <div className="absolute top-2 right-2 flex flex-col gap-1">
                                    {photo.status === "PENDING_MODERATION" && <Badge variant="secondary" className="bg-yellow-500/10 text-yellow-600 border-yellow-500/20"><Clock className="w-3 h-3 mr-1" /> Pendiente</Badge>}
                                    {photo.status === "APPROVED" && <Badge variant="secondary" className="bg-green-500/10 text-green-600 border-green-500/20"><CheckCircle className="w-3 h-3 mr-1" /> Aprobada</Badge>}
                                    {photo.status === "REJECTED" && <Badge variant="secondary" className="bg-destructive/10 text-destructive border-destructive/20"><XCircle className="w-3 h-3 mr-1" /> Rechazada</Badge>}
                                </div>
                            </div>
                            <CardContent className="p-4 bg-background">
                                <p className="text-sm font-medium truncate mb-4">
                                    Subida por: {photo.guest?.name || "Anónimo"}
                                </p>
                                <div className="flex gap-2">
                                    {photo.status !== "APPROVED" && (
                                        <form action={approvePhoto.bind(null, photo.id)} className="flex-1">
                                            <Button type="submit" size="sm" variant="outline" className="w-full border-green-500/20 hover:bg-green-500/10 text-green-600">
                                                Aprobar
                                            </Button>
                                        </form>
                                    )}
                                    {photo.status !== "REJECTED" && (
                                        <form action={rejectPhoto.bind(null, photo.id)} className="flex-1">
                                            <Button type="submit" size="sm" variant="outline" className="w-full border-destructive/20 hover:bg-destructive/10 text-destructive">
                                                Rechazar
                                            </Button>
                                        </form>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>
        </div>
    );
}

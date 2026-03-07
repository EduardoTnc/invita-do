"use client";

import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { toggleEventPublished } from "@/lib/actions/events";
import { Globe, Loader2 } from "lucide-react";
import { toast } from "sonner";

export function PublishToggle({
    eventId,
    isPublished,
}: {
    eventId: string;
    isPublished: boolean;
}) {
    const [isPending, startTransition] = useTransition();

    const handleToggle = () => {
        startTransition(async () => {
            try {
                await toggleEventPublished(eventId, !isPublished);
                toast.success(
                    isPublished ? "Evento despublicado" : "¡Evento publicado! 🎉"
                );
            } catch {
                toast.error("Error al cambiar el estado");
            }
        });
    };

    return (
        <Button
            onClick={handleToggle}
            disabled={isPending}
            variant={isPublished ? "outline" : "default"}
            size="sm"
            className="gap-2"
        >
            {isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
                <Globe className="h-4 w-4" />
            )}
            {isPublished ? "Despublicar" : "Publicar"}
        </Button>
    );
}

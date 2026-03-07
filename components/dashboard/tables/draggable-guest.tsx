"use client";

import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical } from "lucide-react";
import { cn } from "@/lib/utils";

type Guest = { id: string; name: string };

export function DraggableGuest({ guest }: { guest: Guest }) {
    const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
        id: guest.id,
        data: {
            type: "Guest",
            guest,
        },
    });

    const style = {
        transform: CSS.Translate.toString(transform),
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            className={cn(
                "flex items-center p-3 bg-background border rounded-md shadow-sm cursor-grab active:cursor-grabbing hover:border-primary transition-colors",
                isDragging && "opacity-50 ring-2 ring-primary border-primary z-50"
            )}
        >
            <GripVertical className="w-4 h-4 text-muted-foreground mr-2" />
            <span className="text-sm font-medium">{guest.name}</span>
        </div>
    );
}

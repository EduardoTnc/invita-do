"use client";

import { useDroppable, useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { Users, MoreVertical } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

type Guest = { id: string; name: string };
type Seat = { id: string; seat_number: number; guest_id: string | null; guest?: Guest };
type Table = { id: string; name: string; capacity: number; seats: Seat[] };

export function SortableTable({ table }: { table: Table }) {
    // A table itself could be droppable or draggable in a future canvas, 
    // but right now it just holds droppable seats.
    const filledSeats = table.seats.filter(s => s.guest_id).length;

    return (
        <div className="bg-background border rounded-lg shadow-sm flex flex-col h-full">
            <div className="p-4 border-b flex items-center justify-between bg-muted/20">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <Users className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                        <h3 className="font-semibold">{table.name}</h3>
                        <p className="text-xs text-muted-foreground">
                            {filledSeats} / {table.capacity} ocupados
                        </p>
                    </div>
                </div>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreVertical className="w-4 h-4" />
                </Button>
            </div>

            <div className="p-4 grid grid-cols-2 gap-3 flex-1 content-start">
                {table.seats.map(seat => (
                    <DroppableSeat key={seat.id} seat={seat} />
                ))}
            </div>
        </div>
    );
}

function DroppableSeat({ seat }: { seat: Seat }) {
    const { setNodeRef, isOver } = useDroppable({
        id: seat.id,
        data: {
            type: "Seat",
            seat,
        },
    });

    return (
        <div
            ref={setNodeRef}
            className={cn(
                "h-12 border-2 border-dashed rounded-md flex items-center justify-center text-sm transition-colors",
                isOver ? "border-primary bg-primary/5" : "border-muted-foreground/25",
                seat.guest_id ? "border-solid border-muted bg-muted/30 p-0" : "text-muted-foreground"
            )}
        >
            {seat.guest_id ? (
                <DraggableSeatGuest seat={seat} />
            ) : (
                <span className="opacity-50 text-xs">Asiento {seat.seat_number}</span>
            )}
        </div>
    );
}

function DraggableSeatGuest({ seat }: { seat: Seat }) {
    const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
        id: seat.id + "-guest", // unique id for dragging out of seat
        data: {
            type: "SeatGuest",
            seat,
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
                "w-full h-full flex items-center justify-center p-2 bg-background border border-primary/20 rounded shadow-sm text-xs font-medium cursor-grab active:cursor-grabbing",
                isDragging && "opacity-50 ring-2 ring-primary"
            )}
        >
            <span className="truncate">{seat.guest?.name}</span>
        </div>
    );
}

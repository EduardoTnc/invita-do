"use client";

import { useState } from "react";
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragEndEvent,
} from "@dnd-kit/core";
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
} from "@dnd-kit/sortable";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Users, UtensilsCrossed } from "lucide-react";

import { assignSeat } from "@/lib/actions/tables";
import { DraggableGuest } from "./draggable-guest";
import { SortableTable } from "./sortable-table";

// Tipos base (simplificados para el UI)
type Guest = { id: string; name: string };
type Seat = { id: string; seat_number: number; guest_id: string | null; guest?: Guest };
type Table = { id: string; name: string; capacity: number; seats: Seat[] };

export function TableManager({
    initialTables,
    initialUnseatedGuests,
    eventId,
}: {
    initialTables: Table[];
    initialUnseatedGuests: Guest[];
    eventId: string;
}) {
    const [tables, setTables] = useState<Table[]>(initialTables);
    const [unseatedGuests, setUnseatedGuests] = useState<Guest[]>(initialUnseatedGuests);
    const [isSaving, setIsSaving] = useState(false);

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 5,
            },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const handleDragEnd = async (event: DragEndEvent) => {
        const { active, over } = event;

        if (!over) return;

        const activeId = active.id.toString(); // guest id o seat id
        const overId = over.id.toString(); // seat id o list id

        // Optimizamos lógica: Asignar un invitado (de la lista) a un asiento (en una mesa)
        try {
            setIsSaving(true);

            // Si movemos un invitado de la lista a un asiento vacío
            if (active.data.current?.type === "Guest" && over.data.current?.type === "Seat") {
                const guest = active.data.current.guest as Guest;
                const targetSeat = over.data.current.seat as Seat;

                if (targetSeat.guest_id) return; // Asiento ocupado

                // Optimistic Update
                setUnseatedGuests(prev => prev.filter(g => g.id !== guest.id));
                setTables(prev => prev.map(t => ({
                    ...t,
                    seats: t.seats.map(s => s.id === targetSeat.id ? { ...s, guest_id: guest.id, guest } : s)
                })));

                // Server Update
                await assignSeat(targetSeat.id, guest.id, eventId);
            }
            // Si movemos un invitado de un asiento a otro asiento
            else if (active.data.current?.type === "SeatGuest" && over.data.current?.type === "Seat") {
                const sourceSeat = active.data.current.seat as Seat;
                const targetSeat = over.data.current.seat as Seat;

                if (sourceSeat.id === targetSeat.id || targetSeat.guest_id) return;

                const guest = sourceSeat.guest!;

                // Optimistic Update
                setTables(prev => prev.map(t => ({
                    ...t,
                    seats: t.seats.map(s => {
                        if (s.id === sourceSeat.id) return { ...s, guest_id: null, guest: undefined };
                        if (s.id === targetSeat.id) return { ...s, guest_id: guest.id, guest };
                        return s;
                    })
                })));

                // Server Update
                await assignSeat(targetSeat.id, guest.id, eventId);
            }
        } catch (error) {
            console.error("Error asignando asiento:", error);
            // Revert changes on error (simple reload for now)
            window.location.reload();
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-12rem)] min-h-[600px]">
                {/* Panel Izquierdo: Lista de Invitados sin mesa */}
                <Card className="w-full lg:w-1/4 h-full flex flex-col">
                    <CardHeader className="pb-3 border-b">
                        <CardTitle className="flex items-center gap-2 text-lg">
                            <Users className="w-5 h-5 text-muted-foreground" />
                            Pendientes
                            <span className="ml-auto bg-primary/10 text-primary text-xs py-1 px-2 rounded-full">
                                {unseatedGuests.length}
                            </span>
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="flex-1 overflow-y-auto p-4 space-y-2">
                        {unseatedGuests.length === 0 ? (
                            <div className="text-center text-sm text-muted-foreground py-10">
                                Todos los invitados tienen mesa 🎉
                            </div>
                        ) : (
                            unseatedGuests.map((guest) => (
                                <DraggableGuest key={guest.id} guest={guest} />
                            ))
                        )}
                    </CardContent>
                </Card>

                {/* Panel Derecho: Mapa de Mesas */}
                <Card className="w-full lg:w-3/4 h-full flex flex-col bg-muted/30">
                    <CardHeader className="pb-3 border-b flex flex-row items-center justify-between">
                        <CardTitle className="flex items-center gap-2 text-lg">
                            <UtensilsCrossed className="w-5 h-5 text-muted-foreground" />
                            Plano de Mesas
                        </CardTitle>
                        <div className="flex gap-2">
                            <Button variant="outline" size="sm" onClick={() => { }} disabled={isSaving}>
                                Auto-Organizar IA
                            </Button>
                            <Button size="sm" onClick={() => { }}>
                                <Plus className="w-4 h-4 mr-2" /> Agregar Mesa
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent className="flex-1 overflow-y-auto p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {tables.map(table => (
                                <SortableTable key={table.id} table={table} />
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </DndContext>
    );
}

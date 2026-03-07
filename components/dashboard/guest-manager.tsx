"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
    ArrowLeft,
    Plus,
    Users,
    UserPlus,
    Loader2,
    Trash2,
    Check,
    X,
    Clock,
    Eye,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import {
    createGuestGroup,
    addGuest,
    updateGuestStatus,
    deleteGuest,
    deleteGuestGroup,
} from "@/lib/actions/guests";
import Link from "next/link";

interface Guest {
    id: string;
    name: string;
    email: string | null;
    phone: string | null;
    status: string;
    dietary_restrictions: string | null;
    is_child: boolean;
    is_primary: boolean;
}

interface GuestGroup {
    id: string;
    name: string;
    max_companions: number;
    tags: string[];
    guests: Guest[];
}

const statusConfig: Record<
    string,
    { label: string; color: string; icon: typeof Check }
> = {
    PENDING: { label: "Pendiente", color: "text-yellow-500", icon: Clock },
    VIEWED: { label: "Visto", color: "text-blue-500", icon: Eye },
    CONFIRMED: { label: "Confirmado", color: "text-green-500", icon: Check },
    DECLINED: { label: "Declinado", color: "text-red-500", icon: X },
};

export function GuestManager({
    eventId,
    eventTitle,
    maxGuestsFree,
    initialGroups,
}: {
    eventId: string;
    eventTitle: string;
    maxGuestsFree: number;
    initialGroups: GuestGroup[];
}) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const [newGroupName, setNewGroupName] = useState("");
    const [newGroupMaxComp, setNewGroupMaxComp] = useState(1);
    const [addGuestGroupId, setAddGuestGroupId] = useState<string | null>(null);
    const [newGuestName, setNewGuestName] = useState("");
    const [newGuestEmail, setNewGuestEmail] = useState("");
    const [isGroupDialogOpen, setIsGroupDialogOpen] = useState(false);
    const [isGuestDialogOpen, setIsGuestDialogOpen] = useState(false);

    const totalGuests = initialGroups.reduce(
        (acc, g) => acc + g.guests.length,
        0
    );

    const confirmed = initialGroups.reduce(
        (acc, g) =>
            acc + g.guests.filter((guest) => guest.status === "CONFIRMED").length,
        0
    );

    const handleCreateGroup = () => {
        if (!newGroupName.trim()) return;
        startTransition(async () => {
            try {
                await createGuestGroup(
                    eventId,
                    newGroupName,
                    newGroupMaxComp,
                    []
                );
                setNewGroupName("");
                setNewGroupMaxComp(1);
                setIsGroupDialogOpen(false);
                toast.success("Grupo creado");
                router.refresh();
            } catch (e) {
                toast.error(e instanceof Error ? e.message : "Error");
            }
        });
    };

    const handleAddGuest = () => {
        if (!newGuestName.trim() || !addGuestGroupId) return;
        startTransition(async () => {
            try {
                await addGuest(addGuestGroupId, eventId, {
                    name: newGuestName,
                    email: newGuestEmail || undefined,
                    is_primary: false,
                });
                setNewGuestName("");
                setNewGuestEmail("");
                setIsGuestDialogOpen(false);
                toast.success("Invitado agregado");
                router.refresh();
            } catch (e) {
                toast.error(e instanceof Error ? e.message : "Error");
            }
        });
    };

    const handleDeleteGuest = (guestId: string) => {
        startTransition(async () => {
            try {
                await deleteGuest(guestId, eventId);
                toast.success("Invitado eliminado");
                router.refresh();
            } catch (e) {
                toast.error(e instanceof Error ? e.message : "Error");
            }
        });
    };

    const handleDeleteGroup = (groupId: string) => {
        startTransition(async () => {
            try {
                await deleteGuestGroup(groupId, eventId);
                toast.success("Grupo eliminado");
                router.refresh();
            } catch (e) {
                toast.error(e instanceof Error ? e.message : "Error");
            }
        });
    };

    return (
        <div>
            {/* Header */}
            <Link href={`/dashboard/event/${eventId}`}>
                <Button variant="ghost" className="gap-2 mb-6">
                    <ArrowLeft className="h-4 w-4" />
                    {eventTitle}
                </Button>
            </Link>

            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-heading font-bold">Invitados</h1>
                    <p className="text-sm text-muted-foreground mt-1">
                        {confirmed}/{totalGuests} confirmados · Límite gratuito:{" "}
                        {maxGuestsFree}
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <Dialog
                        open={isGroupDialogOpen}
                        onOpenChange={setIsGroupDialogOpen}
                    >
                        <DialogTrigger className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-3">
                            <Users className="h-4 w-4" />
                            Nuevo grupo
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Crear grupo de invitados</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4 mt-4">
                                <div className="space-y-2">
                                    <Label>Nombre del grupo</Label>
                                    <Input
                                        placeholder='Ej: "Familia García"'
                                        value={newGroupName}
                                        onChange={(e) => setNewGroupName(e.target.value)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Máximo de acompañantes</Label>
                                    <Input
                                        type="number"
                                        min={0}
                                        max={20}
                                        value={newGroupMaxComp}
                                        onChange={(e) =>
                                            setNewGroupMaxComp(Number(e.target.value))
                                        }
                                    />
                                </div>
                                <Button
                                    onClick={handleCreateGroup}
                                    disabled={isPending || !newGroupName.trim()}
                                    className="w-full gap-2"
                                >
                                    {isPending ? (
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                    ) : (
                                        <Plus className="h-4 w-4" />
                                    )}
                                    Crear grupo
                                </Button>
                            </div>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            {/* Groups */}
            {initialGroups.length === 0 ? (
                <Card className="border-dashed border-2">
                    <CardContent className="flex flex-col items-center py-12">
                        <Users className="h-12 w-12 text-muted-foreground mb-4" />
                        <p className="text-muted-foreground text-center mb-4">
                            No hay grupos de invitados. Crea tu primer grupo para comenzar.
                        </p>
                    </CardContent>
                </Card>
            ) : (
                <div className="space-y-4">
                    {initialGroups.map((group) => (
                        <Card key={group.id}>
                            <CardHeader className="pb-3">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <CardTitle className="text-base font-heading">
                                            {group.name}
                                        </CardTitle>
                                        <Badge variant="secondary" className="text-xs">
                                            {group.guests.length} invitado
                                            {group.guests.length !== 1 ? "s" : ""}
                                        </Badge>
                                        <Badge variant="outline" className="text-xs">
                                            +{group.max_companions} acomp.
                                        </Badge>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => {
                                                setAddGuestGroupId(group.id);
                                                setIsGuestDialogOpen(true);
                                            }}
                                        >
                                            <UserPlus className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => handleDeleteGroup(group.id)}
                                            className="text-destructive hover:text-destructive"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            </CardHeader>
                            {group.guests.length > 0 && (
                                <CardContent className="pt-0">
                                    <Separator className="mb-3" />
                                    <div className="space-y-2">
                                        {group.guests.map((guest) => {
                                            const status = statusConfig[guest.status] ?? statusConfig.PENDING;
                                            const StatusIcon = status.icon;
                                            return (
                                                <div
                                                    key={guest.id}
                                                    className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-muted/50 transition-colors"
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <StatusIcon
                                                            className={`h-4 w-4 ${status.color}`}
                                                        />
                                                        <div>
                                                            <p className="text-sm font-medium">
                                                                {guest.name}
                                                                {guest.is_child && (
                                                                    <span className="text-xs text-muted-foreground ml-1">
                                                                        (niño)
                                                                    </span>
                                                                )}
                                                            </p>
                                                            {guest.email && (
                                                                <p className="text-xs text-muted-foreground">
                                                                    {guest.email}
                                                                </p>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-1">
                                                        <Badge
                                                            variant="outline"
                                                            className={`text-xs ${status.color}`}
                                                        >
                                                            {status.label}
                                                        </Badge>
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => handleDeleteGuest(guest.id)}
                                                            className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
                                                        >
                                                            <Trash2 className="h-3 w-3" />
                                                        </Button>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </CardContent>
                            )}
                        </Card>
                    ))}
                </div>
            )}

            {/* Add Guest Dialog */}
            <Dialog open={isGuestDialogOpen} onOpenChange={setIsGuestDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Agregar invitado</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 mt-4">
                        <div className="space-y-2">
                            <Label>Nombre *</Label>
                            <Input
                                placeholder="Nombre del invitado"
                                value={newGuestName}
                                onChange={(e) => setNewGuestName(e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Email (opcional)</Label>
                            <Input
                                type="email"
                                placeholder="email@ejemplo.com"
                                value={newGuestEmail}
                                onChange={(e) => setNewGuestEmail(e.target.value)}
                            />
                        </div>
                        <Button
                            onClick={handleAddGuest}
                            disabled={isPending || !newGuestName.trim()}
                            className="w-full gap-2"
                        >
                            {isPending ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                                <UserPlus className="h-4 w-4" />
                            )}
                            Agregar invitado
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}

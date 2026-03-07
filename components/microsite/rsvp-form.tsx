"use client";

import { useState } from "react";
import { Search, CheckCircle2, XCircle, ArrowRight, Loader2, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { motion, AnimatePresence } from "framer-motion";

type GuestMember = {
    id: string;
    name: string;
    status: 'PENDING' | 'CONFIRMED' | 'CANCELLED';
    dietary_restrictions: string | null;
};

type SearchResult = {
    groupId?: string;
    groupName: string;
    members: GuestMember[];
};

export function RsvpForm({ eventId }: { eventId: string }) {
    const [searchQuery, setSearchQuery] = useState("");
    const [isSearching, setIsSearching] = useState(false);
    const [results, setResults] = useState<SearchResult[] | null>(null);
    const [selectedGroup, setSelectedGroup] = useState<SearchResult | null>(null);

    // For submission
    const [formData, setFormData] = useState<Record<string, { attending: boolean; dietary: string }>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const handleSearch = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        if (searchQuery.trim().length < 2) return;

        setIsSearching(true);
        setResults(null);
        setSelectedGroup(null);

        try {
            const res = await fetch("/api/rsvp/search", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ eventId, name: searchQuery }),
            });
            const data = await res.json();
            if (Array.isArray(data)) {
                setResults(data);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setIsSearching(false);
        }
    };

    const handleSelectGroup = (group: SearchResult) => {
        setSelectedGroup(group);
        // Initialize form data
        const initialForm: Record<string, { attending: boolean; dietary: string }> = {};
        group.members.forEach(member => {
            initialForm[member.id] = {
                attending: member.status !== 'CANCELLED',
                dietary: member.dietary_restrictions || ""
            };
        });
        setFormData(initialForm);
    };

    const handleSubmit = async () => {
        if (!selectedGroup) return;
        setIsSubmitting(true);

        const membersPayload = selectedGroup.members.map(member => ({
            id: member.id,
            status: formData[member.id].attending ? 'CONFIRMED' : 'CANCELLED',
            dietary_restrictions: formData[member.id].dietary,
        }));

        try {
            const res = await fetch("/api/rsvp/submit", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ members: membersPayload }),
            });

            if (res.ok) {
                setIsSuccess(true);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isSuccess) {
        return (
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
                <Card className="border-primary/20 bg-primary/5">
                    <CardContent className="p-8 text-center">
                        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-500/10 flex items-center justify-center">
                            <CheckCircle2 className="h-8 w-8 text-green-500" />
                        </div>
                        <h3 className="text-lg font-heading font-semibold mb-2">
                            ¡Asistencia Registrada!
                        </h3>
                        <p className="text-sm text-muted-foreground">
                            Hemos guardado tu respuesta. Gracias por confirmar.
                        </p>
                    </CardContent>
                </Card>
            </motion.div>
        );
    }

    return (
        <Card className="relative overflow-hidden w-full max-w-lg mx-auto">
            <CardContent className="p-6">
                <AnimatePresence mode="wait">
                    {!selectedGroup ? (
                        <motion.div
                            key="search-step"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                        >
                            <form onSubmit={handleSearch} className="space-y-4">
                                <Label htmlFor="guestName" className="text-center block text-muted-foreground mb-4">
                                    Busca tu nombre completo
                                </Label>
                                <div className="flex gap-2">
                                    <Input
                                        id="guestName"
                                        placeholder="Ej. Juan Pérez"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="h-12"
                                    />
                                    <Button type="submit" className="h-12 px-6" disabled={isSearching || searchQuery.length < 2}>
                                        {isSearching ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
                                    </Button>
                                </div>
                            </form>

                            {results && results.length > 0 && (
                                <div className="mt-6 space-y-2">
                                    <p className="text-sm font-medium mb-3">Resultados encontrados:</p>
                                    {results.map((result, i) => (
                                        <button
                                            key={i}
                                            onClick={() => handleSelectGroup(result)}
                                            className="w-full flex items-center justify-between p-3 rounded-md border hover:bg-muted text-left transition-colors"
                                        >
                                            <div>
                                                <div className="font-medium text-sm">{result.groupName}</div>
                                                <div className="text-xs text-muted-foreground">
                                                    {result.members.length} {result.members.length === 1 ? 'Invitado' : 'Invitados'}
                                                </div>
                                            </div>
                                            <ArrowRight className="h-4 w-4 text-muted-foreground" />
                                        </button>
                                    ))}
                                </div>
                            )}

                            {results && results.length === 0 && (
                                <div className="mt-6 text-center text-sm text-muted-foreground p-4 bg-muted/50 rounded-md">
                                    No pudimos encontrar tu nombre. Asegúrate de escribirlo tal como fue en la invitación.
                                </div>
                            )}
                        </motion.div>
                    ) : (
                        <motion.div
                            key="form-step"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            className="space-y-6 text-left"
                        >
                            <div className="flex items-center justify-between border-b pb-4">
                                <div>
                                    <h3 className="font-semibold text-lg">{selectedGroup.groupName}</h3>
                                    <p className="text-xs text-muted-foreground">Por favor confirma la asistencia de cada invitado.</p>
                                </div>
                                <Button variant="ghost" size="sm" onClick={() => setSelectedGroup(null)}>Volver</Button>
                            </div>

                            <div className="space-y-6">
                                {selectedGroup.members.map(member => (
                                    <div key={member.id} className="p-4 rounded-lg border bg-card space-y-4">
                                        <div className="flex items-center justify-between">
                                            <Label className="font-medium text-base">{member.name}</Label>
                                            <div className="flex items-center gap-2">
                                                <span className="text-sm text-muted-foreground">
                                                    {formData[member.id].attending ? "Asistirá" : "No Asistirá"}
                                                </span>
                                                <Switch
                                                    checked={formData[member.id].attending}
                                                    onCheckedChange={(c: boolean) => setFormData(prev => ({
                                                        ...prev,
                                                        [member.id]: { ...prev[member.id], attending: c }
                                                    }))}
                                                />
                                            </div>
                                        </div>

                                        <AnimatePresence>
                                            {formData[member.id].attending && (
                                                <motion.div
                                                    initial={{ height: 0, opacity: 0 }}
                                                    animate={{ height: "auto", opacity: 1 }}
                                                    exit={{ height: 0, opacity: 0 }}
                                                >
                                                    <div className="space-y-2 mt-2">
                                                        <Label className="text-xs text-muted-foreground">Restricciones Alimentarias (Opcional)</Label>
                                                        <Input
                                                            placeholder="Alergias, vegano, celíaco..."
                                                            value={formData[member.id].dietary}
                                                            onChange={(e) => setFormData(prev => ({
                                                                ...prev,
                                                                [member.id]: { ...prev[member.id], dietary: e.target.value }
                                                            }))}
                                                            className="h-9 text-sm"
                                                        />
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                ))}
                            </div>

                            <div className="pt-4">
                                <Button className="w-full h-12 text-base" onClick={handleSubmit} disabled={isSubmitting}>
                                    {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Enviar Respuestas"}
                                </Button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </CardContent>
        </Card>
    );
}

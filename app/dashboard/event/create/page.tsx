"use client";

import { useState, useTransition, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
    ArrowLeft,
    ArrowRight,
    Sparkles,
    Calendar,
    MapPin,
    Type,
    Loader2,
    Lock,
    Check,
    X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { createEvent, checkSlugAvailability } from "@/lib/actions/events";

const eventTypes = [
    { value: "boda", label: "💍 Boda" },
    { value: "xv", label: "👑 XV Años" },
    { value: "bautizo", label: "✝️ Bautizo" },
    { value: "cumpleanos", label: "🎂 Cumpleaños" },
    { value: "graduacion", label: "🎓 Graduación" },
    { value: "baby-shower", label: "👶 Baby Shower" },
    { value: "corporativo", label: "🏢 Corporativo" },
    { value: "otro", label: "🎉 Otro" },
];

const steps = [
    { id: 1, title: "Tipo y nombre", icon: Type },
    { id: 2, title: "Fecha y lugar", icon: Calendar },
    { id: 3, title: "URL y privacidad", icon: Lock },
];

function slugify(text: string): string {
    return text
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "")
        .slice(0, 100);
}

export default function CreateEventPage() {
    const router = useRouter();
    const [currentStep, setCurrentStep] = useState(1);
    const [isPending, startTransition] = useTransition();

    // Form state
    const [eventType, setEventType] = useState("");
    const [title, setTitle] = useState("");
    const [date, setDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [locationName, setLocationName] = useState("");
    const [locationAddress, setLocationAddress] = useState("");
    const [slug, setSlug] = useState("");
    const [slugStatus, setSlugStatus] = useState<
        "idle" | "checking" | "available" | "taken"
    >("idle");
    const [isPrivate, setIsPrivate] = useState(false);
    const [pin, setPin] = useState("");

    // Auto-generate slug from title
    const handleTitleChange = (value: string) => {
        setTitle(value);
        const newSlug = slugify(value);
        setSlug(newSlug);
        if (newSlug.length >= 3) {
            checkSlug(newSlug);
        } else {
            setSlugStatus("idle");
        }
    };

    const checkSlug = useCallback(
        debounce(async (s: string) => {
            setSlugStatus("checking");
            try {
                const { available } = await checkSlugAvailability(s);
                setSlugStatus(available ? "available" : "taken");
            } catch {
                setSlugStatus("idle");
            }
        }, 500),
        []
    );

    const handleSlugChange = (value: string) => {
        const cleaned = slugify(value);
        setSlug(cleaned);
        if (cleaned.length >= 3) {
            checkSlug(cleaned);
        } else {
            setSlugStatus("idle");
        }
    };

    const canGoNext = () => {
        switch (currentStep) {
            case 1:
                return eventType && title.length >= 3;
            case 2:
                return !!date;
            case 3:
                return slug.length >= 3 && slugStatus === "available";
            default:
                return false;
        }
    };

    const handleSubmit = () => {
        startTransition(async () => {
            try {
                const formData = new FormData();
                formData.set("title", title);
                formData.set("slug", slug);
                formData.set("event_type", eventType);
                formData.set("date", date);
                formData.set("end_date", endDate);
                formData.set("location_name", locationName);
                formData.set("location_address", locationAddress);
                formData.set("is_private", String(isPrivate));
                formData.set("pin", pin);

                await createEvent(formData);
                toast.success("¡Evento creado exitosamente!");
            } catch (error) {
                toast.error(
                    error instanceof Error ? error.message : "Error al crear evento"
                );
            }
        });
    };

    return (
        <div className="max-w-2xl mx-auto">
            {/* Back Button */}
            <Button
                variant="ghost"
                className="gap-2 mb-6"
                onClick={() => router.push("/dashboard")}
            >
                <ArrowLeft className="h-4 w-4" />
                Volver
            </Button>

            <h1 className="text-3xl font-heading font-bold tracking-tight mb-2">
                Crear nuevo evento
            </h1>
            <p className="text-muted-foreground mb-8">
                Configura los datos básicos de tu evento en tres pasos simples.
            </p>

            {/* Step Indicators */}
            <div className="flex items-center gap-2 mb-8">
                {steps.map((step, i) => (
                    <div key={step.id} className="flex items-center gap-2 flex-1">
                        <div
                            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${currentStep === step.id
                                    ? "bg-primary/10 text-primary"
                                    : currentStep > step.id
                                        ? "bg-success/10 text-success"
                                        : "bg-muted text-muted-foreground"
                                }`}
                        >
                            {currentStep > step.id ? (
                                <Check className="h-4 w-4" />
                            ) : (
                                <step.icon className="h-4 w-4" />
                            )}
                            <span className="hidden sm:inline">{step.title}</span>
                        </div>
                        {i < steps.length - 1 && (
                            <div className="flex-1 h-0.5 bg-border" />
                        )}
                    </div>
                ))}
            </div>

            {/* Step Content */}
            <Card>
                <CardContent className="p-6">
                    <AnimatePresence mode="wait">
                        {/* Step 1: Type & Title */}
                        {currentStep === 1 && (
                            <motion.div
                                key="step1"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-6"
                            >
                                <div className="space-y-3">
                                    <Label>Tipo de evento</Label>
                                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                                        {eventTypes.map((type) => (
                                            <button
                                                key={type.value}
                                                type="button"
                                                onClick={() => setEventType(type.value)}
                                                className={`px-3 py-3 rounded-lg border text-sm font-medium transition-all ${eventType === type.value
                                                        ? "border-primary bg-primary/5 text-primary"
                                                        : "border-border hover:border-primary/30"
                                                    }`}
                                            >
                                                {type.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="title">Nombre del evento</Label>
                                    <Input
                                        id="title"
                                        placeholder='Ej: "Boda de Juan y Ana"'
                                        value={title}
                                        onChange={(e) => handleTitleChange(e.target.value)}
                                        className="h-12 text-base"
                                    />
                                </div>
                            </motion.div>
                        )}

                        {/* Step 2: Date & Location */}
                        {currentStep === 2 && (
                            <motion.div
                                key="step2"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-6"
                            >
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="date">Fecha del evento *</Label>
                                        <Input
                                            id="date"
                                            type="datetime-local"
                                            value={date}
                                            onChange={(e) => setDate(e.target.value)}
                                            className="h-12"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="endDate">Fecha de cierre (opcional)</Label>
                                        <Input
                                            id="endDate"
                                            type="datetime-local"
                                            value={endDate}
                                            onChange={(e) => setEndDate(e.target.value)}
                                            className="h-12"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="locationName">
                                        <MapPin className="h-4 w-4 inline mr-1" />
                                        Nombre del lugar
                                    </Label>
                                    <Input
                                        id="locationName"
                                        placeholder='Ej: "Hacienda Los Olivos"'
                                        value={locationName}
                                        onChange={(e) => setLocationName(e.target.value)}
                                        className="h-12"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="locationAddress">Dirección</Label>
                                    <Textarea
                                        id="locationAddress"
                                        placeholder="Dirección completa del evento"
                                        value={locationAddress}
                                        onChange={(e) => setLocationAddress(e.target.value)}
                                        rows={2}
                                    />
                                </div>
                            </motion.div>
                        )}

                        {/* Step 3: Slug & Privacy */}
                        {currentStep === 3 && (
                            <motion.div
                                key="step3"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-6"
                            >
                                <div className="space-y-2">
                                    <Label htmlFor="slug">URL de tu invitación</Label>
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm text-muted-foreground whitespace-nowrap">
                                            invita.do/
                                        </span>
                                        <div className="relative flex-1">
                                            <Input
                                                id="slug"
                                                placeholder="boda-juan-ana"
                                                value={slug}
                                                onChange={(e) => handleSlugChange(e.target.value)}
                                                className="h-12 pr-10"
                                            />
                                            <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                                {slugStatus === "checking" && (
                                                    <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                                                )}
                                                {slugStatus === "available" && (
                                                    <Check className="h-4 w-4 text-green-500" />
                                                )}
                                                {slugStatus === "taken" && (
                                                    <X className="h-4 w-4 text-destructive" />
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    {slugStatus === "taken" && (
                                        <p className="text-xs text-destructive">
                                            Este slug ya está en uso. Prueba con otro.
                                        </p>
                                    )}
                                    {slugStatus === "available" && (
                                        <p className="text-xs text-green-600">
                                            ¡Disponible! ✨
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <Label>Evento privado</Label>
                                        <button
                                            type="button"
                                            onClick={() => setIsPrivate(!isPrivate)}
                                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${isPrivate ? "bg-primary" : "bg-muted"
                                                }`}
                                        >
                                            <span
                                                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${isPrivate ? "translate-x-6" : "translate-x-1"
                                                    }`}
                                            />
                                        </button>
                                    </div>
                                    {isPrivate && (
                                        <motion.div
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: "auto" }}
                                            className="space-y-2"
                                        >
                                            <Label htmlFor="pin">PIN de acceso (4 dígitos)</Label>
                                            <Input
                                                id="pin"
                                                type="text"
                                                inputMode="numeric"
                                                maxLength={4}
                                                placeholder="0000"
                                                value={pin}
                                                onChange={(e) =>
                                                    setPin(e.target.value.replace(/\D/g, "").slice(0, 4))
                                                }
                                                className="h-12 w-32 text-center text-xl tracking-widest"
                                            />
                                        </motion.div>
                                    )}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Navigation */}
                    <div className="flex items-center justify-between mt-8 pt-6 border-t border-border/50">
                        <Button
                            variant="ghost"
                            onClick={() => setCurrentStep((s) => s - 1)}
                            disabled={currentStep === 1}
                            className="gap-2"
                        >
                            <ArrowLeft className="h-4 w-4" />
                            Anterior
                        </Button>

                        {currentStep < 3 ? (
                            <Button
                                onClick={() => setCurrentStep((s) => s + 1)}
                                disabled={!canGoNext()}
                                className="gap-2"
                            >
                                Siguiente
                                <ArrowRight className="h-4 w-4" />
                            </Button>
                        ) : (
                            <Button
                                onClick={handleSubmit}
                                disabled={!canGoNext() || isPending}
                                className="gap-2"
                            >
                                {isPending ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                    <Sparkles className="h-4 w-4" />
                                )}
                                Crear evento
                            </Button>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

// ── Debounce utility ──
function debounce<T extends (...args: Parameters<T>) => void>(
    fn: T,
    delay: number
): T {
    let timer: ReturnType<typeof setTimeout>;
    return ((...args: Parameters<T>) => {
        clearTimeout(timer);
        timer = setTimeout(() => fn(...args), delay);
    }) as T;
}

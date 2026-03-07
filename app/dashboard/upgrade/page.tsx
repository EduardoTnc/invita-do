"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, Loader2, Sparkles, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useSearchParams } from "next/navigation";

export default function UpgradePage() {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const searchParams = useSearchParams();

    // Podemos leer si vino redirigido de un pago exitoso o fallido
    const status = searchParams.get("upgrade");

    const handleUpgrade = async () => {
        setIsLoading(true);
        setError(null);
        try {
            // Nota: En un flujo real habría que seleccionar a qué evento aplica,
            // o si la base de datos dice que la suscripción es por usuario/host.
            // Para el demo usaremos un ID de evento falso o el primero que encuentre.
            // Idealmente el usuario iniciaría el upgrade desde la página del evento,
            // pero lo ponemos aquí a nivel global por simplicidad de la Fase 4.
            const response = await fetch("/api/payments/create-preference", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    eventId: "demo-event-id" // Requeriría un selector de evento 
                }),
            });

            if (!response.ok) {
                const errData = await response.json();
                throw new Error(errData.error || "Error al crear la preferencia de pago");
            }

            const data = await response.json();

            // Redirigir al Checkout de Mercado Pago
            if (data.init_point) {
                window.location.href = data.init_point;
            } else {
                throw new Error("No se recibió la URL de pago");
            }

        } catch (err: any) {
            console.error(err);
            setError(err.message || "Ocurrió un error inesperado al conectar con Mercado Pago.");
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-5xl mx-auto space-y-8">
            <div>
                <h1 className="text-3xl font-bold font-heading">Planes y Suscripción</h1>
                <p className="text-muted-foreground mt-2">
                    Mejora tu cuenta para desbloquear características avanzadas para tus eventos.
                </p>
            </div>

            {status === "success" && (
                <Alert className="bg-green-500/10 text-green-600 border-green-500/20">
                    <Check className="h-4 w-4" />
                    <AlertDescription>
                        ¡Pago exitoso! Tu cuenta ha sido actualizada a Premium. (Puede demorar unos segundos en reflejarse).
                    </AlertDescription>
                </Alert>
            )}

            {status === "failure" && (
                <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                        El pago ha sido rechazado o cancelado. Por favor, intenta nuevamente.
                    </AlertDescription>
                </Alert>
            )}

            {error && (
                <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}

            <div className="grid md:grid-cols-2 gap-8 items-start">
                <Card className="relative overflow-hidden">
                    <CardHeader>
                        <CardTitle>Plan Free</CardTitle>
                        <CardDescription>Para eventos pequeños o pruebas</CardDescription>
                        <div className="mt-4">
                            <span className="text-4xl font-bold">S/0</span>
                            <span className="text-muted-foreground"> /evento</span>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <ul className="space-y-3 text-sm">
                            <li className="flex items-center gap-2">
                                <Check className="h-4 w-4 text-primary" />
                                <span>Hasta 50 invitados gratis</span>
                            </li>
                            <li className="flex items-center gap-2">
                                <Check className="h-4 w-4 text-primary" />
                                <span>Micrositio público básico</span>
                            </li>
                            <li className="flex items-center gap-2">
                                <Check className="h-4 w-4 text-primary" />
                                <span>Confirmación de asistencia (RSVP)</span>
                            </li>
                            <li className="flex items-center gap-2">
                                <Check className="h-4 w-4 text-primary" />
                                <span>Creación manual de mesas</span>
                            </li>
                        </ul>
                    </CardContent>
                    <CardFooter>
                        <Button variant="outline" className="w-full" disabled>
                            Plan Actual
                        </Button>
                    </CardFooter>
                </Card>

                <Card className="relative overflow-hidden border-primary/50 shadow-lg shadow-primary/10">
                    <div className="absolute top-0 right-0 py-1 px-4 bg-primary text-primary-foreground text-xs font-bold rounded-bl-lg flex items-center gap-1">
                        <Sparkles className="h-3 w-3" />
                        Recomendado
                    </div>
                    <CardHeader>
                        <CardTitle className="text-primary">Plan Premium</CardTitle>
                        <CardDescription>Experiencia completa e inolvidable</CardDescription>
                        <div className="mt-4">
                            <span className="text-4xl font-bold">S/49.90</span>
                            <span className="text-muted-foreground"> /evento</span>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <ul className="space-y-3 text-sm">
                            <li className="flex items-center gap-2 font-medium">
                                <Check className="h-4 w-4 text-primary" />
                                <span>Invitados ilimitados</span>
                            </li>
                            <li className="flex items-center gap-2 font-medium">
                                <Check className="h-4 w-4 text-primary" />
                                <span>Galería de fotos en vivo (Moderable)</span>
                            </li>
                            <li className="flex items-center gap-2 font-medium">
                                <Check className="h-4 w-4 text-primary" />
                                <span>Auto-organizador de Mesas con Inteligencia Artificial</span>
                            </li>
                            <li className="flex items-center gap-2">
                                <Check className="h-4 w-4 text-primary" />
                                <span>Asistente Virtual (Chatbot RAG) para invitados</span>
                            </li>
                            <li className="flex items-center gap-2">
                                <Check className="h-4 w-4 text-primary" />
                                <span>Diseños de interfaz exclusivos</span>
                            </li>
                        </ul>
                    </CardContent>
                    <CardFooter>
                        <Button
                            className="w-full gap-2"
                            onClick={handleUpgrade}
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                                "Actualizar a Premium"
                            )}
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        </div>
    );
}

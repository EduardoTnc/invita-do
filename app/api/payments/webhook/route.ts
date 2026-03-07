import { NextResponse } from "next/server";
import { payment } from "@/lib/mercadopago";
import { createClient } from "@supabase/supabase-js";

export async function POST(req: Request) {
    try {
        // En un webhook no tenemos contexto de cookies, 
        // así que debemos usar el client service_role para hacer la actualización.
        const supabaseAdmin = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY!
        );

        // MercadoPago manda la notifiación de varias formas (JSON Webhook o IPN querystring)
        const url = new URL(req.url);
        const searchParams = url.searchParams;

        let paymentId: string | null = null;
        let type: string | null = null;

        // Intentamos leer el body como JSON
        const bodyText = await req.text();
        if (bodyText) {
            try {
                const bodyJson = JSON.parse(bodyText);
                type = bodyJson.type || bodyJson.topic;
                paymentId = bodyJson.data?.id || bodyJson.id;
            } catch (e) {
                console.log("Not JSON body in webhook");
            }
        }

        // Si no está en el body, quizás está en la querystring (IPN)
        if (!paymentId) {
            paymentId = searchParams.get("data.id") || searchParams.get("id");
            type = searchParams.get("type") || searchParams.get("topic");
        }

        if (type !== "payment" || !paymentId) {
            // No es un evento de pago o falta el ID. Ignorar devolviendo 200 OK.
            return NextResponse.json({ success: true, message: "Ignored" });
        }

        // Recuperar detalles completos del pago con el SDK
        const paymentData = await payment.get({ id: paymentId });

        // Verificamos si el pago fue aprobado
        if (paymentData.status === "approved" || paymentData.status === "authorized") {
            const userId = paymentData.external_reference;

            if (userId) {
                // Actualizamos la base de datos (Supabase Admin)
                // Usamos el 'external_reference' que pasamos al crear la preferencia
                const { error } = await supabaseAdmin
                    .from("profiles")
                    .update({ subscription_tier: "PREMIUM" })
                    .eq("id", userId);

                if (error) {
                    console.error("Error al actualizar la suscripción en BD:", error);
                    return NextResponse.json({ error: "Failed DB update" }, { status: 500 });
                }

                console.log(`✅ Suscripción activada para usuario: ${userId}`);
            } else {
                console.warn("Pago aprobado sin external_reference");
            }
        }

        return NextResponse.json({ success: true });

    } catch (error: any) {
        console.error("Webhook processing error:", error);
        // MP recomienda devolver HTTP 200/201 aunque haya error interno de lógica 
        // para que no sigan reenviando si es culpa nuestra, pero por seguridad 500 si falla la red.
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

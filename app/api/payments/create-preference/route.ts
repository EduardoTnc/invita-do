import { NextResponse } from "next/server";
import { preference } from "@/lib/mercadopago";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: Request) {
    try {
        const supabase = await createClient();

        // 1. Verify User is Authenticated
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // 2. Parse Request Body
        const body = await req.json();
        const { eventId } = body;

        if (!eventId) {
            return NextResponse.json({ error: "Missing eventId" }, { status: 400 });
        }

        // Verify that the event belongs to this user
        const { data: event, error: eventError } = await supabase
            .from("events")
            .select("title")
            .eq("id", eventId)
            .eq("host_id", user.id)
            .single();

        if (eventError || !event) {
            return NextResponse.json({ error: "Event not found or not owned by user" }, { status: 404 });
        }

        // 3. Create Mercado Pago Preference
        // The external_reference will help us identify the payment in the webhook
        // using a combination of user.id and eventId. For now let's just use the user.id since
        // the upgrade is technically applied to the *profile* in our logic (subscription_tier).
        const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

        const response = await preference.create({
            body: {
                items: [
                    {
                        id: "invita-do-premium",
                        title: `Invita-do Premium Upgrade - ${event.title}`,
                        description: "Suscripción Premium: Galería en vivo, SMS ilimitados, IA Auto-Organizador",
                        quantity: 1,
                        unit_price: 49.90, // Precio de ejemplo
                        currency_id: "PEN", // Soles peruanos
                    },
                ],
                payer: {
                    email: user.email,
                },
                back_urls: {
                    success: `${baseUrl}/dashboard?upgrade=success`,
                    failure: `${baseUrl}/dashboard?upgrade=failure`,
                    pending: `${baseUrl}/dashboard?upgrade=pending`,
                },
                auto_return: "approved",
                // La URL remota real se debe configurar en producción. 
                // En local, Mercado Pago no puede llegar a localhost, necesitarías ngrok.
                notification_url: `${baseUrl}/api/payments/webhook`,
                external_reference: user.id, // Guardamos el ID del usuario para hacerle el upgrade
                statement_descriptor: "INVITA-DO",
            },
        });

        // Retornamos el init_point (o sandbox_init_point)
        return NextResponse.json({
            id: response.id,
            init_point: response.init_point,
            sandbox_init_point: response.sandbox_init_point,
        });

    } catch (error: any) {
        console.error("MP Preference creation failed:", error);
        return NextResponse.json(
            { error: "Internal Server Error", details: error.message },
            { status: 500 }
        );
    }
}

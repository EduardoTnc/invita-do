import { MercadoPagoConfig, Preference, Payment } from "mercadopago";

// Inicializa el SDK usando el Access Token (preferiblemente de entorno)
// Nota: Puedes agregar esto a tu .env.local: MERCADOPAGO_ACCESS_TOKEN
const client = new MercadoPagoConfig({
    accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN || "APP_USR-TEST-TOKEN",
    options: { timeout: 5000 },
});

export const preference = new Preference(client);
export const payment = new Payment(client);
export const mpClient = client;

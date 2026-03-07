import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import { Providers } from "./providers";
import "./globals.css";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

const outfit = Outfit({
  variable: "--font-heading",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "invita·do — Crea invitaciones digitales inolvidables",
    template: "%s | invita·do",
  },
  description:
    "Plataforma SaaS para crear micrositios de eventos con IA. Invitaciones digitales premium, RSVP inteligente, galería en vivo y más.",
  keywords: [
    "invitaciones digitales",
    "bodas",
    "eventos",
    "RSVP",
    "micrositios",
    "invita-do",
  ],
  authors: [{ name: "invita·do" }],
  openGraph: {
    title: "invita·do — Crea invitaciones digitales inolvidables",
    description:
      "Plataforma para crear micrositios de eventos con IA, RSVP inteligente y galería en vivo.",
    type: "website",
    locale: "es_PE",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${outfit.variable} antialiased`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

# 🚀 PRD MAESTRO: invita-do (SaaS de Gestión de Eventos)
**Versión:** 2.1 (Ampliada a Múltiples Nichos y Pagos Globales)
**Contexto del Sistema:** Plataforma SaaS B2B2C (White-label) impulsada por IA, centrada en la gestión ultraprecisa de invitados, analítica y experiencias inmersivas para cualquier tipo de evento (Bodas, Eventos Privados, Eventos Corporativos, Informales, etc.).

## 1. Visión y Directrices Core para Antigravity
**Instrucción principal para el Agente IA:** 
Actuarás como Arquitecto de Software Principal y Full-Stack Senior. El objetivo ha evolucionado: el sistema debe ser general pero altamente enfocado. Debe solucionar la gestión de invitados (conocer el número exacto), ofrecer funcionalidades de altísimo valor (como la Galería inmersiva post-evento) y escalar a nivel global.

Además, el sistema incluirá múltiples **Landing Pages de Nicho** para maximizar el SEO y facilitar la captación de usuarios (ej. una landing para Eventos Informales, otra para Bodas, etc.).

### 1.1. Stack Tecnológico Mandatorio (Arquitectura Moderna)
*   **Framework Core:** Next.js 16 (App Router) - Para RSC, PPR, y SEO ultra-dinámico en landings de nicho y micrositios.
*   **Lenguaje:** TypeScript Estricto.
*   **Base de Datos:** PostgreSQL (Neon o Supabase) + ORM (Prisma o Drizzle). Vectorización para la IA.
*   **Estilos y UI:** Tailwind CSS + Framer Motion. Shadcn/UI para el dashboard.
*   **Gestión de Estado:** Zustand + TanStack Query v5.
*   **Motor IA:** Vercel AI SDK integrado con Gemini (Google) / OpenAI.
*   **Pagos Globales:** **Stripe** (Suscripciones, Webhooks, Billing Portal) para garantizar alcance internacional y cobros recurrentes sin fricción en cualquier moneda.
*   **Almacenamiento:** Supabase Storage o Cloudflare R2.

## 2. Modelo de Datos Relacional y Vectorial (Schema)
*   **`User` (Organizador/Anfitrión):** `id`, `email`, `stripe_customer_id`, `subscription_tier` (FREE/PREMIUM/ENTERPRISE).
*   **`Event`:** `id`, `user_id`, `slug` (UNIQUE, INDEXED), `niche_type` (WEDDING, CLANDESTINE, CORPORATE, CASUAL), `title`, `date`, `location`, `theme_config` (JSONB), `is_published`.
*   **`GuestGroup` (Agrupación/Mesas/Equipos):** `id`, `event_id`, `name`, `max_guests`.
*   **`Guest`:** `id`, `group_id`, `name`, `status` (PENDING, VIEWED, CONFIRMED, DECLINED), `qr_code_id` (Para entrada rápida en eventos clandestinos/informales).
*   **`AI_Knowledge_Base` (Vector DB):** `id`, `event_id`, `content`, `embedding`.
*   **`GalleryPhoto`:** `id`, `event_id`, `guest_id`, `url`, `status`. Retención a largo plazo para recuerdo post-evento.

## 3. Flujos de Usuario y Lógica de Negocio Detallada

### FLUJO A: El Organzador (Dashboard y Landings SEO)

**1. Captación y Landings de Nicho (SEO Driven)**
*   **Lógica:** Rutas separadas en la web principal (ej. `/eventos-informales`, `/bodas`, `/cumpleanos`). Cada una con copy específico, demostrando cómo invita-do resuelve el dolor exacto de ese nicho (Ej: "Básico para saber cuántos irán a tu evento privado y controlar acceso con QR").

**2. Creación del Evento y Configuración de Tipo**
*   **Proceso:** El organizador entra y elige el nicho de su evento. La IA adapta la plantilla, los textos sugeridos y el comportamiento del micrositio (ej. para eventos informales no se muestran mapas exactos hasta confirmar).

**3. Control Estricto de Invitados (El dolor principal)**
*   **Lógica:** Estadísticas en tiempo real en el Dashboard. Panel de "Exactitud": ¿Cuántos confirmaron? ¿Cuántos pueden traer +1? El sistema permite limitar cupos máximos de forma global o por enlace.

**4. Monetización Global (Stripe)**
*   **Lógica Middleware:** Paywalls gestionados vía API de Stripe. Límites de invitados o características como la "Galería Post-Evento" pueden requerir upgrade.

### FLUJO B: El Invitado (Micrositio y Experiencia Post-Evento)

**1. Acceso y Renderizado Inicial**
*   **Privacidad Adaptable:** Dependiendo del nicho, el evento puede ser público, protegido con PIN de 4 dígitos (Ideal para eventos informales), o vinculado a un token único.

**2. Motor de RSVP de Alta Fricción/Baja Fricción**
*   **Lógica:** Adaptable. Para bodas: exhaustivo (alergias). Para fiestas informales: "1 Click Confirm" y generación inmediata de código QR para control de acceso en puerta.

**3. La Galería Post-Evento (Fidelización)**
*   **Proceso:** Una de las características de mayor valor. Durante y DESPUÉS del evento, los invitados suben fotos. 
*   **UI Dinámica:** El micrositio transiciona a modo "Recuerdo" después de la fecha del evento, mostrando la galería interactiva, incentivando a los invitados a crear sus propios eventos con el SaaS.

## 4. Requisitos No Funcionales

1.  **Stripe Integration:** Uso de Stripe Checkout para suscripciones y Stripe Webhooks para sincronización de estados `subscription_tier` en la DB.
2.  **Generación Dinámica de Rutas SEO:** Uso de Next.js `generateStaticParams` para las landings de nicho.
3.  **Manejo de Errores y Seguridad:** Zod para validación. Rate limiting hiper estricto en links públicos para evitar scraping en eventos privados.
4.  **Optimización Edge:** ISR y PPR asegurando carga instantánea (milisegundos) vital para conversión en los landing pages.

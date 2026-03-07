
# 🚀 PRD MAESTRO: invita-do (SaaS de Gestión de Eventos)
**Versión:** 2.0 (Optimizada para Desarrollo Autónomo por IA - Antigravity)
**Contexto del Sistema:** Plataforma SaaS B2B2C (White-label) para creación de micrositios de eventos asistidos por IA, gestión logística y UX inmersiva.

## 1. Visión y Directrices Core para Antigravity
**Instrucción principal para el Agente IA:** 
Actuarás como Arquitecto de Software Principal y Full-Stack Senior. Tu objetivo es construir un SaaS altamente escalable, multi-tenant, con tiempos de respuesta en milisegundos y una experiencia de usuario que rivalice con aplicaciones nativas (animaciones a 60fps, transiciones sin recargas).

### 1.1. Stack Tecnológico Mandatorio (Arquitectura Moderna)
Para garantizar la escalabilidad y el rendimiento exigido, debes implementar el siguiente stack:
*   **Framework Core:** Next.js 16 (App Router) - Para aprovechar Server Components (RSC), Partial Pre-Rendering (PPR) estable con la directiva `cacheComponents`, y SEO ultra-dinámico en los micrositios.
*   **Lenguaje:** TypeScript Estricto (tipado en todas las interfaces, sin `any`).
*   **Base de Datos:** PostgreSQL (Neon o Supabase) + ORM (Prisma o Drizzle). Debe soportar vectorización (pgvector) para la IA.
*   **Estilos y UI:** Tailwind CSS + Framer Motion (para micro-interacciones fluidas y layout animations). Shadcn/UI para el dashboard.
*   **Gestión de Estado:** Zustand (estado global) + TanStack Query v5 (para data fetching hiper optimizado, caché y mutaciones optimistas).
*   **Motor IA:** Vercel AI SDK integrado con Gemini (Google) u OpenAI para RAG, Streaming de UI y generación de datos (JSON estricto).
*   **Pagos:** Mercado Pago (Suscripciones y Webhooks) u opciones locales como Culqi/Kushki para soportar pagos nativos de LATAM (Yape/Plin en Perú).
*   **Almacenamiento (Storage):** Supabase Storage (aprovechando la integración RLS con PostgreSQL) o Cloudflare R2 para ahorro optimizado de costos.

## 2. Modelo de Datos Relacional y Vectorial (Schema)
La IA debe estructurar la base de datos con las siguientes entidades principales y relaciones:

*   **`User` (Anfitrión):** `id`, `email`, `payment_customer_id` (Mercado Pago/Culqi), `subscription_tier` (FREE/PREMIUM/ENTERPRISE).
*   **`Event`:** `id`, `user_id`, `slug` (UNIQUE, INDEXED), `title`, `date`, `location_geo`, `theme_config` (JSONB), `is_published`.
*   **`GuestGroup` (Agrupación familiar/parejas):** `id`, `event_id`, `name` (Ej: "Familia Pérez"). *Lógica: Un grupo comparte la misma invitación.*
*   **`Guest`:** `id`, `group_id`, `name`, `email`, `phone`, `status` (PENDING, VIEWED, CONFIRMED, DECLINED), `dietary_restrictions`, `is_child`.
*   **`AI_Knowledge_Base` (Vector DB):** `id`, `event_id`, `content`, `embedding` (Vector). *Lógica: Almacena los detalles del evento para el RAG del Chatbot.*
*   **`Table` & `Seat`:** Para la distribución de mesas. Relación 1 Tabla -> N Asientos -> 1 Guest (Opcional).
*   **`GalleryPhoto`:** `id`, `event_id`, `guest_id`, `url`, `status` (PENDING_MODERATION, APPROVED).

## 3. Flujos de Usuario y Lógica de Negocio Detallada

### FLUJO A: El Anfitrión (Dashboard Multi-Tenant)

**1. Onboarding y Creación del Evento (Generación de Slug)**
*   **Proceso:** El usuario se registra (OAuth Google o Magic Link). Inmediatamente entra al "Wizard" de creación.
*   **Lógica de Negocio (El Slug):** El sistema debe generar un slug amigable y verificar colisiones con *debouncing* y control de concurrencia en la BD. Si `invita.do/boda-juan-ana` existe, la IA sugiere `/boda-juan-ana-2026`. El slug se indexa (UNIQUE INDEX) para Búsqueda O(1).
*   **Generación IA (Vibe):** El anfitrión escribe un prompt: *"Boda en la playa, elegante pero relajada, colores pasteles"*. La IA en el backend genera un archivo JSON con la paleta de colores (HEX), tipografías y textos sugeridos, guardándolo en `theme_config`.

**2. Gestión de Invitados y RSVP Inteligente**
*   **Proceso:** El anfitrión sube un CSV o agrega manualmente.
*   **Lógica de Negocio (Grupos y +1):** Los invitados no son entidades aisladas. Se agrupan en `GuestGroup`. El anfitrión define "Máximo de acompañantes" por grupo.
*   **Estados:** El sistema detecta cuando la invitación fue enviada (vía WhatsApp API/Email), cuando fue abierta (tracker de pixel) y cuando fue respondida.

**3. Módulo de Mesas (Drag & Drop + Auto-Organización IA)**
*   **Proceso:** Lienzo 2D con mesas redondas/cuadradas.
*   **Lógica Manual:** Uso de `@dnd-kit` o similar. Validar que un usuario no pueda estar en dos mesas a la vez.
*   **Lógica IA (El Botón Mágico):** El anfitrión hace clic en "Auto-Organizar".
    *   *Proceso Backend:* Un Server Action toma el JSON de mesas disponibles y el JSON de invitados confirmados.
    *   *Prompt a la IA:* Uso de `generateObject` (Vercel AI SDK) y validación *Zod* para forzar a la IA a retornar un esquema de asignación estricto. Se maximiza la afinidad por etiquetas y se mantiene a los `GuestGroup` juntos.
    *   *Respuesta & Fallback:* La IA devuelve un JSON tipado. El frontend lo renderiza animando los invitados hacia las mesas (Framer Motion). Se implementa un mecanismo de "Deshacer" (Undo) en sesión antes de guardar en BD.

**4. Entrenamiento del Chatbot del Evento (RAG)**
*   **Proceso:** El anfitrión llena un formulario grande o sube un PDF (Itinerario, dress code, hoteles sugeridos).
*   **Lógica Backend:** El texto se divide (chunking), se vectoriza (Embeddings API) y se guarda en `AI_Knowledge_Base` ligado al `event_id`.

**5. Monetización (Middleware y Paywalls)**
*   **Lógica Middleware:** Next.js Middleware intercepta las rutas de características Premium (ej: `/dashboard/event/[id]/gallery`). Si `User.subscription_tier == FREE`, redirige a `/dashboard/upgrade`.
*   **Límite Freemium:** En la creación de invitados, si `count(Guests) >= 50` y es plan Free, se desactiva el botón de "Agregar" y salta un modal de pago (Checkout de Mercado Pago / Integración Culqi).

### FLUJO B: El Invitado (Micrositio Público Edge-Rendered)

**1. Acceso y Renderizado Inicial**
*   **Arquitectura:** Las rutas del evento (`/[slug]`) deben usar Incremental Static Regeneration (ISR) con `revalidateTag` de Next.js. El Edge Rendering se reserva para endpoints altamente dinámicos/interactivos (RSVP / Chatbot IA). Esto asegura un TTFB (Time-To-First-Byte) de milisegundos.
*   **Seguridad y Privacidad:** Si el evento está marcado como privado, la ruta inicial es un "Gated Screen" que pide un PIN de 4 dígitos (guardado en el `Event`) o validación por token criptográfico temporal en la URL (`/[slug]?token=xyz`).

**2. Experiencia PWA y Navegación "Story/Slide"**
*   **UI/UX:** El diseño imita a Instagram Stories o TikTok. Pantallas completas (100dvh). Snap-scrolling vertical.
*   **Audio Persistente:** 
    *   *Problema:* Los navegadores bloquean el autoplay de audio.
    *   *Solución:* La pantalla de bienvenida ("Abrir Invitación") requiere un "Tap". Ese evento de interacción de usuario (`onClick`) desbloquea y reproduce el objeto de Audio Global (gestionado vía Zustand) que no se corta al cambiar de componente.

**3. El Chatbot Asistente (RAG en Tiempo Real)**
*   **Proceso:** Widget flotante en la esquina inferior.
*   **Lógica de IA Segura:**
    *   El usuario pregunta: *"¿Puedo llevar a mi perro?"*.
    *   El backend busca en la base de datos vectorial los chunks relevantes de ese evento en particular (Filtrando estrictamente por `event_id` para evitar fuga de datos entre bodas).
    *   Se envía el contexto + la pregunta al LLM con un *System Prompt* estricto: *"Eres un asistente educado para esta boda. Solo responde basado en el contexto provisto. Si no sabes, dile que contacte a los novios. No inventes."*
    *   Respuesta devuelta por Streaming al frontend.

**4. Motor de RSVP (Confirmación)**
*   **Búsqueda:** El invitado entra a la pestaña RSVP. Escribe su nombre. Búsqueda *Fuzzy Search* en la BD del evento.
*   **Lógica de Acompañantes:** Si el invitado pertenece a un `GuestGroup` con cupo para 4, la UI muestra al invitado principal + 3 slots en blanco o pre-llenados.
*   **Validación Transaccional:** Al hacer "Confirmar", el backend hace una transacción en la base de datos (ACID) para cambiar el estado de todo el `GuestGroup` a CONFIRMED, capturar las restricciones alimenticias, y registrarlo en el `InteractionLog`.

**5. Módulo de Galería En Vivo**
*   **Proceso:** Durante la fiesta, los invitados acceden al micrositio y abren la cámara/galería.
*   **Lógica de Subida:** El frontend pide una "Presigned URL" al backend (S3/R2). El archivo se sube directamente del navegador al bucket (ahorrando ancho de banda del servidor). Se crea un registro en `GalleryPhoto`. Si la moderación está activa, no se muestra en el feed público hasta que el anfitrión lo apruebe en su dashboard.


## 4. Requisitos No Funcionales (Instrucciones de Código para la IA)

1.  **Manejo de Errores y Estados de Carga:** 
    *   Toda mutación asíncrona debe usar `useTransition` o React Query. 
    *   Implementar `error.tsx` y `loading.tsx` de Next.js de forma obligatoria en cada ruta.
    *   Uso de Skeletons (Shadcn/UI) mientras se carga la data de los micrositios.
2.  **Seguridad y Sanitización:**
    *   Validación de datos de entrada y salida siempre con **Zod** (schemas compartidos entre frontend y backend).
    *   Evitar inyección SQL a través del uso estricto del ORM.
    *   Rate limiting (Límites de peticiones) en los endpoints del Chatbot y RSVP usando Upstash/Redis.
3.  **Responsive Design Estricto:**
    *   La herramienta del Anfitrión (Dashboard) debe ser funcional en Desktop y Tablet (Desktop-First).
    *   El Micrositio del Evento debe estar diseñado 100% Mobile-First y escalar elegantemente a Desktop en un contenedor centrado.
4.  **Optimización de Imágenes:**
    *   Todas las fotos subidas por usuarios deben pasar por un proceso de compresión/redimensionado antes de mostrarse en la galería (usando Next/Image o servicios como Cloudinary).

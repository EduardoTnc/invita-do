import { z } from "zod";

export const createEventSchema = z.object({
    title: z
        .string()
        .min(3, "El título debe tener al menos 3 caracteres")
        .max(150, "El título es demasiado largo"),
    slug: z
        .string()
        .min(3, "El slug debe tener al menos 3 caracteres")
        .max(100, "El slug es demasiado largo")
        .regex(
            /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
            "Solo minúsculas, números y guiones. Sin espacios ni caracteres especiales."
        ),
    event_type: z.string().min(1, "Selecciona un tipo de evento"),
    date: z.string().min(1, "La fecha es requerida"),
    end_date: z.string().optional(),
    location_name: z.string().optional(),
    location_address: z.string().optional(),
    is_private: z.boolean().default(false),
    pin: z
        .string()
        .length(4, "El PIN debe tener exactamente 4 dígitos")
        .regex(/^\d{4}$/, "Solo dígitos")
        .optional()
        .or(z.literal("")),
});

export const guestGroupSchema = z.object({
    name: z
        .string()
        .min(2, "El nombre del grupo debe tener al menos 2 caracteres"),
    max_companions: z
        .number()
        .int()
        .min(0, "Mínimo 0 acompañantes")
        .max(20, "Máximo 20 acompañantes"),
    tags: z.array(z.string()).default([]),
});

export const guestSchema = z.object({
    name: z
        .string()
        .min(2, "El nombre debe tener al menos 2 caracteres")
        .max(100, "El nombre es demasiado largo"),
    email: z.string().email("Email inválido").optional().or(z.literal("")),
    phone: z.string().optional().or(z.literal("")),
    dietary_restrictions: z.string().optional().or(z.literal("")),
    is_child: z.boolean().default(false),
    is_primary: z.boolean().default(false),
});

export const rsvpSchema = z.object({
    guest_name: z
        .string()
        .min(2, "Ingresa tu nombre para buscar tu invitación"),
    companions: z.array(
        z.object({
            name: z.string().min(1, "El nombre es requerido"),
            dietary_restrictions: z.string().optional(),
            is_child: z.boolean().default(false),
        })
    ),
});

export type CreateEventFormValues = z.infer<typeof createEventSchema>;
export type GuestGroupFormValues = z.infer<typeof guestGroupSchema>;
export type GuestFormValues = z.infer<typeof guestSchema>;
export type RsvpFormValues = z.infer<typeof rsvpSchema>;

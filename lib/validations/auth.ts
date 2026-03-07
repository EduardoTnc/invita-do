import { z } from "zod";

export const loginSchema = z.object({
    email: z
        .string()
        .min(1, "El email es requerido")
        .email("Ingresa un email válido"),
});

export const profileSchema = z.object({
    full_name: z
        .string()
        .min(2, "El nombre debe tener al menos 2 caracteres")
        .max(100, "El nombre es demasiado largo"),
    avatar_url: z.string().url().optional().or(z.literal("")),
});

export type LoginFormValues = z.infer<typeof loginSchema>;
export type ProfileFormValues = z.infer<typeof profileSchema>;

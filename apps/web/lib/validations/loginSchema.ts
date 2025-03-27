import { z } from "zod";

export const loginSchema = z.object({
    username: z
        .string()
        .min(4, "Username must have at least 6 characters")
        .trim(),
    password: z
        .string()
        .min(6, "Password must have at least 6 characters")
        .trim(),
});

export type LoginInput = z.infer<typeof loginSchema>;

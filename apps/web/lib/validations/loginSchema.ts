import { z } from "zod";

export const loginSchema = z.object({
    username: z
        .string()
        .min(6, "Tên đăng nhập phải có ít nhất 6 ký tự")
        .max(50, "Tên đăng nhập không được vượt quá 50 ký tự")
        .trim(),
    password: z
        .string()
        .min(6, "Mật khẩu phải có ít nhất 6 ký tự")
        .trim(),
});

export type LoginInput = z.infer<typeof loginSchema>;

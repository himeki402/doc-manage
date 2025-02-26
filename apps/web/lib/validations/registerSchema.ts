import { z } from "zod";

// Schema validation
export const registerSchema = z.object({
    name: z.string().min(2, "Name must have at least 2 characters").trim(),
    username: z
        .string()
        .min(4, "Username must have at least 4 characters")
        .trim(),
    password: z
        .string()
        .min(6, "Password must have at least 6 characters")
        .trim(),
    // confirmPassword: z.string(),
});
// .refine((data) => data.password === data.confirmPassword, {
//     message: "Mật khẩu xác nhận không khớp",
//     path: ["confirmPassword"],
// });

// export default registerSchema;

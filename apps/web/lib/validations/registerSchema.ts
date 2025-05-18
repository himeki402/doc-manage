import { z } from "zod";

export const registerSchema = z
  .object({
    name: z
      .string()
      .min(2, "Họ và tên phải có ít nhất 2 ký tự")
      .max(50, "Họ và tên không được vượt quá 50 ký tự"),
    username: z
      .string()
      .min(3, "Tên đăng nhập phải có ít nhất 3 ký tự")
      .max(20, "Tên đăng nhập không được vượt quá 20 ký tự")
      .regex(/^[a-zA-Z0-9_]*$/, "Tên đăng nhập chỉ chứa chữ cái, số và dấu _")
      .toLowerCase(),
    password: z
      .string()
      .min(6, "Mật khẩu phải có ít nhất 6 ký tự"),
    confirmPassword: z.string().nonempty("Vui lòng nhập lại mật khẩu"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Mật khẩu nhập lại không khớp",
    path: ["confirmPassword"],
  });
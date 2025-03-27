import authService from "@/app/services/authService/authService";
import { FormState } from "@/lib/types/formState";


export async function Register(
  state: FormState,
  formData: FormData
): Promise<FormState> {
  // Gọi đến service layer để xử lý logic đăng ký
  return authService.register(formData);
}
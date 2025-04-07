import authService from "@/app/services/authService/authService";
import { FormState } from "@/lib/types/formState";

export async function Login(
    state: FormState,
    formData: FormData
): Promise<FormState> {
    return authService.login(formData);
}

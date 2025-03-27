import authApi, { ApiError } from "@/lib/apis/authApi";
import { FormState } from "@/lib/types/formState";
import { loginSchema } from "@/lib/validations/loginSchema";
import { registerSchema } from "@/lib/validations/registerSchema";

const authService = {
    register: async (formData: FormData): Promise<FormState> => {
        const validationFields = registerSchema.safeParse({
            name: formData.get("name"),
            username: formData.get("username"),
            password: formData.get("password"),
        });

        // If validation fails, return the validation errors
        if (!validationFields.success) {
            return {
                error: validationFields.error.flatten().fieldErrors,
                message: "Validation failed",
                success: false,
            };
        }

        try {
            // Call API through the API layer
            const result = await authApi.register(validationFields.data);

            return {
                success: true,
                data: result,
                message: "Registration successful",
            };
        } catch (error) {
            const apiError = error as ApiError;

            // Handle specific error cases
            if (apiError.status === 409) {
                return {
                    success: false,
                    message: "Username already exists",
                };
            }

            // Return backend validation errors if present
            if (apiError.errors) {
                return {
                    success: false,
                    error: apiError.errors,
                    message: apiError.message,
                };
            }

            // General error case
            return {
                success: false,
                message:
                    apiError.message ||
                    "An unexpected error occurred. Please try again later.",
            };
        }
    },
    login: async (formData: FormData): Promise<FormState> => {
        const validationFields = loginSchema.safeParse({
            username: formData.get("username"),
            password: formData.get("password"),
        });
        if (!validationFields.success) {
            return {
                error: validationFields.error.flatten().fieldErrors,
                message: "Validation failed",
                success: false,
            };
        }
        try {
            const result = await authApi.login(validationFields.data);
            return {
                success: true,
                data: result,
                message: "Login successful",
            };
        } catch (error) {
            const apiError = error as ApiError;
            // Return backend validation errors if present
            if (apiError.errors) {
                return {
                    success: false,
                    error: apiError.errors,
                    message: apiError.message,
                };
            }
            return {
                success: false,
                message:
                    apiError.message ||
                    "An unexpected error occurred. Please try again later.",
            };
        }
    },
};

export default authService;

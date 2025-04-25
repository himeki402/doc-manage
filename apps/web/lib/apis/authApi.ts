import apiClient from "./config";
import { RegisterInput } from "../validations/registerSchema";
import { LoginInput } from "../validations/loginSchema";

export interface RegisterResponse {
    id: string;
    name: string;
    username: string;
    createdAt: string;
}

export interface LoginResponse {
    id: string;
    name: string;
    username: string;
    role: string;
    email: string;
}

export interface ApiError {
    status: number;
    message: string;
    errors?: Record<string, string[]>;
}

const authApi = {
    register: async (data: RegisterInput): Promise<RegisterResponse> => {
        try {
            const response = await apiClient.post<RegisterResponse>(
                "/auth/register",
                data
            );
            return response.data;
        } catch (error: any) {
            if (error.response) {
                const apiError: ApiError = {
                    status: error.response.status,
                    message:
                        error.response.data.message || "Registration failed",
                    errors: error.response.data.errors,
                };
                throw apiError;
            }
            throw {
                status: 500,
                message: error.message || "Server Internal Error",
            } as ApiError;
        }
    },
    login: async (data: LoginInput): Promise<LoginResponse> => {
        try {
            const response = await apiClient.post<LoginResponse>(
                "auth/login",
                data
            );
            return response.data;
        } catch (error: any) {
            if (error.response) {
                const apiError: ApiError = {
                    status: error.response.status,
                    message:
                        error.response.data.message || "Login failed",
                    errors: error.response.data.errors,
                };
                throw apiError;
            }
            throw {
                status: 500,
                message: error.message || "Server Internal Error",
            } as ApiError;
        }
    },
    logout: async (): Promise<void> => {
        try {
            await apiClient.post("/auth/logout");
        } catch (error: any) {
            if (error.response) {
                const apiError: ApiError = {
                    status: error.response.status,
                    message:
                        error.response.data.message || "Logout failed",
                    errors: error.response.data.errors,
                };
                throw apiError;
            }
            throw {
                status: 500,
                message: error.message || "Server Internal Error",
            } as ApiError;
        }
    },
    getMe: async (): Promise<any> => {
        try {
            const response = await apiClient.get("/auth/me");
            console.log("response", response);
            return response.data;
        } catch (error: any) {
            if (error.response) {
                const apiError: ApiError = {
                    status: error.response.status,
                    message:
                        error.response.data.message || "Get user failed",
                    errors: error.response.data.errors,
                };
                throw apiError;
            }
            throw {
                status: 500,
                message: error.message || "Server Internal Error",
            } as ApiError;
        }
    }
};

export default authApi;

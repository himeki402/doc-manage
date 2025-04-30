"use client";
import React, {
    createContext,
    useContext,
    useState,
    useEffect,
    ReactNode,
} from "react";
import { LoginInput } from "@/lib/validations/loginSchema";
import { Login } from "@/lib/actions/auth/login";
import { FormState } from "@/lib/types/formState";
import authService from "@/app/services/authService/authService";

export interface User {
    id: string;
    name: string;
    email: string;
    role: string;
    avatar: string;
    documentsUploaded: number;
}

// Định nghĩa kiểu dữ liệu cho AuthContext
interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (data: LoginInput) => Promise<FormState>;
    logout: () => Promise<void>;
    error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth phải được sử dụng trong AuthProvider");
    }
    return context;
};

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    // Kiểm tra trạng thái đăng nhập khi component được mount
    useEffect(() => {
        fetchUserInfo()
            .catch(() => {
                setUser(null);
            })
            .finally(() => {
                setIsLoading(false);
                
            });
    }, []);

    const fetchUserInfo = async (): Promise<User | null> => {
        try {
            setIsLoading(true);
            const result = await authService.getMe();
            if (result) {
                setUser(result.data.data as User);
                return result.data.data as User;
            } else {
                setUser(null);
                return null;
            }
        } catch (error) {
            console.error("Lỗi khi kiểm tra trạng thái đăng nhập:", error);
            setUser(null);
            return null;
        } finally {
            setIsLoading(false);
        }
    };

    // Hàm đăng nhập
    const login = async (data: LoginInput): Promise<FormState> => {
        setIsLoading(true);
        setError(null);

        try {
            const formData = new FormData();
            formData.append("username", data.username);
            formData.append("password", data.password);

            const result = await Login(undefined, formData);

            if (result && result.success) {
                await fetchUserInfo();
            } else {
                setError(result?.message || "Đăng nhập thất bại");
            }

            return result;
        } catch (error: any) {
            const errorMessage = error.message || "Đăng nhập thất bại";
            setError(errorMessage);

            // Trả về một FormState mặc định khi có lỗi
            return {
                success: false,
                message: errorMessage,
            } as FormState;
        } finally {
            setIsLoading(false);
        }
    };

    const logout = async () => {
        setIsLoading(true);
        setError(null);

        try {
            const result = await authService.logout();

            if (result?.success) {
                setUser(null);
            } else {
                throw new Error(result?.message || "Đăng xuất thất bại");
            }
        } catch (error: any) {
            setError(error.message || "Đăng xuất thất bại");
        } finally {
            setIsLoading(false);
        }
    };

    const value = {
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
        error,
    };

    return (
        <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
    );
};

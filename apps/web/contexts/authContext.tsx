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
import { User } from "@/lib/types/user";
import { hasAuthToken } from "@/lib/utils";

interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (data: LoginInput) => Promise<FormState>;
    logout: () => Promise<void>;
    updateUser: (updatedUser: User) => void;
    error: string | null;
    clearError: () => void;
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
    initialUser?: User | null; 
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ 
    children, 
    initialUser = null 
}) => {
    const [user, setUser] = useState<User | null>(initialUser);
    const [isLoading, setIsLoading] = useState<boolean>(true); 
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (initialUser) {
            setIsLoading(false); 
        } else {
            checkAuth();
        }
    }, [initialUser]);

    const checkAuth = async () => {
        if (hasAuthToken()) {
            try {
                const fetchedUser = await fetchUserInfo();
                if (!fetchedUser) {
                    setUser(null);
                }
            } catch (e) {
                console.error("Error checking auth:", e);
                setUser(null);
            } finally {
                setIsLoading(false);
            }
        } else {
            // Không có token, coi như chưa đăng nhập
            setUser(null);
            setIsLoading(false);
        }
    };

    const fetchUserInfo = async (): Promise<User | null> => {
        try {
            const result = await authService.getMe();
            console.log("fetchUserInfo result:", result);
            
            if (result && result.data && result.data.data) {
                const userData = result.data.data as User;
                setUser(userData);
                return userData;
            } else {
                setUser(null);
                return null;
            }
        } catch (error) {
            console.error("Lỗi khi kiểm tra trạng thái đăng nhập:", error);
            setUser(null);
            return null;
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
                const fetchedUser = await fetchUserInfo();
                if (!fetchedUser) {
                    setUser(null);
                    setError("Không thể lấy thông tin người dùng");
                }
            } else {
                setError(result?.message || "Đăng nhập thất bại");
            }

            return result;
        } catch (error: any) {
            const errorMessage = error.message || "Đăng nhập thất bại";
            setError(errorMessage);

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
            console.error("Logout error:", error);
            setError(error.message || "Đăng xuất thất bại");
            // Vẫn clear user ngay cả khi logout API thất bại
            setUser(null);
        } finally {
            setIsLoading(false);
        }
    };

    // Hàm cập nhật thông tin user trong context
    const updateUser = (updatedUser: User) => {
        setUser(updatedUser);
        setError(null);
    };

    // Hàm refresh thông tin user từ server
    const refreshUser = async () => {
        if (!hasAuthToken()) {
            setUser(null);
            return;
        }

        setIsLoading(true);
        try {
            await fetchUserInfo();
        } catch (error) {
            console.error("Error refreshing user:", error);
            setError("Không thể làm mới thông tin người dùng");
        } finally {
            setIsLoading(false);
        }
    };

    // Hàm clear error
    const clearError = () => {
        setError(null);
    };

    const value = {
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
        updateUser,
        error,
        clearError,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};
import { UsersResponse, UserStatsResponse } from "../types/user";
import apiClient from "./config";

export interface UserQueryParams {
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: "ASC" | "DESC";
    search?: string;
}

const userApi = {
    getAllUsers: async (params: UserQueryParams): Promise<UsersResponse> => {
        try {
            const response = await apiClient.get<UsersResponse>(
                "/users",
                { params }
            );
            return response.data;
        } catch (error: any) {
            if (error.response) {
                throw {
                    status: error.response.status,
                    message: error.response.data.message || "Không thể lấy danh sách người dùng",
                    errors: error.response.data.errors,
                };
            }
            throw {
                status: 500,
                message: error.message || "Lỗi máy chủ nội bộ",
            };
        }
    },
    getUsersStats: async (): Promise<UserStatsResponse> => {
        try {
            const response = await apiClient.get("/users/stats");
            return response.data;
        } catch (error: any) {
            if (error.response) {
                throw {
                    status: error.response.status,
                    message: error.response.data.message || "Không thể lấy thống kê người dùng",
                    errors: error.response.data.errors,
                };
            }
            throw {
                status: 500,
                message: error.message || "Lỗi máy chủ nội bộ",
            };
        }
    }
};
export default userApi;

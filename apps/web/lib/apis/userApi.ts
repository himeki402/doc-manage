import { UsersResponse } from "../types/user";
import apiClient from "./config";

const userApi = {
    getAllUsers: async (): Promise<UsersResponse> => {
        try {
            const response = await apiClient.get<UsersResponse>(
                "/users",
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
};
export default userApi;

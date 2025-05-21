import { Group, GroupResponse } from "../types/group";
import apiClient from "./config";

const groupApi = {
    getAllGroup: async (): Promise<GroupResponse> => {
        try {
            const response = await apiClient.get("/groups");
            return response.data;
        } catch (error: any) {
            if (error.response) {
                throw {
                    status: error.response.status,
                    message:
                        error.response.data.message || "Lỗi máy chủ nội bộ",
                };
            }
            throw {
                status: 500,
                message: error.message || "Lỗi máy chủ nội bộ",
            };
        }
    },
    createGroup: async (group: Partial<Group>): Promise<Group> => {
        try {
            const response = await apiClient.post("/groups", group);
            return response.data;
        } catch (error: any) {
            if (error.response) {
                throw {
                    status: error.response.status,
                    message: error.response.data.message || "Không thể tạo tag",
                    errors: error.response.data.errors,
                };
            }
            throw {
                status: 500,
                message: error.message || "Lỗi máy chủ nội bộ",
            };
        }
    },
    updateGroup: async (tagId: string, tag: Partial<Group>): Promise<Group> => {
        try {
            const response = await apiClient.put(`/groups/${tagId}`, tag);
            return response.data;
        } catch (error: any) {
            if (error.response) {
                throw {
                    status: error.response.status,
                    message:
                        error.response.data.message || "Không thể cập nhật tag",
                    errors: error.response.data.errors,
                };
            }
            throw {
                status: 500,
                message: error.message || "Lỗi máy chủ nội bộ",
            };
        }
    },
    deleteGroup: async (groupId: string): Promise<void> => {
        try {
            await apiClient.delete(`/groups/${groupId}`);
        } catch (error: any) {
            if (error.response) {
                throw {
                    status: error.response.status,
                    message: error.response.data.message || "Không thể xóa nhóm",
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

export default groupApi;

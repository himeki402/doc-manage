import { Tag, TagsResponse } from "../types/tag";
import apiClient from "./config";

const tagApi = {
    getAllTags: async (): Promise<TagsResponse> => {
        try {
            const response = await apiClient.get("/tags");
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
    createTag: async (tag: Partial<Tag>): Promise<Tag> => {
        try {
            const response = await apiClient.post("/tags", tag);
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
    updateTag: async (tagId: string, tag: Partial<Tag>): Promise<Tag> => {
        try {
            const response = await apiClient.put(`/tags/${tagId}`, tag);
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
    deleteTag: async (tagId: string): Promise<void> => {
        try {
            await apiClient.delete(`/tags/${tagId}`);
        } catch (error: any) {
            if (error.response) {
                throw {
                    status: error.response.status,
                    message: error.response.data.message || "Không thể xóa tag",
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

export default tagApi;

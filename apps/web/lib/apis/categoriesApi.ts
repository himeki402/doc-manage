/* eslint-disable @typescript-eslint/no-explicit-any */
import { CategoryResponse } from "../types/document";
import apiClient from "./config";

import { Category } from "@/lib/types/document";

const categoriesApi = {
    getCategories: async (): Promise<CategoryResponse> => {
        try {
            const response = await apiClient.get("/categories");
            return response.data;
        } catch (error: any) {
            if (error.response) {
                throw {
                    status: error.response.status,
                    message:
                        error.response.data.message ||
                        "Không thể lấy danh sách danh mục",
                    errors: error.response.data.errors,
                };
            }
            throw {
                status: 500,
                message: error.message || "Lỗi máy chủ nội bộ",
            };
        }
    },
    deleteCategory: async (categoryId: string): Promise<void> => {
        try {
            await apiClient.delete(
                `/categories/${categoryId}`
            );
        } catch (error: any) {
            if (error.response) {
                throw {
                    status: error.response.status,
                    message:
                        error.response.data.message || "Không thể xóa danh mục",
                    errors: error.response.data.errors,
                };
            }
            throw {
                status: 500,
                message: error.message || "Lỗi máy chủ nội bộ",
            };
        }
    },
    createCategory: async (category: Category): Promise<Category> => {
        try {
            const response = await apiClient.post(
                "/categories/create",
                category
            );
            return response.data;
        } catch (error: any) {
            if (error.response) {
                throw {
                    status: error.response.status,
                    message:
                        error.response.data.message || "Không thể tạo danh mục",
                    errors: error.response.data.errors,
                };
            }
            throw {
                status: 500,
                message: error.message || "Lỗi máy chủ nội bộ",
            };
        }
    },
    updateCategory: async (categoryId: string, category: Category): Promise<Category> => {
        try {
            const response = await apiClient.put(
                `/categories/${categoryId}`,
                category
            );
            return response.data;
        } catch (error: any) {
            if (error.response) {
                throw {
                    status: error.response.status,
                    message:
                        error.response.data.message ||
                        "Không thể cập nhật danh mục",
                    errors: error.response.data.errors,
                };
            }
            throw {
                status: 500,
                message: error.message || "Lỗi máy chủ nội bộ",
            };
        }
    },
    getCategoryById: async (categoryId: string): Promise<Category> => {
        try {
            const response = await apiClient.get(`/categories/${categoryId}`);
            return response.data;
        } catch (error: any) {
            if (error.response) {
                throw {
                    status: error.response.status,
                    message:
                        error.response.data.message || "Không thể lấy danh mục",
                    errors: error.response.data.errors,
                };
            }
            throw {
                status: 500,
                message: error.message || "Lỗi máy chủ nội bộ",
            };
        }
    },
    getCategoryByParentId: async (parentId: string): Promise<Category> => {
        try {
            const response = await apiClient.get(
                `/categories/parent/${parentId}`
            );
            return response.data;
        } catch (error: any) {
            if (error.response) {
                throw {
                    status: error.response.status,
                    message:
                        error.response.data.message || "Không thể lấy danh mục",
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

export default categoriesApi;

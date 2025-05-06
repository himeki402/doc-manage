/* eslint-disable @typescript-eslint/no-explicit-any */
import { Category, CategoryResponse } from "../types/category";
import apiClient from "./config";

export interface ApiCategory {
    id: string;
    name: string;
    description: string | null;
    parent_id: string | null;
    slug: string;
    documentCount: string;
    created_at: string;
    updated_at: string;
    parent?: ApiCategory;
}

export const mapApiCategoryToCategory = (
    apiCategory: ApiCategory
): Category => {
    return {
        id: apiCategory.id,
        name: apiCategory.name,
        slug: apiCategory.slug,
        description: apiCategory.description || undefined,
        documentCount: Number.parseInt(apiCategory.documentCount, 10),
        parent_id: apiCategory.parent_id || undefined,
    };
};

export interface ApiCategoriesResponse {
    data: ApiCategory[];
}

// Hàm chuyển đổi danh sách phẳng thành cấu trúc cây
export const buildCategoryTree = (categories: ApiCategory[]): Category[] => {
    // Tạo map để truy cập nhanh các category theo id
    const categoryMap = new Map<string, Category>();
    const allCategories = categories.map((apiCategory) => {
        const category = mapApiCategoryToCategory(apiCategory);
        categoryMap.set(category.id, category);
        return category;
    });

    const rootCategories: Category[] = [];

    allCategories.forEach((category) => {
        if (category.parent_id) {
            // Đây là category con
            const parent = categoryMap.get(category.parent_id);
            if (parent) {
                if (!parent.children) {
                    parent.children = [];
                }
                parent.children.push(category);
            }
        } else {
            // Đây là category gốc
            rootCategories.push(category);
        }
    });

    return rootCategories;
};

const categoriesApi = {
    getCategories: async (): Promise<Category[]> => {
        try {
            const response = await apiClient.get("/categories");
            return buildCategoryTree(response.data.data);
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
    getCategoriesforAdmin: async (): Promise<CategoryResponse> => {
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
            await apiClient.delete(`/categories/${categoryId}`);
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
    updateCategory: async (
        categoryId: string,
        category: Category
    ): Promise<Category> => {
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
    getCategoryBySlug: async (slug: string): Promise<Category> => {
        try {
            const response = await apiClient.get(`/categories/slug/${slug}`);
            return response.data.data;
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

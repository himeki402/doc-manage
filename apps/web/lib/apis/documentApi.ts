import {
    AccessType,
    Document,
    DocumentStatsResponseDto,
    GetDocumentsResponse,
    UpdateDocumentPayload,
} from "../types/document";
import apiClient from "./config";

export interface DocumentQueryParams {
    page?: number;
    limit?: number;
    search?: string;
    sortBy?: string;
    sortOrder?: "ASC" | "DESC";
    categoryId?: string;
    slug?: string;
    accessType?: AccessType | "all";
    tag?: string | "all";
    group?: string | "all";
}

export interface SearchDocumentParams {
    page?: number;
    limit?: number;
    search?: string;
    sortBy?: string;
    mimeType?: string;
    sortOrder?: "ASC" | "DESC";
    categoryId?: string;
    tag?: string | "all";
}

interface SearchSuggestionResponse {
    suggestions: string[];
    documents: Array<{
        id: string;
        title: string;
        description: string;
        categoryName?: string;
        createdByName?: string;
        thumbnailUrl?: string;
        accessType: string;
        relevanceScore?: number;
    }>;
}

const documentApi = {
    getPublicDocuments: async (
        params: DocumentQueryParams = {}
    ): Promise<GetDocumentsResponse> => {
        try {
            const response = await apiClient.get("/documents/public", {
                params,
            });
            return response.data;
        } catch (error: any) {
            if (error.response) {
                throw {
                    status: error.response.status,
                    message:
                        error.response.data.message ||
                        "Không thể lấy danh sách tài liệu",
                    errors: error.response.data.errors,
                };
            }
            throw {
                status: 500,
                message: error.message || "Lỗi máy chủ nội bộ",
            };
        }
    },
    getAllDocuments: async (
        params: DocumentQueryParams = {}
    ): Promise<GetDocumentsResponse> => {
        try {
            const filteredParams: Record<string, any> = {
                page: params.page,
                limit: params.limit,
            };

            if (params.accessType && params.accessType !== "all") {
                filteredParams.accessType = params.accessType;
            }
            if (params.categoryId && params.categoryId !== "all") {
                filteredParams.categoryId = params.categoryId;
            }
            if (params.tag && params.tag !== "all") {
                filteredParams.tag = params.tag;
            }
            if (params.group && params.group !== "all") {
                filteredParams.group = params.group;
            }

            const response = await apiClient.get("/documents/admin", {
                params: filteredParams,
            });
            return response.data;
        } catch (error: any) {
            if (error.response) {
                throw {
                    status: error.response.status,
                    message:
                        error.response.data.message ||
                        "Không thể lấy danh sách tài liệu",
                    errors: error.response.data.errors,
                };
            }
            throw {
                status: 500,
                message: error.message || "Lỗi máy chủ nội bộ",
            };
        }
    },
    getDocumentByCategory: async (
        params: DocumentQueryParams = {}
    ): Promise<GetDocumentsResponse> => {
        try {
            const response = await apiClient.get("/documents/by-category", {
                params,
            });
            return response.data.data;
        } catch (error: any) {
            if (error.response) {
                throw {
                    status: error.response.status,
                    message:
                        error.response.data.message ||
                        "Không thể lấy danh sách tài liệu",
                    errors: error.response.data.errors,
                };
            }
            throw {
                status: 500,
                message: error.message || "Lỗi máy chủ nội bộ",
            };
        }
    },
    getMyDocuments: async (
        params: DocumentQueryParams = {}
    ): Promise<GetDocumentsResponse> => {
        try {
            const response = await apiClient.get("/documents/my-documents", {
                params,
            });
            return response.data;
        } catch (error: any) {
            if (error.response) {
                throw {
                    status: error.response.status,
                    message:
                        error.response.data.message ||
                        "Không thể lấy danh sách tài liệu",
                    errors: error.response.data.errors,
                };
            }
            throw {
                status: 500,
                message: error.message || "Lỗi máy chủ nội bộ",
            };
        }
    },
    createDocument: async (data: FormData): Promise<void> => {
        try {
            const response = await apiClient.post("/documents/upload", data, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
                timeout: 120000,
                onUploadProgress: (progressEvent) => {
                    const percentCompleted = Math.round(
                        (progressEvent.loaded * 100) /
                            (progressEvent.total || 1)
                    );
                    console.log(`Upload Progress: ${percentCompleted}%`);
                },
            });
            return response.data;
        } catch (error: any) {
            if (error.response) {
                throw {
                    status: error.response.status,
                    message:
                        error.response.data.message || "Không thể tạo tài liệu",
                    errors: error.response.data.errors,
                };
            }
            throw {
                status: 500,
                message: error.message || "Lỗi máy chủ nội bộ",
            };
        }
    },
    deleteDocument: async (id: string): Promise<void> => {
        try {
            await apiClient.delete(`/documents/${id}`);
        } catch (error: any) {
            if (error.response) {
                throw {
                    status: error.response.status,
                    message:
                        error.response.data.message || "Không thể xóa tài liệu",
                    errors: error.response.data.errors,
                };
            }
            throw {
                status: 500,
                message: error.message || "Lỗi máy chủ nội bộ",
            };
        }
    },
    updateDocument: async (
        id: string,
        payload: UpdateDocumentPayload
    ): Promise<Document> => {
        try {
            const response = await apiClient.put(`/documents/${id}`, payload);
            return response.data;
        } catch (error: any) {
            if (error.response) {
                throw {
                    status: error.response.status,
                    message:
                        error.response.data.message ||
                        "Không thể cập nhật tài liệu",
                    errors: error.response.data.errors,
                };
            }
            throw {
                status: 500,
                message: error.message || "Lỗi máy chủ nội bộ",
            };
        }
    },
    getDocumentById: async (id: string): Promise<Document> => {
        try {
            const response = await apiClient.get(`/documents/${id}`);
            return response.data.data;
        } catch (error: any) {
            if (error.response) {
                throw {
                    status: error.response.status,
                    message:
                        error.response.data.message || "Không thể lấy tài liệu",
                    errors: error.response.data.errors,
                };
            }
            throw {
                status: 500,
                message: error.message || "Lỗi máy chủ nội bộ",
            };
        }
    },
    FTSDocument: async (
        params: DocumentQueryParams = {}
    ): Promise<GetDocumentsResponse> => {
        try {
            const response = await apiClient.get("/documents/search", {
                params,
            });
            return response.data.data;
        } catch (error: any) {
            if (error.response) {
                throw {
                    status: error.response.status,
                    message:
                        error.response.data.message ||
                        "Không thể lấy danh sách tài liệu",
                    errors: error.response.data.errors,
                };
            }
            throw {
                status: 500,
                message: error.message || "Lỗi máy chủ nội bộ",
            };
        }
    },
    getPendingDocuments: async (
        params: DocumentQueryParams = {}
    ): Promise<GetDocumentsResponse> => {
        try {
            const response = await apiClient.get("/documents/admin/pending", {
                params,
            });
            return response.data;
        } catch (error: any) {
            if (error.response) {
                throw {
                    status: error.response.status,
                    message:
                        error.response.data.message ||
                        "Không thể lấy danh sách tài liệu",
                    errors: error.response.data.errors,
                };
            }
            throw {
                status: 500,
                message: error.message || "Lỗi máy chủ nội bộ",
            };
        }
    },
    requestApproveDocument: async (id: string): Promise<void> => {
        try {
            await apiClient.post(`/documents/${id}/request-approval`);
        } catch (error: any) {
            if (error.response) {
                throw {
                    status: error.response.status,
                    message:
                        error.response.data.message ||
                        "Không thể yêu cầu duyệt tài liệu",
                    errors: error.response.data.errors,
                };
            }
            throw {
                status: 500,
                message: error.message || "Lỗi máy chủ nội bộ",
            };
        }
    },
    approveDocument: async (id: string): Promise<void> => {
        try {
            await apiClient.post(`/documents/${id}/approve`);
        } catch (error: any) {
            if (error.response) {
                throw {
                    status: error.response.status,
                    message:
                        error.response.data.message ||
                        "Không thể duyệt tài liệu",
                    errors: error.response.data.errors,
                };
            }
            throw {
                status: 500,
                message: error.message || "Lỗi máy chủ nội bộ",
            };
        }
    },
    rejectDocument: async (id: string): Promise<void> => {
        try {
            await apiClient.post(`/documents/${id}/reject`);
        } catch (error: any) {
            if (error.response) {
                throw {
                    status: error.response.status,
                    message:
                        error.response.data.message ||
                        "Không thể từ chối tài liệu",
                    errors: error.response.data.errors,
                };
            }
            throw {
                status: 500,
                message: error.message || "Lỗi máy chủ nội bộ",
            };
        }
    },
    getDocumentStats: async (): Promise<DocumentStatsResponseDto> => {
        try {
            const response = await apiClient.get("/documents/admin/stats");
            return response.data;
        } catch (error: any) {
            if (error.response) {
                throw {
                    status: error.response.status,
                    message:
                        error.response.data.message ||
                        "Không thể lấy thống kê tài liệu",
                    errors: error.response.data.errors,
                };
            }
            throw {
                status: 500,
                message: error.message || "Lỗi máy chủ nội bộ",
            };
        }
    },
    likeDocument: async (id: string): Promise<void> => {
        try {
            await apiClient.post(`/documents/${id}/like`);
        } catch (error: any) {
            if (error.response) {
                throw {
                    status: error.response.status,
                    message:
                        error.response.data.message ||
                        "Không thể thích tài liệu",
                    errors: error.response.data.errors,
                };
            }
            throw {
                status: 500,
                message: error.message || "Lỗi máy chủ nội bộ",
            };
        }
    },
    dislikeDocument: async (id: string): Promise<void> => {
        try {
            await apiClient.post(`/documents/${id}/dislike`);
        } catch (error: any) {
            if (error.response) {
                throw {
                    status: error.response.status,
                    message:
                        error.response.data.message ||
                        "Không thể không thích tài liệu",
                    errors: error.response.data.errors,
                };
            }
            throw {
                status: 500,
                message: error.message || "Lỗi máy chủ nội bộ",
            };
        }
    },
    getFTSSearchSuggestions: async (
        query: string,
        limit?: number
    ): Promise<SearchSuggestionResponse> => {
        try {
            const response = await apiClient.get(
                `/documents/fts-search-suggestions?query=${encodeURIComponent(query)}${limit ? `&limit=${limit}` : ""}`
            );
            return response.data.data || { suggestions: [], documents: [] };
        } catch (error: any) {
            console.error("Error fetching advanced search suggestions:", error);
            return { suggestions: [], documents: [] };
        }
    },
};

export default documentApi;

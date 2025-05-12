import { create } from "domain";
import { AccessType, GetDocumentsResponse, UpdateDocumentPayload } from "../types/document";
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
                filteredParams.category = params.categoryId;
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
    createDocument: async (data: FormData): Promise<void> => {
        try {
            await apiClient.post("/documents/upload", data, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
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
    updateDocument: async (id: string, payload: UpdateDocumentPayload): Promise<Document> => {
    try {
      const response = await apiClient.put(`/documents/${id}`, payload);
      return response.data;
    } catch (error: any) {
      if (error.response) {
        throw {
          status: error.response.status,
          message: error.response.data.message || "Không thể cập nhật tài liệu",
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

export default documentApi;

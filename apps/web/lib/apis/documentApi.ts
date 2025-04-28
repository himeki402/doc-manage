import {  GetDocumentsResponse } from "../types/document";
import apiClient from "./config";

export interface DocumentQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
  categoryId?: string;
  slug?: string;
}

const documentApi = {
  getPublicDocuments: async (params: DocumentQueryParams = {}): Promise<GetDocumentsResponse> => {
    try {
      const response = await apiClient.get("/documents/public", { params });
      return response.data;
    } catch (error: any) {
      if (error.response) {
        throw {
          status: error.response.status,
          message: error.response.data.message || "Không thể lấy danh sách tài liệu",
          errors: error.response.data.errors,
        };
      }
      throw {
        status: 500,
        message: error.message || "Lỗi máy chủ nội bộ",
      };
    }
  }, 
  getDocumentByCategory: async (params: DocumentQueryParams = {}): Promise<GetDocumentsResponse> => {
    try {
      const response = await apiClient.get("/documents/by-categoryId", { params });
      return response.data;
    } catch (error: any) {
      if (error.response) {
        throw {
          status: error.response.status,
          message: error.response.data.message || "Không thể lấy danh sách tài liệu",
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

export default documentApi;
export interface Document {
    id: string;
    title: string;
    description?: string;
    accessType: string;
    created_at: string;
    // Thêm các trường khác nếu cần
}

export interface GetDocumentsResponse {
  data: Document[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface Category {
    id: string;
    name: string;
    slug: string;
    parent: string | null;
    created_at: string;
    updatedAt: string;
}

export interface GetCategoryResponse {
  data: Category[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
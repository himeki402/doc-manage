export interface Document {
    id: string;
    title: string;
    description?: string;
    accessType: string;
    created_at: string;
    categoryId: string;
    categoryName?: string;
    groupId?: string;
    groupName?: string;
    fileName?: string;
    fileUrl?: string;
    slug?: string;
    mimeType?: string;
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
    parent?: string | null;
    created_at?: string;
    updatedAt?: string;
    description?: string;
    documentCount?: number;
}

export interface CategoryResponse {
    data: Category[];
    meta: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
}

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


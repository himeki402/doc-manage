import { Tag } from "./tag";

// lib/types/document.ts
export type Document = {
    id: string;
    title: string;
    description?: string;
    content?: string;
    file_path?: string;
    fileSize?: number;
    fileUrl?: string;
    mimeType: string;
    slug: string;
    subject?: string;
    createdByName: string;
    categoryName: string;
    categoryId?: string;
    categorySlug?: string;
    created_at: string;
    updated_at: string;
    likeCount: number;
    dislikeCount: number;
    ratingCount: number;
    view: number;
    rating: number;
    thumbnailUrl?: string;
    accessType: AccessType;
    status?: string;
    rejection_reason?: string;
    pageCount: string;
    reviewed_by?: string;
    reviewed_at?: string;
    source?: string;
    groupId?: string;
    groupName?: string;
    tags?: Tag[];
    last_edited_by?: string;
    last_edited_at?: string;
    language?: string;
    approval_status?: string;
    version?: string;
};

export interface GetDocumentsResponse {
    data: Document[];
    meta: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
    message: string;
}
export interface SearchResultItem {
    document: Document;
    relevance: number;
    matches: {
        field: string;
        contexts: string[];
    }[];
}

export interface UpdateDocumentPayload {
    title: string;
    description?: string;
    accessType: AccessType;
    categoryId: string;
    tagIds?: string[];
    groupId?: string;
}

export type AccessType = "PRIVATE" | "PUBLIC" | "GROUP";

export type DocumentStatsResponseDto = {
    data: DocumentStats;
    message: string;
    statusCode: number;
};

export type DocumentStats = {
    totalDocuments: number;
    newDocumentsThisMonth: number;
    newDocumentsLastMonth: number;
    growthPercentage: number;
    growthCount: number;
};
export interface UploadDocumentFormData {
  file: File | null;
  title: string;
  description: string;
  accessType: AccessType;
  categoryId: string;
  selectedTags: string[];
  groupId?: string;
}

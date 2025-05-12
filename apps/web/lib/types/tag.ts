export type Tag = {
    id: string;
    name: string;
    description?: string;
    createdAt?: string;
    createdBy?: string;
};

export interface TagsResponse {
    data: Tag[];
    meta?: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
}

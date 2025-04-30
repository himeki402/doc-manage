export interface Category {
    id: string;
    name: string;
    slug: string;
    description?: string;
    documentCount: number;
    parentId?: string;
    children?: Category[];
    level?: number;
}

export interface CategoryResponse {
    data: Category[];
    meta?: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
}

export interface NavigationItem {
    title: string;
    href: string;
    items?: NavigationItem[];
    description?: string;
}

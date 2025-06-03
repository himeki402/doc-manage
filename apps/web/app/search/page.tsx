
import { SearchResults } from "@/components/search/SearchResults";
import documentApi, {
    DocumentQueryParams,
    SearchDocumentParams,
} from "@/lib/apis/documentApi";
import { GetDocumentsResponse } from "@/lib/types/document";
import { Suspense } from "react";

interface Category {
    id: string;
    name: string;
}

async function getDocumentBySearch(
    params: DocumentQueryParams
): Promise<GetDocumentsResponse> {
    try {
        const response = await documentApi.FTSDocument({
            ...params,
            page: params.page ?? 1,
            limit: params.limit ?? 12, 
        });
        return response;
    } catch (error) {
        console.error("Không thể lấy danh sách tài liệu:", error);
        throw error;
    }
}

function extractCategoriesFromDocuments(documents: GetDocumentsResponse): Category[] {
    const categoryMap = new Map<string, Category>();
    
    documents.data.forEach(doc => {
        if (doc.categoryId && doc.categoryName) {
            categoryMap.set(doc.categoryId, {
                id: doc.categoryId,
                name: doc.categoryName,
            });
        }
    });
    
    return Array.from(categoryMap.values()).sort((a, b) => a.name.localeCompare(b.name));
}

export default async function SearchPage({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
    const resolvedSearchParams = await searchParams;

    const query: SearchDocumentParams = {
        search:
            typeof resolvedSearchParams.query === "string" ||
            typeof resolvedSearchParams.q === "string"
                ? (resolvedSearchParams.query as string) || (resolvedSearchParams.q as string)
                : undefined,
        page:
            typeof resolvedSearchParams.page === "string"
                ? parseInt(resolvedSearchParams.page)
                : 1, // Default to page 1
        limit:
            typeof resolvedSearchParams.limit === "string"
                ? parseInt(resolvedSearchParams.limit)
                : 12, // Default limit
        sortBy:
            typeof resolvedSearchParams.sortBy === "string"
                ? resolvedSearchParams.sortBy
                : "relevance", // Default sort
        sortOrder:
            typeof resolvedSearchParams.sortOrder === "string" &&
            ["ASC", "DESC"].includes(resolvedSearchParams.sortOrder)
                ? (resolvedSearchParams.sortOrder as "ASC" | "DESC")
                : "DESC", // Default order
        categoryId:
            typeof resolvedSearchParams.categoryId === "string" ||
            typeof resolvedSearchParams.category === "string"
                ? (resolvedSearchParams.categoryId as string) || (resolvedSearchParams.category as string)
                : undefined,
        tag:
            typeof resolvedSearchParams.tag === "string"
                ? resolvedSearchParams.tag
                : undefined,
        mimeType:
            typeof resolvedSearchParams.mimeType === "string"
                ? resolvedSearchParams.mimeType
                : undefined,
    };

    const documents = await getDocumentBySearch(query);

    const availableCategories = extractCategoriesFromDocuments(documents);

    return (
        <Suspense fallback={
            <div className="container mx-auto px-4 py-8">
                <div className="flex items-center justify-center min-h-[400px]">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                        <p className="text-muted-foreground">Đang tải kết quả tìm kiếm...</p>
                    </div>
                </div>
            </div>
        }>
            <SearchResults 
                initialResults={{
                    documents: documents.data,
                    total: documents.meta.total,
                    categories: availableCategories,
                }}
            />
        </Suspense>
    );
}
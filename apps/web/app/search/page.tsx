
import { DocumentGrid } from "@/components/common/search/document-grid";
import SearchHeader from "@/components/common/search/search-header";
import documentApi, {
    DocumentQueryParams,
    SearchDocumentParams,
} from "@/lib/apis/documentApi";
import { GetDocumentsResponse } from "@/lib/types/document";
import { Suspense } from "react";

async function getDocumentBySearch(
    params: DocumentQueryParams
): Promise<GetDocumentsResponse> {
    try {
        const response = await documentApi.FTSDocument({
            ...params,
            page: params.page ?? 1,
            limit: params.limit ?? 10,
        });
        return response;
    } catch (error) {
        console.error("Không thể lấy danh sách tài liệu:", error);
        throw error;
    }
}

export default async function SearchPage({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
    const resolvedSearchParams = await searchParams;

    const query: SearchDocumentParams = {
        search:
            typeof resolvedSearchParams.query === "string"
                ? resolvedSearchParams.query
                : undefined,
        page:
            typeof resolvedSearchParams.page === "string"
                ? parseInt(resolvedSearchParams.page)
                : undefined,
        limit:
            typeof resolvedSearchParams.limit === "string"
                ? parseInt(resolvedSearchParams.limit)
                : undefined,
        sortBy:
            typeof resolvedSearchParams.sortBy === "string"
                ? resolvedSearchParams.sortBy
                : undefined,
        sortOrder:
            typeof resolvedSearchParams.sortOrder === "string" &&
            ["ASC", "DESC"].includes(resolvedSearchParams.sortOrder)
                ? (resolvedSearchParams.sortOrder as "ASC" | "DESC")
                : undefined,
        categoryId:
            typeof resolvedSearchParams.categoryId === "string"
                ? resolvedSearchParams.categoryId
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

    return (
        <div className="container mx-auto p-4">
            <Suspense fallback={<div>Đang tải kết quả...</div>}>
                <SearchHeader
                    query={query.search || ""}
                    resultsCount={documents.meta.total}
                    filters={{
                        categoryId: query.categoryId || "",
                        length: "",
                        fileType: query.mimeType || "",
                    }}
                />
                <DocumentGrid documents={documents.data} />
            </Suspense>
        </div>
    );
}

"use client";
// THÊM MỚI: import KeyboardEvent để type-hint cho sự kiện nhấn phím
import { useEffect, useState, KeyboardEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FileSearch, Tag } from "lucide-react";
import DocumentList from "./document-list";
import CategoriesSidebar from "./category-sidebar";
import ActivitySection from "./activity-section";
import { GetDocumentsResponse } from "@/lib/types/document";
import ImportantDocuments from "./important-document";
import documentApi, { DocumentQueryParams } from "@/lib/apis/documentApi";

export default function DocumentsTab() {
    const [documentsResponse, setDocumentsResponse] =
        useState<GetDocumentsResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [searchTerm, setSearchTerm] = useState("");

    const fetchMyDocuments = async (
        params: DocumentQueryParams = { limit: 5 }
    ) => {
        try {
            setLoading(true);
            setError(null);
            const data = await documentApi.getMyDocuments(params);
            setDocumentsResponse(data);
        } catch (err: any) {
            setError(err.message || "Failed to fetch documents");
            console.error("Error fetching documents:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMyDocuments();
    }, []);

    const handleSearch = () => {
        fetchMyDocuments({ search: searchTerm, limit: 5 });
    };

    const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            handleSearch();
        }
    };

    if (loading && !documentsResponse) {
        return <div className="text-center">Đang tải tài liệu...</div>;
    }
    if (error) {
        return <div className="text-center text-red-500">Lỗi: {error}</div>;
    }

    return (
        <>
            <div className="flex justify-between items-center">
                <div className="flex gap-2">
                    <Input
                        placeholder="Tìm kiếm tài liệu..."
                        className="w-64"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onKeyDown={handleKeyDown}
                    />
                    <Button variant="outline" size="sm" onClick={handleSearch}>
                        <FileSearch className="h-4 w-4 mr-1" /> Tìm kiếm
                    </Button>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                        <Tag className="h-4 w-4 mr-1" /> Phân loại
                    </Button>
                    <Button variant="outline" size="sm">
                        Mới nhất
                    </Button>
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <DocumentList
                    documentsResponse={documentsResponse}
                    onFetchDocuments={fetchMyDocuments}
                />
                <CategoriesSidebar />
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <ActivitySection />
                <ImportantDocuments />
            </div>
        </>
    );
}
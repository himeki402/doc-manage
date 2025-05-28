"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FileSearch, Tag } from "lucide-react";
import DocumentList from "./document-list";
import CategoriesSidebar from "./category-sidebar";
import ActivitySection from "./activity-section";
import { GetDocumentsResponse } from "@/lib/types/document";
import ImportantDocuments from "./important-document";

interface DocumentsTabProps {
    documentsResponse: GetDocumentsResponse | null;
    loading: boolean;
    error: string | null;
    onFetchDocuments?: () => void;
}

export default function DocumentsTab({
    documentsResponse,
    loading,
    error,
    onFetchDocuments,
}: DocumentsTabProps) {
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
                    />
                    <Button variant="outline" size="sm">
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

            {/* Documents and Categories */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <DocumentList
                    documentsResponse={documentsResponse}
                    onFetchDocuments={onFetchDocuments}
                />
                <CategoriesSidebar />
            </div>

            {/* Additional Sections */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <ActivitySection />
                <ImportantDocuments />
            </div>
        </>
    );
}

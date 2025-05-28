"use client";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";
import documentApi, { DocumentQueryParams } from "@/lib/apis/documentApi";
import { Document, GetDocumentsResponse } from "@/lib/types/document";
import { useState } from "react";
import { toast } from "sonner";
import DocumentItem from "./document-item";
import DocumentDetailModal from "./document-detail-modal";
import DocumentEditModal from "./edit-document-modal";
import DocumentDeleteModal from "./delete-document-modal";

interface DocumentListProps {
    documentsResponse: GetDocumentsResponse | null;
    onFetchDocuments?: (params?: DocumentQueryParams) => void;
    onEdit?: (document: Document) => void;
    onDelete?: (documentId: string) => void;
    setSelectedDocument?: (document: Document) => void;
    setIsDetailsModalOpen?: (open: boolean) => void;
}

export default function DocumentList({
    documentsResponse,
    onFetchDocuments,
}: DocumentListProps) {
    const [selectedDocument, setSelectedDocument] = useState<Document | null>(
        null
    );
    const [isLoadingPage, setIsLoadingPage] = useState(false);
    const [isDetailOpen, setIsDetailOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
    const handleNextPage = async () => {
        if (
            documentsResponse &&
            documentsResponse.meta.page < documentsResponse.meta.totalPages &&
            onFetchDocuments
        ) {
            setIsLoadingPage(true);
            try {
                await onFetchDocuments({
                    limit: documentsResponse.meta.limit,
                    page: documentsResponse.meta.page + 1,
                });
            } finally {
                setIsLoadingPage(false);
            }
        }
    };

    const handlePrevPage = async () => {
        if (
            documentsResponse &&
            documentsResponse.meta.page > 1 &&
            onFetchDocuments
        ) {
            setIsLoadingPage(true);
            try {
                await onFetchDocuments({
                    limit: documentsResponse.meta.limit,
                    page: documentsResponse.meta.page - 1,
                });
            } finally {
                setIsLoadingPage(false);
            }
        }
    };

    const renderEmptyState = () => (
        <div className="flex flex-col items-center justify-center p-8 text-center">
            <FileText className="w-16 h-16 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium text-muted-foreground">
                Không có tài liệu để hiển thị
            </h3>
            <p className="text-sm text-muted-foreground mt-2 mb-4">
                Hãy bắt đầu bằng cách thêm tài liệu mới!
            </p>
        </div>
    );

    const handleViewDetail = (document: Document) => {
        setSelectedDocument(document);
        setIsDetailOpen(true);
    };

    const handleEdit = (document: Document) => {
        setSelectedDocument(document);
        setIsEditOpen(true);
    };

    const handleDelete = (document: Document) => {
        setSelectedDocument(document);
        setIsDeleteConfirmOpen(true);
    };

    const confirmDelete = async () => {
        if (!selectedDocument || !selectedDocument.id) return;
        try {
            await documentApi.deleteDocument(selectedDocument.id);
            setIsDeleteConfirmOpen(false);
            toast.success("Xóa tài liệu thành công");
        } catch (error) {
            console.error("Error deleting document:", error);
            toast.error("Xóa tài liệu thất bại");
        } finally {
            setIsDeleteConfirmOpen(false);
        }
    };

    const saveEdit = () => {
        // Implement save edit logic here
        console.log("Saving edited document:", selectedDocument);
        setIsEditOpen(false);
        // After saving, you would typically refresh the document list
    };

    return (
        <>
            <Card className="lg:col-span-5">
                <CardHeader>
                    <CardTitle>Tài liệu của tôi</CardTitle>
                    <CardDescription>
                        Quản lý và truy cập tất cả tài liệu học tập của bạn
                    </CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                    {isLoadingPage ? (
                        <div className="text-center p-4">
                            Đang tải tài liệu...
                        </div>
                    ) : !documentsResponse ||
                      documentsResponse.data.length === 0 ? (
                        renderEmptyState()
                    ) : (
                        <div className="space-y-0 divide-y">
                            {documentsResponse.data.map((doc) => (
                                <DocumentItem
                                    key={doc.id}
                                    document={doc}
                                    onViewDetail={handleViewDetail}
                                    onEdit={handleEdit}
                                    onDelete={handleDelete}
                                />
                            ))}
                        </div>
                    )}
                </CardContent>
                <CardFooter className="border-t p-4 flex justify-between">
                    <div className="text-sm text-muted-foreground">
                        {documentsResponse &&
                        documentsResponse.data.length > 0 ? (
                            <>
                                Hiển thị {documentsResponse.data.length} trong
                                số {documentsResponse.meta.total} tài liệu
                                (Trang {documentsResponse.meta.page}/
                                {documentsResponse.meta.totalPages})
                            </>
                        ) : (
                            ""
                        )}
                    </div>
                    {documentsResponse && documentsResponse.data.length > 0 && (
                        <div className="flex gap-1">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={handlePrevPage}
                                disabled={
                                    isLoadingPage ||
                                    !documentsResponse ||
                                    documentsResponse.meta.page === 1
                                }
                            >
                                Trước
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={handleNextPage}
                                disabled={
                                    isLoadingPage ||
                                    !documentsResponse ||
                                    documentsResponse.meta.page ===
                                        documentsResponse.meta.totalPages
                                }
                            >
                                Tiếp
                            </Button>
                        </div>
                    )}
                </CardFooter>
            </Card>
            <DocumentDetailModal
                document={selectedDocument}
                isOpen={isDetailOpen}
                onClose={() => setIsDetailOpen(false)}
                onEdit={handleEdit}
                onDelete={handleDelete}
            />
            <DocumentEditModal
                document={selectedDocument}
                isOpen={isEditOpen}
                onClose={() => setIsEditOpen(false)}
                onSave={saveEdit}
            />
            <DocumentDeleteModal
                document={selectedDocument}
                isOpen={isDeleteConfirmOpen}
                onClose={() => setIsDeleteConfirmOpen(false)}
                onConfirm={confirmDelete}
            />
        </>
    );
}

"use client";

import { DocumentsTable } from "@/components/common/admin/documentAdmin/DocumentTable";
import { UploadDocumentDialog } from "@/components/common/admin/documentAdmin/DocumentUploadDialog";
import { useAdminContext } from "@/contexts/adminContext";
import { DocumentsHeader } from "@/components/common/admin/documentAdmin/document-header";
import { DocumentsFilters } from "@/components/common/admin/documentAdmin/document-filters";
import { DocumentDetailsDialog } from "@/components/common/admin/documentAdmin/document-details";
import { EditDocumentDialog } from "@/components/common/admin/documentAdmin/edit-document-dialog";
import { useState } from "react";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import documentApi from "@/lib/apis/documentApi";
import { Document } from "@/lib/types/document";

export default function DocumentsAdminPage() {
    const {
        documents,
        setDocuments,
        setFilteredDocuments,
        setTotalDocuments,
        selectedDocument,
        setSelectedDocument,
        isDocumentModalOpen,
        setIsDocumentModalOpen,
        isDetailsModalOpen,
        setIsDetailsModalOpen,

        filters,
        pagination,
    } = useAdminContext();

    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [documentToDelete, setDocumentToDelete] = useState<{
        id: string;
        title: string;
    } | null>(null);

    const handleEditDocument = (document: Document) => {
        setSelectedDocument(document);
        setIsEditDialogOpen(true);
    };

    const handleDeleteDocument = (documentId: string) => {
    const document = documents.find((doc) => doc.id === documentId) || { title: "Tài liệu không xác định" };
    setDocumentToDelete({ id: documentId, title: document.title });
    setIsDeleteDialogOpen(true);
};

    const confirmDeleteDocument = async () => {
        if (!documentToDelete) return;

        try {
            await documentApi.deleteDocument(documentToDelete.id);
            // Làm mới danh sách tài liệu
            const response = await documentApi.getAllDocuments({
                page: pagination.pageIndex + 1,
                limit: pagination.pageSize,
                accessType: filters.accessType,
                categoryId: filters.category,
                tag: filters.tag,
                group: filters.group,
            });
            setFilteredDocuments(response.data);
            setTotalDocuments(response.meta.total);
            toast.success(
                `Tài liệu "${documentToDelete.title}" đã được xóa thành công`
            );
            setIsDeleteDialogOpen(false);
            setDocumentToDelete(null);
        } catch (error: any) {
            console.error("Lỗi khi xóa tài liệu:", error);
            if (error.status === 403) {
                toast.error("Bạn không có quyền xóa tài liệu này");
            } else if (error.status === 404) {
                toast.error("Tài liệu không tồn tại");
            } else {
                toast.error(error.message || "Không thể xóa tài liệu");
            }
        }
    };

    return (
        <div className="flex flex-col h-full">
            <DocumentsHeader
                onCreateDocument={() => setIsDocumentModalOpen(true)}
            />
            <div className="p-4 md:p-6 flex flex-col gap-6">
                <DocumentsFilters />
                <DocumentsTable
                    onDelete={handleDeleteDocument}
                    onEdit={handleEditDocument}
                />
            </div>

            <UploadDocumentDialog
                open={isDocumentModalOpen}
                onOpenChange={setIsDocumentModalOpen}
            />

            {selectedDocument && (
                <>
                    <DocumentDetailsDialog
                        open={isDetailsModalOpen}
                        onOpenChange={setIsDetailsModalOpen}
                        document={selectedDocument}
                    />
                    <EditDocumentDialog
                        open={isEditDialogOpen}
                        onOpenChange={setIsEditDialogOpen}
                        document={selectedDocument}
                    />
                </>
            )}

            <AlertDialog
                open={isDeleteDialogOpen}
                onOpenChange={setIsDeleteDialogOpen}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            Xác nhận xóa tài liệu
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            Bạn có chắc chắn muốn xóa tài liệu "
                            {documentToDelete?.title}"? Hành động này không thể
                            hoàn tác.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel
                            onClick={() => setDocumentToDelete(null)}
                        >
                            Hủy
                        </AlertDialogCancel>
                        <AlertDialogAction onClick={confirmDeleteDocument}>
                            Xóa
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}

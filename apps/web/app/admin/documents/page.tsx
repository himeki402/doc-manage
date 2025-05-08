"use client";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import documentApi from "@/lib/apis/documentApi";
import { Document } from "@/lib/types/document";
import { DashboardHeader } from "@/components/common/admin/admin-dashboard-header";
import { DocumentsTable } from "@/components/common/admin/documentAdmin/DocumentTable";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { UploadDocumentDialog } from "@/components/common/admin/documentAdmin/DocumentUploadDialog";

export default function DocumentsAdminPage() {
    const [showDocumentDialog, setShowDocumentDialog] = useState(false);
    const [documents, setDocuments] = useState<Document[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [editingDocument, setEditingDocument] = useState<Document | null>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [filteredDocuments, setFilteredDocuments] = useState<Document[]>([]);

    useEffect(() => {
        fetchDocuments();
    }, []);

    const fetchDocuments = async () => {
        try {
            setIsLoading(true);
            const response = await documentApi.getAllDocuments({
                limit: 20
            });
            setDocuments(response.data);
        } catch (error: any) {
            console.error("Không thể lấy danh sách tài liệu:", error);
            toast.error(error.message || "Không thể lấy danh sách tài liệu");
        } finally {
            setIsLoading(false);
        }
    };

    const handleAddDocument = () => {
        setEditingDocument(null);
        setShowDocumentDialog(true);
    };

    const handleEditDocument = (document: Document) => {
        setEditingDocument(document);
        setShowDocumentDialog(true);
    };

    const handleDeleteDocument = async (documentId: string) => {
        try {
            setIsLoading(true);
            await documentApi.deleteDocument(documentId);
            setDocuments(documents.filter((doc) => doc.id !== documentId));
            toast.success("Xóa tài liệu thành công");
        } catch (error: any) {
            console.error("Không thể xóa tài liệu:", error);
            toast.error(error.message || "Không thể xóa tài liệu");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <DashboardHeader
                title="Quản lý tài liệu"
                description="Quản lý tất cả tài liệu trong hệ thống."
                actions={
                    <Button onClick={handleAddDocument}>
                        <PlusIcon className="mr-2 h-4 w-4" />
                        Thêm tài liệu
                    </Button>
                }
            />
            <UploadDocumentDialog
                open={showDocumentDialog}
                onOpenChange={setShowDocumentDialog}
                onSubmit={handleAddDocument}
            />
            <DocumentsTable 
                documents={documents} 
                isLoading={isLoading}
                onEdit={handleEditDocument}
                onDelete={handleDeleteDocument}
            />
        </div>
    );
}
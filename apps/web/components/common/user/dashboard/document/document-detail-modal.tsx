import { Document } from "@/lib/types/document";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import {
    AlertDialogFooter,
    AlertDialogHeader,
} from "@/components/ui/alert-dialog";
import { Download, Share2, Edit, Trash2 } from "lucide-react";
import { useState } from "react";
import DocumentInfoTab from "./document-info-tab";
import DocumentContentTab from "./document-content-tab";


interface DocumentDetailModalProps {
    document: Document | null;
    isOpen: boolean;
    onClose: () => void;
    onEdit: (document: Document) => void;
    onDelete: (document: Document) => void;
}

export default function DocumentDetailModal({
    document,
    isOpen,
    onClose,
    onEdit,
    onDelete,
}: DocumentDetailModalProps) {
    const [activeTab, setActiveTab] = useState<"info" | "content">("info");

    const handleDownload = () => {
        if (document && document.fileUrl) {
            window.open(document.fileUrl, "_blank");
        }
    };

    if (!document) return null;

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[900px] max-h-[90vh]">
                <AlertDialogHeader>
                    <DialogTitle>{document.title}</DialogTitle>
                    {/* Tab Navigation */}
                    <div className="flex border-b">
                        <button
                            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                                activeTab === "info"
                                    ? "border-blue-500 text-blue-600"
                                    : "border-transparent text-gray-500 hover:text-gray-700"
                            }`}
                            onClick={() => setActiveTab("info")}
                        >
                            Thông tin cơ bản
                        </button>
                        <button
                            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                                activeTab === "content"
                                    ? "border-blue-500 text-blue-600"
                                    : "border-transparent text-gray-500 hover:text-gray-700"
                            }`}
                            onClick={() => setActiveTab("content")}
                        >
                            Nội dung & Tóm tắt
                        </button>
                    </div>
                </AlertDialogHeader>

                <div className="overflow-y-auto max-h-[60vh]">
                    {activeTab === "info" && (
                        <DocumentInfoTab document={document} />
                    )}
                    {activeTab === "content" && (
                        <DocumentContentTab document={document} />
                    )}
                </div>

                <AlertDialogFooter className="flex justify-between sm:justify-between">
                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={handleDownload}
                        >
                            <Download className="h-4 w-4 mr-1" />
                            Tải xuống
                        </Button>
                        <Button variant="outline" size="sm">
                            <Share2 className="h-4 w-4 mr-1" />
                            Chia sẻ
                        </Button>
                    </div>
                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                                onClose();
                                onEdit(document);
                            }}
                        >
                            <Edit className="h-4 w-4 mr-1" />
                            Chỉnh sửa
                        </Button>
                        <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => {
                                onClose();
                                onDelete(document);
                            }}
                        >
                            <Trash2 className="h-4 w-4 mr-1" />
                            Xóa
                        </Button>
                    </div>
                </AlertDialogFooter>
            </DialogContent>
        </Dialog>
    );
}

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
import {
    FileText,
    FileEdit,
    MoreHorizontal,
    Trash2,
    Eye,
    Edit,
    ImageIcon,
    Tag,
    Calendar,
    FileImage,
    Download,
    Share2,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import documentApi, { DocumentQueryParams } from "@/lib/apis/documentApi";
import { Document, GetDocumentsResponse } from "@/lib/types/document";
import SGTthumbnail from "@/public/GiaoTrinh_thumbnail.jpg";
import { convertBytesToMB, formatDateToFullOptions } from "@/lib/utils";
import { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    AlertDialogFooter,
    AlertDialogHeader,
} from "@/components/ui/alert-dialog";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

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

    const getTagNames = (tags: { id: string; name: string }[] | undefined) => {
        if (!tags || !Array.isArray(tags)) {
            return [];
        }
        return tags
            .filter(
                (tag) => tag && typeof tag === "object" && tag.id && tag.name
            )
            .map((tag) => tag.name);
    };

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
                                <div
                                    key={doc.id}
                                    className="flex items-center justify-between p-4 hover:bg-slate-50"
                                >
                                    <div className="flex items-center gap-3">
                                        <div
                                            className={`w-10 h-10 rounded-md flex items-center justify-center ${
                                                doc.mimeType ===
                                                "application/pdf"
                                                    ? "bg-red-100 text-red-700"
                                                    : "bg-blue-100 text-blue-700"
                                            }`}
                                        >
                                            {doc.mimeType ===
                                            "application/pdf" ? (
                                                <FileText size={20} />
                                            ) : (
                                                <FileEdit size={20} />
                                            )}
                                        </div>
                                        <div>
                                            <p
                                                className="text-sm font-medium truncate max-w-[500px]"
                                                title={doc.title}
                                            >
                                                {doc.title}
                                            </p>
                                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                                <span>
                                                    {doc.mimeType ===
                                                    "application/pdf"
                                                        ? "PDF"
                                                        : "Word"}
                                                </span>
                                                <span>•</span>
                                                <span>
                                                    {doc.categoryName ||
                                                        "Không có danh mục"}
                                                </span>
                                                <span>•</span>
                                                <span>
                                                    Cập nhật{" "}
                                                    {formatDateToFullOptions(
                                                        doc.updated_at
                                                    )}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Badge
                                            variant="outline"
                                            className={`${
                                                doc.accessType === "PUBLIC"
                                                    ? "bg-green-50 text-green-700 border-green-200"
                                                    : doc.accessType === "GROUP"
                                                      ? "bg-blue-50 text-blue-700 border-blue-200"
                                                      : "bg-slate-50 text-slate-700 border-slate-200"
                                            }`}
                                        >
                                            {doc.accessType}
                                        </Badge>
                                        <div className="flex gap-1">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() =>
                                                    handleViewDetail(doc)
                                                }
                                            >
                                                <Eye size={16} />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => handleEdit(doc)}
                                            >
                                                <Edit size={16} />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() =>
                                                    handleDelete(doc)
                                                }
                                            >
                                                <Trash2 size={16} />
                                            </Button>
                                        </div>
                                    </div>
                                </div>
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
            {/* Document Detail Dialog */}
            {selectedDocument && (
                <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
                    <DialogContent className="sm:max-w-[800px]">
                        <AlertDialogHeader>
                            <DialogTitle>{selectedDocument.title}</DialogTitle>
                        </AlertDialogHeader>
                        <div className="grid gap-4">
                            <div className="bg-slate-50 rounded-md overflow-hidden">
                                <Image
                                    src={selectedDocument.thumbnailUrl || SGTthumbnail}
                        alt={selectedDocument.title}
                        width={300}
                        height={400}
                        className="w-full h-60 object-contain py-2"
                                />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <h3 className="text-sm font-medium mb-1">
                                        Thông tin
                                    </h3>
                                    <p className="text-sm text-muted-foreground">
                                        {selectedDocument.description}
                                    </p>

                                    <h3 className="text-sm font-medium mt-3 mb-1">
                                        Tags
                                    </h3>
                                    <div className="flex flex-wrap gap-1">
                                        {getTagNames(selectedDocument.tags)
                                            .length > 0 ? (
                                            getTagNames(
                                                selectedDocument.tags
                                            ).map((tagName, index) => (
                                                <Badge
                                                    key={`${tagName}-${index}`}
                                                    variant="secondary"
                                                    className="flex items-center gap-1"
                                                >
                                                    <Tag className="h-3 w-3" />
                                                    {tagName}
                                                </Badge>
                                            ))
                                        ) : (
                                            <span>Không có thẻ</span>
                                        )}
                                    </div>
                                </div>
                                <div>
                                    <h3 className="text-sm font-medium mb-1">
                                        Chi tiết
                                    </h3>
                                    <div className="space-y-2 text-sm">
                                        <div className="flex items-center">
                                            <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                                            <span>
                                                Tải lên:{" "}
                                                {formatDateToFullOptions(
                                                    selectedDocument.created_at
                                                )}
                                            </span>
                                        </div>
                                        <div className="flex items-center">
                                            <FileImage className="h-4 w-4 mr-2 text-muted-foreground" />
                                            <span>
                                                Kích thước:{" "}
                                                {convertBytesToMB(selectedDocument.fileSize ?? 0) }{" "}
                                                MB
                                            </span>
                                        </div>
                                        <div className="flex items-center">
                                            <Tag className="h-4 w-4 mr-2 text-muted-foreground" />
                                            <span>
                                                Trạng thái:{" "}
                                                {selectedDocument.accessType}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <AlertDialogFooter className="flex justify-between sm:justify-between">
                            <div className="flex gap-2">
                                <Button variant="outline" size="sm">
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
                                        setIsDetailOpen(false);
                                        handleEdit(selectedDocument);
                                    }}
                                >
                                    <Edit className="h-4 w-4 mr-1" />
                                    Chỉnh sửa
                                </Button>
                                <Button
                                    variant="destructive"
                                    size="sm"
                                    onClick={() => {
                                        setIsDetailOpen(false);
                                        handleDelete(selectedDocument);
                                    }}
                                >
                                    <Trash2 className="h-4 w-4 mr-1" />
                                    Xóa
                                </Button>
                            </div>
                        </AlertDialogFooter>
                    </DialogContent>
                </Dialog>
            )}
            {/* Edit Image Dialog */}
            {selectedDocument && (
                <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                    <DialogContent className="sm:max-w-[600px]">
                        <DialogHeader>
                            <DialogTitle>Chỉnh sửa tài liệu</DialogTitle>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                                <label
                                    htmlFor="title"
                                    className="text-right text-sm font-medium"
                                >
                                    Tiêu đề
                                </label>
                                <Input
                                    id="title"
                                    defaultValue={selectedDocument.title}
                                    className="col-span-3"
                                />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <label
                                    htmlFor="description"
                                    className="text-right text-sm font-medium"
                                >
                                    Mô tả
                                </label>
                                <Textarea
                                    id="description"
                                    defaultValue={selectedDocument.description}
                                    className="col-span-3 min-h-28"
                                />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <label
                                    htmlFor="access"
                                    className="text-right text-sm font-medium"
                                >
                                    Quyền truy cập
                                </label>
                                <Select
                                    defaultValue={selectedDocument.accessType}
                                >
                                    <SelectTrigger className="col-span-3">
                                        <SelectValue placeholder="Chọn quyền truy cập" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="PUBLIC">
                                            Công khai
                                        </SelectItem>
                                        <SelectItem value="PRIVATE">
                                            Riêng tư
                                        </SelectItem>
                                        <SelectItem value="GROUP">
                                            Nhóm
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <DialogFooter>
                            <Button
                                variant="outline"
                                onClick={() => setIsEditOpen(false)}
                            >
                                Hủy
                            </Button>
                            <Button onClick={saveEdit}>Lưu thay đổi</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            )}
            {/* Delete Confirmation Dialog */}
            {selectedDocument && (
                <Dialog
                    open={isDeleteConfirmOpen}
                    onOpenChange={setIsDeleteConfirmOpen}
                >
                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle>Xác nhận xóa</DialogTitle>
                        </DialogHeader>
                        <div className="py-4">
                            <p>
                                Bạn có chắc chắn muốn xóa tài liệu "
                                {selectedDocument.title}"?
                            </p>
                            <p className="text-sm text-muted-foreground mt-2">
                                Hành động này không thể hoàn tác.
                            </p>
                        </div>
                        <DialogFooter>
                            <Button
                                variant="outline"
                                onClick={() => setIsDeleteConfirmOpen(false)}
                            >
                                Hủy
                            </Button>
                            <Button
                                variant="destructive"
                                onClick={confirmDelete}
                            >
                                Xóa
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            )}
        </>
    );
}

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, FileEdit, Eye, Edit, Trash2, Share2, Image, Video, File } from "lucide-react";
import { Document } from "@/lib/types/document";
import { formatDateToFullOptions } from "@/lib/utils";
import { useState } from "react";
import documentApi from "@/lib/apis/documentApi";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface DocumentItemProps {
    document: Document;
    onViewDetail: (document: Document) => void;
    onEdit: (document: Document) => void;
    onDelete: (document: Document) => void;
}

export default function DocumentItem({
    document,
    onViewDetail,
    onEdit,
    onDelete,
}: DocumentItemProps) {
    const [isRequesting, setIsRequesting] = useState(false);
    const router = useRouter();
    const handleRequestPublic = async () => {
        setIsRequesting(true);
        try {
            await documentApi.requestApproveDocument(document.id);
            toast.success(
                "Yêu cầu chuyển trạng thái thành Công khai đã được gửi đến admin"
            );
        } catch (error: any) {
            console.error("Lỗi khi gửi yêu cầu công khai:", error);
            if (error.status === 403) {
                toast.error("Bạn không có quyền gửi yêu cầu này");
            } else if (error.status === 404) {
                toast.error("Tài liệu không tồn tại");
            } else {
                toast.error(error.message || "Không thể gửi yêu cầu công khai");
            }
        } finally {
            setIsRequesting(false);
        }
    };

    // Xác định biểu tượng và text dựa trên mimeType
    const getFileIconAndType = (mimeType: string) => {
        switch (mimeType) {
            case "application/pdf":
                return { icon: <FileText size={20} />, type: "PDF" };
            case "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
                return { icon: <FileEdit size={20} />, type: "Word" };
            case "image/jpeg":
            case "image/png":
            case "image/gif":
            case "image/webp":
            case "image/svg+xml":
            case "image/tiff":
            case "image/bmp":
            case "image/jpg":
                return { icon: <Image size={20} />, type: "Image" };
            default:
                return { icon: <File size={20} />, type: "File" };
        }
    };

    const handleTitleClick = (e: React.MouseEvent) => {
        e.preventDefault();
        router.push(`/doc/${document.id}`);
    };

    const { icon, type } = getFileIconAndType(document.mimeType);

    return (
        <div className="flex items-center justify-between p-4 hover:bg-slate-50">
            <div className="flex items-center gap-3">
                <div
                    className={`w-10 h-10 rounded-md flex items-center justify-center ${
                        document.mimeType === "application/pdf"
                            ? "bg-red-100 text-red-700"
                            : document.mimeType === "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                              ? "bg-blue-100 text-blue-700"
                              : document.mimeType.startsWith("image/")
                                ? "bg-green-100 text-green-700"
                                : document.mimeType.startsWith("video/")
                                  ? "bg-purple-100 text-purple-700"
                                  : "bg-gray-100 text-gray-700"
                    }`}
                >
                    {icon}
                </div>
                <div>
                    <p
                        className="text-sm font-medium truncate max-w-[500px] cursor-pointer"
                        title={document.title}
                        onClick={handleTitleClick}
                    >
                        {document.title}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span>{type}</span>
                        <span>•</span>
                        <span>
                            {document.categoryName || "Không có danh mục"}
                        </span>
                        <span>•</span>
                        <span>
                            Cập nhật{" "}
                            {formatDateToFullOptions(document.updated_at)}
                        </span>
                    </div>
                </div>
            </div>
            <div className="flex items-center gap-2">
                <Badge
                    variant="outline"
                    className={`${
                        document.accessType === "PUBLIC"
                            ? "bg-green-50 text-green-700 border-green-200"
                            : document.accessType === "GROUP"
                              ? "bg-blue-50 text-blue-700 border-blue-200"
                              : "bg-slate-50 text-slate-700 border-slate-200"
                    }`}
                >
                    {document.accessType}
                </Badge>
                <div className="flex gap-1">
                    {document.accessType !== "PUBLIC" && document.accessType !== "GROUP" && (
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={handleRequestPublic}
                            disabled={isRequesting}
                            title="Yêu cầu chuyển thành Công khai"
                        >
                            <Share2 size={16} />
                        </Button>
                    )}
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onViewDetail(document)}
                        title="Xem chi tiết tài liệu"
                    >
                        <Eye size={16} />
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onEdit(document)}
                        title="Chỉnh sửa tài liệu"
                    >
                        <Edit size={16} />
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onDelete(document)}
                        title="Xóa tài liệu"
                    >
                        <Trash2 size={16} />
                    </Button>
                </div>
            </div>
        </div>
    );
}
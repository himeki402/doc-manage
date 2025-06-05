import { Document } from "@/lib/types/document";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import {
    AlertDialogFooter,
    AlertDialogHeader,
} from "@/components/ui/alert-dialog";
import {
    Calendar,
    FileImage,
    Tag,
    Download,
    Share2,
    Edit,
    Trash2,
    Users,
    BookOpen,
    Eye,
    Heart,
    Star,
    FileText,
    Sparkles,
    Loader2,
} from "lucide-react";
import Image from "next/image";
import SGTthumbnail from "@/public/GiaoTrinh_thumbnail.jpg";
import { convertBytesToMB, formatDateToFullOptions } from "@/lib/utils";
import { useState } from "react";

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
    const [isLoadingSummary, setIsLoadingSummary] = useState(false);
    const [summary, setSummary] = useState<string>("");
    const [documentContent, setDocumentContent] = useState<string>("");

    const handleDownload = () => {
        if (document && document.fileUrl) {
            window.open(document.fileUrl, "_blank");
        }
    };

    const handleSummarize = async () => {
        setIsLoadingSummary(true);
        try {
            // Giả lập API call để tóm tắt nội dung
            // Thay thế bằng API thực tế của bạn
            const response = await fetch("/api/summarize", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    documentId: document?.id,
                    content: documentContent,
                }),
            });

            if (response.ok) {
                const data = await response.json();
                setSummary(data.summary);
            } else {
                setSummary("Không thể tóm tắt nội dung. Vui lòng thử lại sau.");
            }
        } catch (error) {
            console.error("Error summarizing document:", error);
            setSummary("Đã xảy ra lỗi khi tóm tắt nội dung.");
        } finally {
            setIsLoadingSummary(false);
        }
    };

    if (!document) return null;

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

    const isImage = document.mimeType?.startsWith("image/");
    const imageSource = isImage ? document.fileUrl : document.thumbnailUrl;

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
                        <div className="grid gap-4">
                            <div className="bg-slate-50 rounded-md overflow-hidden">
                                <Image
                                    src={imageSource || SGTthumbnail}
                                    alt={document.title}
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
                                        {document.description}
                                    </p>

                                    <h3 className="text-sm font-medium mt-3 mb-1">
                                        Tags
                                    </h3>
                                    <div className="flex flex-wrap gap-1">
                                        {getTagNames(document.tags).length >
                                        0 ? (
                                            getTagNames(document.tags).map(
                                                (tagName, index) => (
                                                    <Badge
                                                        key={`${tagName}-${index}`}
                                                        variant="secondary"
                                                        className="flex items-center gap-1"
                                                    >
                                                        <Tag className="h-3 w-3" />
                                                        {tagName}
                                                    </Badge>
                                                )
                                            )
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
                                            <Users className="h-4 w-4 mr-2 text-muted-foreground" />
                                            <span>
                                                Tải lên bởi:{" "}
                                                {document.createdByName ||
                                                    "Không xác định"}
                                            </span>
                                        </div>
                                        <div className="flex items-center">
                                            <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                                            <span>
                                                Tải lên:{" "}
                                                {formatDateToFullOptions(
                                                    document.created_at
                                                )}
                                            </span>
                                        </div>
                                        <div className="flex items-center">
                                            <FileImage className="h-4 w-4 mr-2 text-muted-foreground" />
                                            <span>
                                                Kích thước:{" "}
                                                {convertBytesToMB(
                                                    document.fileSize ?? 0
                                                )}{" "}
                                                MB
                                            </span>
                                        </div>
                                        <div className="flex items-center">
                                            <BookOpen className="h-4 w-4 mr-2 text-muted-foreground" />
                                            <span>
                                                Số trang:{" "}
                                                {document.pageCount ||
                                                    "Không xác định"}
                                            </span>
                                        </div>
                                        <div className="flex items-center">
                                            <Tag className="h-4 w-4 mr-2 text-muted-foreground" />
                                            <span>
                                                Danh mục:{" "}
                                                {document.categoryName ||
                                                    "Không xác định"}
                                            </span>
                                        </div>
                                        <div className="flex items-center">
                                            <Tag className="h-4 w-4 mr-2 text-muted-foreground" />
                                            <span>
                                                Trạng thái:{" "}
                                                {document.accessType}
                                            </span>
                                        </div>
                                        {document.accessType === "GROUP" &&
                                            document.groupName && (
                                                <div className="flex items-center">
                                                    <Users className="h-4 w-4 mr-2 text-muted-foreground" />
                                                    <span>
                                                        Nhóm:{" "}
                                                        {document.groupName}
                                                    </span>
                                                </div>
                                            )}
                                        <div className="flex items-center">
                                            <Eye className="h-4 w-4 mr-2 text-muted-foreground" />
                                            <span>
                                                Lượt xem: {document.view || 0}
                                            </span>
                                        </div>
                                        <div className="flex items-center">
                                            <Heart className="h-4 w-4 mr-2 text-muted-foreground" />
                                            <span>
                                                Lượt thích:{" "}
                                                {document.likeCount || 0}
                                            </span>
                                        </div>
                                        <div className="flex items-center">
                                            <Star className="h-4 w-4 mr-2 text-muted-foreground" />
                                            <span>
                                                Đánh giá: {document.rating || 0}{" "}
                                                ({document.ratingCount || 0}{" "}
                                                lượt)
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === "content" && (
                        <div className="grid gap-4">
                            {/* Nội dung văn bản */}
                            <div>
                                <div className="flex items-center justify-between mb-3">
                                    <h3 className="text-sm font-medium">
                                        Nội dung văn bản
                                    </h3>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={handleSummarize}
                                        disabled={isLoadingSummary}
                                    >
                                        {isLoadingSummary ? (
                                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                        ) : (
                                            <Sparkles className="h-4 w-4 mr-2" />
                                        )}
                                        {isLoadingSummary
                                            ? "Đang tóm tắt..."
                                            : "Tóm tắt"}
                                    </Button>
                                </div>
                                <div className="border rounded-md p-4 bg-gray-50 max-h-60 overflow-y-auto">
                                    <p className="text-sm text-gray-700 whitespace-pre-wrap">
                                        {document.content ||
                                            `Nội dung của tài liệu "${document.title}"...\n\nĐây là phần nội dung mẫu của tài liệu. Tạm thời chưa có nội dung thực tế được hiển thị ở đây.`}
                                    </p>
                                </div>
                            </div>

                            {/* Tóm tắt */}
                            <div>
                                <h3 className="text-sm font-medium mb-3">
                                    Tóm tắt nội dung
                                </h3>
                                <div className="border rounded-md p-4 bg-blue-50">
                                    {summary ? (
                                        <p className="text-sm text-gray-700 whitespace-pre-wrap">
                                            {summary}
                                        </p>
                                    ) : (
                                        <p className="text-sm text-gray-500 italic">
                                            Nhấn nút "Tóm tắt" để tạo tóm tắt
                                            nội dung tài liệu
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
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

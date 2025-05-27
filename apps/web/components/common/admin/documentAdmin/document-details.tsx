"use client";

import { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    FileText,
    Download,
    Share2,
    Clock,
    User,
    Eye,
    Star,
    Tag,
    FolderClosed,
    Lock,
    Users,
    Globe,
    History,
    Heart,
} from "lucide-react";
import { useAdminContext } from "@/contexts/adminContext";
import { Document } from "@/lib/types/document";
import { formatDateToFullOptions } from "@/lib/utils";

// Hàm định dạng fileSize từ bytes sang KB/MB
const formatFileSize = (bytes: number | undefined): string => {
    if (!bytes || isNaN(bytes)) return "Không xác định";
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
};

interface DocumentDetailsDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    document: Document;
}

export function DocumentDetailsDialog({
    open,
    onOpenChange,
    document,
}: DocumentDetailsDialogProps) {
    const {
        categories,
        tags,
        groups,
        users,
        setIsShareModalOpen,
        setIsVersionModalOpen,
    } = useAdminContext();
    const [activeTab, setActiveTab] = useState("overview");

    const getAccessTypeIcon = (accessType: string) => {
        switch (accessType.toLowerCase()) {
            case "private":
                return <Lock className="h-4 w-4 text-red-500" />;
            case "public":
                return <Globe className="h-4 w-4 text-green-500" />;
            case "group":
                return <Users className="h-4 w-4 text-blue-500" />;
            default:
                return null;
        }
    };

    // Hàm xử lý tags để trả về mảng tên thẻ
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

    // Hàm lấy tên nhóm dựa trên groupId
    const getGroupName = () => {
        if (document.accessType.toLowerCase() !== "group") {
            return null;
        }
        // Ưu tiên document.groupName nếu có
        if (document.groupName) {
            return document.groupName;
        }
        // Nếu không, tra cứu trong groups dựa trên groupId
        if (document.groupId) {
            const group = groups.find((g) => g.id === document.groupId);
            return group?.name || "Nhóm không xác định";
        }
        return "Không có nhóm";
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[800px] max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <FileText className="h-5 w-5" />
                        {document.title || "Không có tiêu đề"}
                    </DialogTitle>
                    <DialogDescription>
                        {document.description || "Không có mô tả"}
                    </DialogDescription>
                </DialogHeader>

                <Tabs
                    defaultValue="overview"
                    value={activeTab}
                    onValueChange={setActiveTab}
                    className="w-full"
                >
                    <TabsList className="grid grid-cols-3 mb-4">
                        <TabsTrigger value="overview">Tổng quan</TabsTrigger>
                        <TabsTrigger value="versions">
                            Lịch sử phiên bản
                        </TabsTrigger>
                        <TabsTrigger value="audit">Nhật ký kiểm tra</TabsTrigger>
                    </TabsList>

                    <TabsContent value="overview" className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Card>
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-base">
                                        Thông tin tài liệu
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-2">
                                    <div className="flex justify-between">
                                        <span className="text-sm text-muted-foreground">
                                            Loại:
                                        </span>
                                        <Badge variant="outline">
                                            {document.mimeType ||
                                                "Không xác định"}
                                        </Badge>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-sm text-muted-foreground">
                                            Kích thước:
                                        </span>
                                        <span>
                                            {formatFileSize(document.fileSize)}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-sm text-muted-foreground">
                                            Link:
                                        </span>
                                        <a href={document.fileUrl}>
                                            {"S3 storage"}
                                        </a>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-sm text-muted-foreground">
                                            Danh mục:
                                        </span>
                                        <div className="flex items-center gap-1">
                                            <FolderClosed className="h-3.5 w-3.5" />
                                            <span>
                                                {document.categoryName ||
                                                    "Không có danh mục"}
                                            </span>
                                        </div>
                                    </div>
                                    {document.accessType.toLowerCase() ===
                                        "group" && (
                                        <div className="flex justify-between">
                                            <span className="text-sm text-muted-foreground">
                                                Nhóm:
                                            </span>
                                            <div className="flex items-center gap-1">
                                                <Users className="h-3.5 w-3.5 text-blue-500" />
                                                <span>{getGroupName()}</span>
                                            </div>
                                        </div>
                                    )}
                                    <div className="flex justify-between">
                                        <span className="text-sm text-muted-foreground">
                                            Phiên bản hiện tại:
                                        </span>
                                        <span>
                                            v{document.version || "1.0"}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-sm text-muted-foreground">
                                            Loại truy cập:
                                        </span>
                                        <div className="flex items-center gap-1">
                                            {getAccessTypeIcon(
                                                document.accessType
                                            )}
                                            <span className="capitalize">
                                                {document.accessType ||
                                                    "Không xác định"}
                                            </span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-base">
                                        Thống kê & Siêu dữ liệu
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-2">
                                    <div className="flex justify-between">
                                        <div className="flex items-center gap-1">
                                            <Eye className="h-3.5 w-3.5 text-muted-foreground" />
                                            <span className="text-sm text-muted-foreground">
                                                Lượt xem:
                                            </span>
                                        </div>
                                        <span>{document.view || 0}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <div className="flex items-center gap-1">
                                            <Heart className="h-3.5 w-3.5 text-muted-foreground" />
                                            <span className="text-sm text-muted-foreground">
                                                Lượt thích:
                                            </span>
                                        </div>
                                        <span>{document.likeCount || 0}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <div className="flex items-center gap-1">
                                            <Star className="h-3.5 w-3.5 text-muted-foreground" />
                                            <span className="text-sm text-muted-foreground">
                                                Đánh giá:
                                            </span>
                                        </div>
                                        <span>
                                            {document.rating ||
                                                "Chưa có đánh giá"}{" "}
                                            ({document.ratingCount || 0} đánh
                                            giá)
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <div className="flex items-center gap-1">
                                            <User className="h-3.5 w-3.5 text-muted-foreground" />
                                            <span className="text-sm text-muted-foreground">
                                                Chủ sở hữu:
                                            </span>
                                        </div>
                                        <span>
                                            {document.createdByName ||
                                                "Không xác định"}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <div className="flex items-center gap-1">
                                            <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                                            <span className="text-sm text-muted-foreground">
                                                Ngày tạo:
                                            </span>
                                        </div>
                                        <span>
                                            {formatDateToFullOptions(
                                                document.created_at
                                            ) || "Không xác định"}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <div className="flex items-center gap-1">
                                            <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                                            <span className="text-sm text-muted-foreground">
                                                Ngày sửa đổi cuối:
                                            </span>
                                        </div>
                                        <span>
                                            {formatDateToFullOptions(
                                                document.updated_at
                                            ) || "Không xác định"}
                                        </span>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        <Card>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-base">
                                    Tags
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex flex-wrap gap-2">
                                    {getTagNames(document.tags).length > 0 ? (
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
                            </CardContent>
                        </Card>

                        <div className="flex justify-end gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                asChild
                                disabled={!document.fileUrl}
                            >
                                <a
                                    href={document.fileUrl}
                                    download
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    <Download className="mr-2 h-4 w-4" />
                                    Tải về
                                </a>
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                    setIsShareModalOpen(true);
                                    onOpenChange(false);
                                }}
                            >
                                <Share2 className="mr-2 h-4 w-4" />
                                Chia sẻ
                            </Button>
                            <Button
                                size="sm"
                                onClick={() => {
                                    setIsVersionModalOpen(true);
                                    onOpenChange(false);
                                }}
                            >
                                <History className="mr-2 h-4 w-4" />
                                Tải lên phiên bản mới
                            </Button>
                        </div>
                    </TabsContent>
                    <TabsContent value="versions">
                        <div className="p-4">
                            <h3 className="text-lg font-medium">Lịch sử phiên bản</h3>
                            <p className="text-sm text-muted-foreground">
                                Xem lại các phiên bản trước đó của tài liệu này.
                            </p>
                        </div>
                        <div className="p-4">
                            <p className="text-sm text-muted-foreground">
                                Chức năng này sẽ được cập nhật sau.
                            </p>
                        </div>
                    </TabsContent>
                    <TabsContent value="audit">
                        <div className="p-4">
                            <h3 className="text-lg font-medium">Nhật ký kiểm tra</h3>
                            <p className="text-sm text-muted-foreground">
                                Theo dõi các hoạt động liên quan đến tài liệu này.
                            </p>
                        </div>
                        <div className="p-4">
                            <p className="text-sm text-muted-foreground">
                                Chức năng này sẽ được cập nhật sau.
                            </p>
                        </div>
                    </TabsContent>
                    {/* Các tab khác (versions, audit) đã được comment, nếu cần sẽ sửa sau */}
                </Tabs>
            </DialogContent>
        </Dialog>
    );
}

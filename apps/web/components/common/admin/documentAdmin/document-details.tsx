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
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
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
    AlertCircle,
    Calendar,
    Activity,
} from "lucide-react";
import { useAdminContext } from "@/contexts/adminContext";
import { Document } from "@/lib/types/document";
import { formatDateToFullOptions } from "@/lib/utils";

// Enhanced file size formatting with better error handling
const formatFileSize = (bytes: number | undefined): string => {
    if (!bytes || isNaN(bytes) || bytes < 0) return "Không xác định";
    
    const units = ['B', 'KB', 'MB', 'GB', 'TB'];
    let size = bytes;
    let unitIndex = 0;
    
    while (size >= 1024 && unitIndex < units.length - 1) {
        size /= 1024;
        unitIndex++;
    }
    
    return unitIndex === 0 
        ? `${size} ${units[unitIndex]}` 
        : `${size.toFixed(2)} ${units[unitIndex]}`;
};

// Enhanced rating display with stars
const formatRating = (rating: number | undefined, count: number | undefined) => {
    if (!rating || rating === 0) return "Chưa có đánh giá";
    
    const stars = "★".repeat(Math.floor(rating)) + "☆".repeat(5 - Math.floor(rating));
    return `${stars} ${rating.toFixed(1)} (${count || 0} đánh giá)`;
};

const calculateEngagementScore = (views: number, likes: number, rating: number, ratingCount: number) => {
    const viewScore = Math.min(views / 100, 1) * 30;
    const likeScore = Math.min(likes / 20, 1) * 25;
    const ratingScore = rating ? (rating / 5) * 25 : 0; 
    const engagementScore = ratingCount > 0 ? Math.min(ratingCount / 10, 1) * 20 : 0; 
    
    return Math.round(viewScore + likeScore + ratingScore + engagementScore);
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
                return <AlertCircle className="h-4 w-4 text-yellow-500" />;
        }
    };

    // Enhanced tag processing with validation
    const getTagNames = (tags: { id: string; name: string }[] | undefined) => {
        if (!tags || !Array.isArray(tags)) return [];
        
        return tags
            .filter(tag => tag?.id && tag?.name && typeof tag.name === 'string')
            .map(tag => tag.name.trim())
            .filter(name => name.length > 0);
    };

    // Enhanced group name resolution
    const getGroupName = () => {
        if (document.accessType.toLowerCase() !== "group") return null;
        
        if (document.groupName?.trim()) return document.groupName.trim();
        
        if (document.groupId && groups?.length > 0) {
            const group = groups.find(g => g.id === document.groupId);
            return group?.name?.trim() || "Nhóm không xác định";
        }
        
        return "Không có nhóm";
    };

    // Calculate engagement metrics
    const engagementScore = calculateEngagementScore(
        document.view || 0,
        document.likeCount || 0,
        document.rating || 0,
        document.ratingCount || 0
    );

    // Determine file type category for better display
    const getFileTypeCategory = (mimeType: string | undefined) => {
        if (!mimeType) return { category: "unknown", color: "gray" };
        
        if (mimeType.includes("image")) return { category: "Hình ảnh", color: "green" };
        if (mimeType.includes("video")) return { category: "Video", color: "purple" };
        if (mimeType.includes("audio")) return { category: "Âm thanh", color: "blue" };
        if (mimeType.includes("pdf")) return { category: "PDF", color: "red" };
        if (mimeType.includes("document") || mimeType.includes("word")) return { category: "Tài liệu", color: "blue" };
        if (mimeType.includes("spreadsheet") || mimeType.includes("excel")) return { category: "Bảng tính", color: "green" };
        if (mimeType.includes("presentation") || mimeType.includes("powerpoint")) return { category: "Trình bày", color: "orange" };
        
        return { category: "Khác", color: "gray" };
    };

    const fileTypeInfo = getFileTypeCategory(document.mimeType);

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[900px] max-h-[85vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-xl">
                        <FileText className="h-6 w-6" />
                        {document.title || "Không có tiêu đề"}
                    </DialogTitle>
                    <DialogDescription className="text-base">
                        {document.description || "Không có mô tả"}
                    </DialogDescription>
                </DialogHeader>

                <Tabs
                    defaultValue="overview"
                    value={activeTab}
                    onValueChange={setActiveTab}
                    className="w-full"
                >
                    <TabsList className="grid grid-cols-3 mb-6">
                        <TabsTrigger value="overview" className="flex items-center gap-2">
                            <FileText className="h-4 w-4" />
                            Tổng quan
                        </TabsTrigger>
                        <TabsTrigger value="versions" className="flex items-center gap-2">
                            <History className="h-4 w-4" />
                            Lịch sử phiên bản
                        </TabsTrigger>
                        <TabsTrigger value="audit" className="flex items-center gap-2">
                            <Activity className="h-4 w-4" />
                            Nhật ký hoạt động
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="overview" className="space-y-6">
                        {/* Engagement Score Card */}
                        <Card className="border-l-4 border-l-blue-500">
                            <CardHeader className="pb-3">
                                <CardTitle className="text-lg flex items-center gap-2">
                                    <Star className="h-5 w-5 text-yellow-500" />
                                    Điểm tương tác
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-center gap-4">
                                    <div className="flex-1">
                                        <Progress value={engagementScore} className="h-3" />
                                    </div>
                                    <div className="text-2xl font-bold text-blue-600">
                                        {engagementScore}/100
                                    </div>
                                </div>
                                <p className="text-sm text-muted-foreground mt-2">
                                    Dựa trên lượt xem, lượt thích và đánh giá
                                </p>
                            </CardContent>
                        </Card>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* Document Information */}
                            <Card>
                                <CardHeader className="pb-3">
                                    <CardTitle className="text-lg flex items-center gap-2">
                                        <FileText className="h-5 w-5" />
                                        Thông tin tài liệu
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-muted-foreground">Loại file:</span>
                                        <Badge variant="outline" className={`bg-${fileTypeInfo.color}-50 text-${fileTypeInfo.color}-700 border-${fileTypeInfo.color}-200`}>
                                            {fileTypeInfo.category}
                                        </Badge>
                                    </div>
                                    <Separator />
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-muted-foreground">Kích thước:</span>
                                        <span className="font-medium">
                                            {formatFileSize(document.fileSize)}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-muted-foreground">MIME Type:</span>
                                        <code className="text-xs bg-gray-100 px-2 py-1 rounded">
                                            {document.mimeType || "Không xác định"}
                                        </code>
                                    </div>
                                    <Separator />
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-muted-foreground">Danh mục:</span>
                                        <div className="flex items-center gap-2">
                                            <FolderClosed className="h-4 w-4" />
                                            <span className="font-medium">
                                                {document.categoryName || "Không có danh mục"}
                                            </span>
                                        </div>
                                    </div>
                                    {document.accessType.toLowerCase() === "group" && (
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm text-muted-foreground">Nhóm:</span>
                                            <div className="flex items-center gap-2">
                                                <Users className="h-4 w-4 text-blue-500" />
                                                <span className="font-medium">{getGroupName()}</span>
                                            </div>
                                        </div>
                                    )}
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-muted-foreground">Phiên bản:</span>
                                        <Badge variant="secondary">
                                            v{document.version || "1.0"}
                                        </Badge>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-muted-foreground">Truy cập:</span>
                                        <div className="flex items-center gap-2">
                                            {getAccessTypeIcon(document.accessType)}
                                            <span className="capitalize font-medium">
                                                {document.accessType || "Không xác định"}
                                            </span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Statistics & Metadata */}
                            <Card>
                                <CardHeader className="pb-3">
                                    <CardTitle className="text-lg flex items-center gap-2">
                                        <Activity className="h-5 w-5" />
                                        Thống kê & Siêu dữ liệu
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="text-center p-3 bg-blue-50 rounded-lg">
                                            <Eye className="h-6 w-6 text-blue-600 mx-auto mb-1" />
                                            <div className="text-2xl font-bold text-blue-600">
                                                {document.view || 0}
                                            </div>
                                            <div className="text-xs text-blue-600">Lượt xem</div>
                                        </div>
                                        <div className="text-center p-3 bg-red-50 rounded-lg">
                                            <Heart className="h-6 w-6 text-red-600 mx-auto mb-1" />
                                            <div className="text-2xl font-bold text-red-600">
                                                {document.likeCount || 0}
                                            </div>
                                            <div className="text-xs text-red-600">Lượt thích</div>
                                        </div>
                                    </div>
                                    <Separator />
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-muted-foreground">Đánh giá:</span>
                                        <span className="font-medium">
                                            {formatRating(document.rating, document.ratingCount)}
                                        </span>
                                    </div>
                                    <Separator />
                                    <div className="flex justify-between items-center">
                                        <div className="flex items-center gap-2">
                                            <User className="h-4 w-4 text-muted-foreground" />
                                            <span className="text-sm text-muted-foreground">Chủ sở hữu:</span>
                                        </div>
                                        <span className="font-medium">
                                            {document.createdByName || "Không xác định"}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <div className="flex items-center gap-2">
                                            <Calendar className="h-4 w-4 text-muted-foreground" />
                                            <span className="text-sm text-muted-foreground">Ngày tạo:</span>
                                        </div>
                                        <span className="font-medium text-right">
                                            {formatDateToFullOptions(document.created_at) || "Không xác định"}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <div className="flex items-center gap-2">
                                            <Clock className="h-4 w-4 text-muted-foreground" />
                                            <span className="text-sm text-muted-foreground">Sửa đổi cuối:</span>
                                        </div>
                                        <span className="font-medium text-right">
                                            {formatDateToFullOptions(document.updated_at) || "Không xác định"}
                                        </span>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Tags Section */}
                        <Card>
                            <CardHeader className="pb-3">
                                <CardTitle className="text-lg flex items-center gap-2">
                                    <Tag className="h-5 w-5" />
                                    Tags ({getTagNames(document.tags).length})
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex flex-wrap gap-2">
                                    {getTagNames(document.tags).length > 0 ? (
                                        getTagNames(document.tags).map((tagName, index) => (
                                            <Badge
                                                key={`${tagName}-${index}`}
                                                variant="secondary"
                                                className="flex items-center gap-1 px-3 py-1 text-sm"
                                            >
                                                <Tag className="h-3 w-3" />
                                                {tagName}
                                            </Badge>
                                        ))
                                    ) : (
                                        <div className="text-center w-full py-8 text-muted-foreground">
                                            <Tag className="h-12 w-12 mx-auto mb-2 opacity-50" />
                                            <p>Không có thẻ nào được gán cho tài liệu này</p>
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Action Buttons */}
                        <div className="flex justify-end gap-3">
                            <Button
                                variant="outline"
                                size="default"
                                asChild
                                disabled={!document.fileUrl}
                                className="flex items-center gap-2"
                            >
                                <a
                                    href={document.fileUrl}
                                    download
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    <Download className="h-4 w-4" />
                                    Tải về
                                </a>
                            </Button>
                            <Button
                                variant="outline"
                                size="default"
                                onClick={() => {
                                    setIsShareModalOpen(true);
                                    onOpenChange(false);
                                }}
                                className="flex items-center gap-2"
                            >
                                <Share2 className="h-4 w-4" />
                                Chia sẻ
                            </Button>
                            <Button
                                size="default"
                                onClick={() => {
                                    setIsVersionModalOpen(true);
                                    onOpenChange(false);
                                }}
                                className="flex items-center gap-2"
                            >
                                <History className="h-4 w-4" />
                                Tải lên phiên bản mới
                            </Button>
                        </div>
                    </TabsContent>

                    <TabsContent value="versions" className="space-y-4">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <History className="h-5 w-5" />
                                    Lịch sử phiên bản
                                </CardTitle>
                                <p className="text-sm text-muted-foreground">
                                    Xem và quản lý các phiên bản trước đó của tài liệu này.
                                </p>
                            </CardHeader>
                            <CardContent>
                                <div className="text-center py-12">
                                    <History className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                                    <h3 className="text-lg font-medium mb-2">Chức năng đang phát triển</h3>
                                    <p className="text-sm text-muted-foreground max-w-md mx-auto">
                                        Tính năng quản lý phiên bản sẽ cho phép bạn xem lịch sử thay đổi, 
                                        so sánh các phiên bản và khôi phục phiên bản trước đó.
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="audit" className="space-y-4">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Activity className="h-5 w-5" />
                                    Nhật ký kiểm tra
                                </CardTitle>
                                <p className="text-sm text-muted-foreground">
                                    Theo dõi tất cả các hoạt động và thay đổi liên quan đến tài liệu này.
                                </p>
                            </CardHeader>
                            <CardContent>
                                <div className="text-center py-12">
                                    <Activity className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                                    <h3 className="text-lg font-medium mb-2">Chức năng đang phát triển</h3>
                                    <p className="text-sm text-muted-foreground max-w-md mx-auto">
                                        Nhật ký kiểm tra sẽ hiển thị lịch sử truy cập, thay đổi quyền, 
                                        và các hoạt động khác liên quan đến tài liệu.
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </DialogContent>
        </Dialog>
    );
}
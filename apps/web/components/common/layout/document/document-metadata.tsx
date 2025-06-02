import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Document } from "@/lib/types/document";
import { formatDateToFullOptions } from "@/lib/utils";
import {
    Calendar,
    Eye,
    FileText,
    FolderClosed,
    Tag,
    ThumbsUp,
    ThumbsDown,
    UserCheck2,
    Loader2,
} from "lucide-react";
import { useState } from "react";

interface DocumentMetadataProps {
    document: Document;
    onRating?: (rating: "like" | "dislike") => void;
    isLoading?: boolean;
}

export function DocumentMetadata({
    document,
    onRating,
    isLoading,
}: DocumentMetadataProps) {
    const [userRating, setUserRating] = useState<"like" | "dislike" | null>(
        null
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

    const handleRating = (rating: "like" | "dislike") => {
        const newRating = userRating === rating ? null : rating;
        setUserRating(newRating);
        if (onRating && newRating) {
            onRating(newRating);
        }
    };

    return (
        <div className="sticky top-16">
            <div className="space-y-6 min-h-svh bg-slate-100 px-6 py-2">
                <div className="mt-4 gap-4">
                    <h2 className="text-2xl font-bold mb-6">
                        {document.title}
                    </h2>
                    <p className="text-base text-muted-foreground mb-2 line-clamp-6">
                        {document.description}
                    </p>
                </div>

                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-base">
                            Thông tin văn bản
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-[20px_1fr] gap-x-2 gap-y-3 items-center">
                            <FileText className="h-4 w-4 text-muted-foreground" />
                            <div className="flex justify-between">
                                <span className="text-sm">Type:</span>
                                <Badge variant="outline">
                                    {document.mimeType === "application/pdf"
                                        ? "PDF"
                                        : "Word"}
                                </Badge>
                            </div>

                            <FolderClosed className="h-4 w-4 text-muted-foreground" />
                            <div className="flex justify-between">
                                <span className="text-sm">Danh mục:</span>
                                <span className="text-sm font-medium">
                                    {document.categoryName}
                                </span>
                            </div>

                            <FileText className="h-4 w-4 text-muted-foreground" />
                            <div className="flex justify-between">
                                <span className="text-sm">Số trang:</span>
                                <span className="text-sm font-medium">
                                    {document.pageCount}
                                </span>
                            </div>
                            <Eye className="h-4 w-4 text-muted-foreground" />
                            <div className="flex justify-between">
                                <span className="text-sm">Lượt xem:</span>
                                <span className="text-sm font-medium">
                                    {document.view}
                                </span>
                            </div>
                            <UserCheck2 className="h-4 w-4 text-muted-foreground" />
                            <div className="flex justify-between">
                                <span className="text-sm">
                                    Được tải lên bởi:
                                </span>
                                <span className="text-sm font-medium">
                                    {document.createdByName}
                                </span>
                            </div>
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <div className="flex justify-between">
                                <span className="text-sm">
                                    Được tải lên vào:
                                </span>
                                <span className="text-sm font-medium">
                                    {formatDateToFullOptions(
                                        document.created_at
                                    )}
                                </span>
                            </div>
                            <ThumbsUp className="h-4 w-4 text-muted-foreground" />
                            <div className="flex justify-between">
                                <span className="text-sm">Đánh giá:</span>
                                <span className="text-sm font-medium">
                                    <span className="flex items-center gap-2">
                                        <ThumbsUp className="h-4 w-4 text-green-600" />
                                        {document.likeCount ?? 0}
                                        <ThumbsDown className="h-4 w-4 text-red-600 ml-2" />
                                        {document.dislikeCount ?? 0}
                                    </span>
                                </span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-base">Thẻ</CardTitle>
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

                {/* Card đánh giá mới */}
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-base">
                            Đánh giá tài liệu
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex gap-3 justify-center">
                            <Button
                                variant={
                                    userRating === "like"
                                        ? "default"
                                        : "outline"
                                }
                                size="sm"
                                onClick={() => handleRating("like")}
                                className={`flex items-center gap-2 ${
                                    userRating === "like"
                                        ? "bg-green-600 hover:bg-green-700"
                                        : "hover:bg-green-50 hover:text-green-600 hover:border-green-600"
                                }`}
                            >
                                {isLoading ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                    <ThumbsUp className="h-4 w-4" />
                                )}
                                Hữu ích
                            </Button>
                            <Button
                                variant={
                                    userRating === "dislike"
                                        ? "default"
                                        : "outline"
                                }
                                size="sm"
                                onClick={() => handleRating("dislike")}
                                className={`flex items-center gap-2 ${
                                    userRating === "dislike"
                                        ? "bg-red-600 hover:bg-red-700"
                                        : "hover:bg-red-50 hover:text-red-600 hover:border-red-600"
                                }`}
                            >
                                {isLoading ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                    <ThumbsDown className="h-4 w-4" />
                                )}
                                Không hữu ích
                            </Button>
                        </div>
                        {userRating && (
                            <p className="text-sm text-center mt-3 text-muted-foreground">
                                Cảm ơn bạn đã đánh giá tài liệu này!
                            </p>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

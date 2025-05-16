import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Document } from "@/lib/types/document";
import { formatDateToFullOptions } from "@/lib/utils";
import {
    Calendar,
    Clock,
    Eye,
    FileText,
    FolderClosed,
    Star,
    Tag,
    ThumbsUp,
    UserCheck2,
} from "lucide-react";

interface DocumentMetadataProps {
    document: Document;
}

export function DocumentMetadata({ document }: DocumentMetadataProps) {
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
                                    {document.mimeType}
                                </Badge>
                            </div>

                            <FolderClosed className="h-4 w-4 text-muted-foreground" />
                            <div className="flex justify-between">
                                <span className="text-sm">Category:</span>
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
                                <span className="text-sm">Được tải lên vào:</span>
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
                                    {document.rating}
                                </span>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-base">Tags</CardTitle>
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
            </div>{" "}
        </div>
    );
}

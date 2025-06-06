import { Document } from "@/lib/types/document";
import { Badge } from "@/components/ui/badge";
import {
    Calendar,
    FileImage,
    Tag,
    Users,
    BookOpen,
    Eye,
    Heart,
    Star,
} from "lucide-react";
import Image from "next/image";
import SGTthumbnail from "@/public/GiaoTrinh_thumbnail.jpg";
import { convertBytesToMB, formatDateToFullOptions } from "@/lib/utils";

interface DocumentInfoTabProps {
    document: Document;
}

export default function DocumentInfoTab({ document }: DocumentInfoTabProps) {
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
                    <h3 className="text-sm font-medium mb-1">Thông tin</h3>
                    <p className="text-sm text-muted-foreground">
                        {document.description}
                    </p>

                    <h3 className="text-sm font-medium mt-3 mb-1">Tags</h3>
                    <div className="flex flex-wrap gap-1">
                        {getTagNames(document.tags).length > 0 ? (
                            getTagNames(document.tags).map((tagName, index) => (
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
                    <h3 className="text-sm font-medium mb-1">Chi tiết</h3>
                    <div className="space-y-2 text-sm">
                        <div className="flex items-center">
                            <Users className="h-4 w-4 mr-2 text-muted-foreground" />
                            <span>
                                Tải lên bởi:{" "}
                                {document.createdByName || "Không xác định"}
                            </span>
                        </div>
                        <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                            <span>
                                Tải lên:{" "}
                                {formatDateToFullOptions(document.created_at)}
                            </span>
                        </div>
                        <div className="flex items-center">
                            <FileImage className="h-4 w-4 mr-2 text-muted-foreground" />
                            <span>
                                Kích thước:{" "}
                                {convertBytesToMB(document.fileSize ?? 0)} MB
                            </span>
                        </div>
                        <div className="flex items-center">
                            <BookOpen className="h-4 w-4 mr-2 text-muted-foreground" />
                            <span>
                                Số trang:{" "}
                                {document.pageCount || "Không xác định"}
                            </span>
                        </div>
                        <div className="flex items-center">
                            <Tag className="h-4 w-4 mr-2 text-muted-foreground" />
                            <span>
                                Danh mục:{" "}
                                {document.categoryName || "Không xác định"}
                            </span>
                        </div>
                        <div className="flex items-center">
                            <Tag className="h-4 w-4 mr-2 text-muted-foreground" />
                            <span>Trạng thái: {document.accessType}</span>
                        </div>
                        {document.accessType === "GROUP" &&
                            document.groupName && (
                                <div className="flex items-center">
                                    <Users className="h-4 w-4 mr-2 text-muted-foreground" />
                                    <span>Nhóm: {document.groupName}</span>
                                </div>
                            )}
                        <div className="flex items-center">
                            <Eye className="h-4 w-4 mr-2 text-muted-foreground" />
                            <span>Lượt xem: {document.view || 0}</span>
                        </div>
                        <div className="flex items-center">
                            <Heart className="h-4 w-4 mr-2 text-muted-foreground" />
                            <span>Lượt thích: {document.likeCount || 0}</span>
                        </div>
                        <div className="flex items-center">
                            <Star className="h-4 w-4 mr-2 text-muted-foreground" />
                            <span>
                                Đánh giá: {document.rating || 0} (
                                {document.ratingCount || 0} lượt)
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
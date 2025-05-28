import { Document } from "@/lib/types/document";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
import {
    Calendar,
    FileImage,
    Tag,
    Download,
    Share2,
    Edit,
    Trash2,
} from "lucide-react";
import Image from "next/image";
import SGTthumbnail from "@/public/GiaoTrinh_thumbnail.jpg";
import { convertBytesToMB, formatDateToFullOptions } from "@/lib/utils";

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

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[800px]">
                <AlertDialogHeader>
                    <DialogTitle>{document.title}</DialogTitle>
                </AlertDialogHeader>
                <div className="grid gap-4">
                    <div className="bg-slate-50 rounded-md overflow-hidden">
                        <Image
                            src={document.thumbnailUrl || SGTthumbnail}
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
                                    <Tag className="h-4 w-4 mr-2 text-muted-foreground" />
                                    <span>
                                        Trạng thái: {document.accessType}
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
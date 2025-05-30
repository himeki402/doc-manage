'use client'
import { AccessType, Document } from "@/lib/types/document"; 

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { useDashboardContext } from "@/contexts/dashboardContext";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import documentApi from "@/lib/apis/documentApi";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tag } from "@/lib/types/tag";

interface DocumentEditModalProps {
    document: Document;
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
}

export default function DocumentEditModal({
    document,
    isOpen,
    onOpenChange,
}: DocumentEditModalProps) {
    const { tags, groups, categories } = useDashboardContext();

    const [documentTitle, setDocumentTitle] = useState(document.title);
    const [description, setDescription] = useState(document.description || "");
    const [accessType, setAccessType] = useState<AccessType>(
        document.accessType
    );
    const [categoryId, setCategoryId] = useState(document.categoryId || "");
    const [selectedGroupId, setSelectedGroupId] = useState<string>(
        document.groupId || ""
    );
    const [selectedTagIds, setSelectedTagIds] = useState<string[]>(
        document.tags?.map((tag: Tag) => tag.id) || []
    );
    const [tagInput, setTagInput] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (isOpen && document) {
            setDocumentTitle(document.title || "");
            setDescription(document.description || "");
            setAccessType(document.accessType || "PRIVATE");
            setCategoryId(document.categoryId || "");
            setSelectedGroupId(document.groupId || "");
            setSelectedTagIds(
                document.tags?.filter((tag: Tag) => tag.id).map((tag: Tag) => tag.id) ||
                    []
            );
            setTagInput("");
        }
    }, [isOpen, document]);

    const handleAddTag = () => {
        if (!tagInput.trim()) {
            toast.info("Vui lòng nhập tên thẻ.");
            return;
        }
        const tag = tags.find(
            (t) => t.name.toLowerCase() === tagInput.trim().toLowerCase()
        );
        if (tag && !selectedTagIds.includes(tag.id)) {
            setSelectedTagIds([...selectedTagIds, tag.id]);
            setTagInput("");
        } else if (tag && selectedTagIds.includes(tag.id)) {
            toast.info("Thẻ này đã được chọn.");
            setTagInput("");
        }
         else if (!tag) {
            toast.error("Thẻ không tồn tại. Vui lòng chọn từ danh sách thẻ có sẵn hoặc tạo thẻ mới (nếu có chức năng).");
        }
    };

    const handleRemoveTag = (tagId: string) => {
        setSelectedTagIds(selectedTagIds.filter((id) => id !== tagId));
    };

    const handleSubmit = async () => {
        if (!documentTitle.trim() || !categoryId) {
            toast.error("Tiêu đề tài liệu và danh mục là bắt buộc.");
            return;
        }

        if (accessType === "GROUP" && !selectedGroupId) {
            toast.error("Vui lòng chọn một nhóm khi loại truy cập là Nhóm.");
            return;
        }

        setIsSubmitting(true);
        try {
            const payload = {
                title: documentTitle.trim(),
                description: description.trim(),
                accessType,
                categoryId: categoryId ? categoryId : "",
                tagIds: selectedTagIds,
                groupId: accessType === "GROUP" ? selectedGroupId : undefined,
            };

            const updatedDocument = await documentApi.updateDocument(
                document.id,
                payload
            );
            if (!updatedDocument) {
                throw new Error("Không nhận được dữ liệu tài liệu đã cập nhật từ máy chủ.");
            }

            toast.success("Tài liệu đã được cập nhật thành công!");
            onOpenChange(false);
            // Potentially call a function here to refresh the documents list in the dashboard
            // e.g., refreshDocuments();
        } catch (error: any) {
            console.error("Lỗi khi cập nhật tài liệu:", error);
            if (error.response && error.response.status === 403) {
                toast.error("Bạn không có quyền cập nhật tài liệu này.");
            } else if (error.response && error.response.status === 404) {
                toast.error("Tài liệu hoặc danh mục/nhóm không tồn tại.");
            } else {
                toast.error(error.message || "Không thể cập nhật tài liệu. Vui lòng thử lại.");
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    const selectedGroup = groups.find(g => g.id === selectedGroupId);

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Chỉnh sửa tài liệu</DialogTitle>
                </DialogHeader>
                <div className="grid gap-6 py-4 px-1"> 
                    <div className="grid gap-2">
                        <Label htmlFor="title">Tiêu đề</Label>
                        <Input
                            id="title"
                            value={documentTitle}
                            onChange={(e) => setDocumentTitle(e.target.value)}
                            placeholder="Nhập tiêu đề tài liệu"
                        />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="description">Mô tả</Label>
                        <Textarea
                            id="description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Nhập mô tả chi tiết cho tài liệu..."
                            className="min-h-28"
                        />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="category">Danh mục</Label>
                        <Select
                            value={categoryId}
                            onValueChange={setCategoryId}
                        >
                            <SelectTrigger id="category">
                                <SelectValue placeholder="Chọn danh mục" />
                            </SelectTrigger>
                            <SelectContent>
                                {categories.length > 0 ? (
                                    categories.map((category) => (
                                        <SelectItem
                                            key={category.id}
                                            value={category.id}
                                        >
                                            {category.name || "Danh mục không tên"}
                                        </SelectItem>
                                    ))
                                ) : (
                                    <SelectItem value="nodata" disabled>
                                        Không có danh mục để chọn
                                    </SelectItem>
                                )}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="access-type">Loại truy cập</Label>
                        <Select
                            value={accessType}
                            onValueChange={(value) =>
                                setAccessType(value as AccessType)
                            }
                        >
                            <SelectTrigger id="access-type">
                                <SelectValue placeholder="Chọn loại truy cập" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="PRIVATE">
                                    Riêng tư
                                </SelectItem>
                                <SelectItem value="GROUP">Nhóm</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {accessType === "GROUP" && (
                        <div className="grid gap-2">
                            <Label htmlFor="groups">Nhóm</Label>
                            <Select
                                value={selectedGroupId}
                                onValueChange={setSelectedGroupId}
                            >
                                <SelectTrigger id="groups">
                                    <SelectValue placeholder="Chọn nhóm" />
                                </SelectTrigger>
                                <SelectContent>
                                    {groups.length > 0 ? (
                                        groups.map((group) => (
                                            <SelectItem
                                                key={group.id}
                                                value={group.id}
                                            >
                                                {group.name || "Nhóm không tên"}
                                            </SelectItem>
                                        ))
                                    ) : (
                                        <SelectItem value="nodata" disabled>
                                            Không có nhóm để chọn
                                        </SelectItem>
                                    )}
                                </SelectContent>
                            </Select>
                            {selectedGroup && (
                                <div className="mt-2">
                                    <Badge
                                        variant="secondary"
                                        className="flex items-center gap-1 w-fit"
                                    >
                                        {selectedGroup.name || "Nhóm không tên"}
                                        <Button
                                            variant="ghost"
                                            size="sm" 
                                            className="h-4 w-4 rounded-full p-0 ml-1 hover:bg-destructive/20"
                                            onClick={() => setSelectedGroupId("")}
                                        >
                                            <span className="sr-only">Bỏ chọn nhóm</span>
                                            ×
                                        </Button>
                                    </Badge>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Tags */}
                    <div className="grid gap-3">
                        <Label htmlFor="tags-input">Thẻ</Label>
                        <div className="flex gap-2">
                            <Input
                                id="tags-input"
                                value={tagInput}
                                onChange={(e) => setTagInput(e.target.value)}
                                placeholder="Nhập tên thẻ rồi Enter hoặc nhấn Thêm"
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                        e.preventDefault();
                                        handleAddTag();
                                    }
                                }}
                            />
                            <Button type="button" onClick={handleAddTag} variant="outline">
                                Thêm thẻ
                            </Button>
                        </div>

                        {/* Available Tags for selection */}
                        {tags.length > 0 && (
                             <div className="mt-1">
                                <Label className="text-xs font-normal text-muted-foreground mb-1 block">Thẻ có sẵn (nhấn để chọn/bỏ chọn):</Label>
                                <div className="flex flex-wrap gap-2 p-2 border rounded-md max-h-32 overflow-y-auto">
                                    {tags.map((tag) => (
                                        <Badge
                                            key={tag.id}
                                            variant={
                                                selectedTagIds.includes(tag.id)
                                                    ? "default"
                                                    : "outline"
                                            }
                                            className="cursor-pointer hover:bg-accent"
                                            onClick={() => {
                                                if (selectedTagIds.includes(tag.id)) {
                                                    handleRemoveTag(tag.id);
                                                } else {
                                                    setSelectedTagIds([
                                                        ...selectedTagIds,
                                                        tag.id,
                                                    ]);
                                                }
                                            }}
                                        >
                                            {tag.name || "Thẻ không tên"}
                                        </Badge>
                                    ))}
                                </div>
                            </div>
                        )}
                        
                        {/* Selected Tags Display */}
                        {selectedTagIds.length > 0 && (
                            <div className="mt-1">
                                <Label className="text-xs font-medium mb-1 block">Thẻ đã chọn:</Label>
                                <div className="flex flex-wrap gap-2 p-2 border rounded-md bg-muted/30">
                                    {selectedTagIds.map((tagId) => {
                                        const tag = tags.find((t) => t.id === tagId);
                                        return tag ? (
                                            <Badge
                                                key={tagId}
                                                variant="secondary"
                                                className="flex items-center gap-1"
                                            >
                                                {tag.name || "Thẻ không tên"}
                                                <Button
                                                    variant="ghost"
                                                    size="sm" 
                                                    className="h-4 w-4 rounded-full p-0 ml-1 hover:bg-destructive/20"
                                                    onClick={() => handleRemoveTag(tagId)}
                                                >
                                                    <span className="sr-only">Xóa thẻ {tag.name}</span>×
                                                </Button>
                                            </Badge>
                                        ) : null;
                                    })}
                                </div>
                            </div>
                        )}
                         {(tags.length === 0 && selectedTagIds.length === 0) && (
                            <p className="text-sm text-muted-foreground mt-2">Không có thẻ nào khả dụng hoặc đã được chọn.</p>
                        )}
                    </div>
                </div>
                <DialogFooter className="mt-2 pt-4 border-t">
                    <Button
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                        disabled={isSubmitting}
                    >
                        Hủy
                    </Button>
                    <Button onClick={handleSubmit} disabled={isSubmitting}>
                        {isSubmitting ? "Đang lưu..." : "Lưu thay đổi"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
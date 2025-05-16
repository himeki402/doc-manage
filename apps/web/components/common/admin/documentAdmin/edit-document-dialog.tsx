"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useAdminContext } from "@/contexts/adminContext";
import { AccessType, Document } from "@/lib/types/document";
import { toast } from "sonner";
import documentApi from "@/lib/apis/documentApi";

interface EditDocumentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  document: Document;
}

export function EditDocumentDialog({ open, onOpenChange, document }: EditDocumentDialogProps) {
  const { documents, setDocuments, setFilteredDocuments, setTotalDocuments, categories, tags, groups, currentUser, filters, pagination } = useAdminContext();

  const [documentTitle, setDocumentTitle] = useState(document.title);
  const [description, setDescription] = useState(document.description || "");
  const [accessType, setAccessType] = useState<AccessType>(document.accessType);
  const [categoryId, setCategoryId] = useState(document.categoryId);
  const [selectedGroupId, setSelectedGroupId] = useState<string>(document.groupId || "");
  const [selectedTagIds, setSelectedTagIds] = useState<string[]>(document.tags?.map((tag) => tag.id) || []);
  const [tagInput, setTagInput] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (open && document) {
      setDocumentTitle(document.title || "");
      setDescription(document.description || "");
      setAccessType(document.accessType || "PRIVATE");
      setCategoryId(document.categoryId || "");
      setSelectedGroupId(document.groupId || "");
      setSelectedTagIds(document.tags?.filter((tag) => tag.id).map((tag) => tag.id) || []);
      setTagInput("");
    }
  }, [open, document]);

  const handleAddTag = () => {
    const tag = tags.find((t) => t.name.toLowerCase() === tagInput.toLowerCase());
    if (tag && !selectedTagIds.includes(tag.id)) {
      setSelectedTagIds([...selectedTagIds, tag.id]);
      setTagInput("");
    } else if (!tag) {
      toast.error("Thẻ không tồn tại");
    }
  };

  const handleRemoveTag = (tagId: string) => {
    setSelectedTagIds(selectedTagIds.filter((id) => id !== tagId));
  };

  const handleSubmit = async () => {
    if (!documentTitle || !categoryId) {
      toast.error("Tên tài liệu và danh mục là bắt buộc");
      return;
    }

    if (accessType === "GROUP" && !selectedGroupId) {
      toast.error("Vui lòng chọn một nhóm khi loại truy cập là Nhóm");
      return;
    }

    setIsSubmitting(true);
    try {
      const updatedDocument = await documentApi.updateDocument(document.id, {
        title: documentTitle,
        description,
        accessType,
        categoryId,
        tagIds: selectedTagIds,
        groupId: accessType === "GROUP" ? selectedGroupId : undefined,
      });

      // Cập nhật tài liệu trong danh sách cục bộ
      const updatedDocuments = documents.map((doc) =>
        doc.id === document.id ? { ...doc, ...updatedDocument } : doc
      );
      setDocuments(updatedDocuments);

      // Làm mới dữ liệu từ BE
      const response = await documentApi.getAllDocuments({
        page: pagination.pageIndex + 1,
        limit: pagination.pageSize,
        accessType: filters.accessType,
        categoryId: filters.category,
        tag: filters.tag,
        group: filters.group,
      });

      // Kiểm tra dữ liệu trả về
      if (!response.data || !Array.isArray(response.data)) {
        throw new Error("Dữ liệu trả về không hợp lệ");
      }

      // Đảm bảo tags trong response.data là mảng hợp lệ
      const sanitizedDocuments = response.data.map((doc: Document) => ({
        ...doc,
        tags: Array.isArray(doc.tags)
          ? doc.tags.filter((tag) => tag.id && tag.name)
          : [],
      }));

      setFilteredDocuments(sanitizedDocuments);
      setTotalDocuments(response.meta.total);

      toast.success("Tài liệu đã được cập nhật thành công");
      onOpenChange(false);
    } catch (error: any) {
      console.error("Lỗi khi cập nhật tài liệu:", error);
      if (error.status === 403) {
        toast.error("Bạn không có quyền cập nhật tài liệu này");
      } else if (error.status === 404) {
        toast.error("Tài liệu hoặc danh mục/nhóm không tồn tại");
      } else {
        toast.error(error.message || "Không thể cập nhật tài liệu");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Chỉnh sửa tài liệu</DialogTitle>
          <DialogDescription>Cập nhật chi tiết và quyền truy cập của tài liệu.</DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Tên tài liệu</Label>
            <Input
              id="name"
              value={documentTitle}
              onChange={(e) => setDocumentTitle(e.target.value)}
              placeholder="Nhập tên tài liệu"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="description">Mô tả</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Nhập mô tả tài liệu"
              rows={3}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="category">Danh mục</Label>
            <Select value={categoryId} onValueChange={setCategoryId}>
              <SelectTrigger id="category">
                <SelectValue placeholder="Chọn danh mục" />
              </SelectTrigger>
              <SelectContent>
                {categories.length > 0 ? (
                  categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name || "Danh mục không tên"}
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem value="" disabled>
                    Không có danh mục
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="access-type">Loại truy cập</Label>
            <Select value={accessType} onValueChange={(value) => setAccessType(value as AccessType)}>
              <SelectTrigger id="access-type">
                <SelectValue placeholder="Chọn loại truy cập" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="PRIVATE">Riêng tư</SelectItem>
                <SelectItem value="PUBLIC">Công khai</SelectItem>
                <SelectItem value="GROUP">Nhóm</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {accessType === "GROUP" && (
            <div className="grid gap-2">
              <Label htmlFor="groups">Nhóm</Label>
              <Select value={selectedGroupId} onValueChange={setSelectedGroupId}>
                <SelectTrigger id="groups">
                  <SelectValue placeholder="Chọn nhóm" />
                </SelectTrigger>
                <SelectContent>
                  {groups.length > 0 ? (
                    groups.map((group) => (
                      <SelectItem key={group.id} value={group.id}>
                        {group.name || "Nhóm không tên"}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="" disabled>
                      Không có nhóm
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
              {selectedGroupId && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {groups
                    .filter((g) => g.id === selectedGroupId)
                    .map((group) => (
                      <Badge key={group.id} variant="secondary" className="flex items-center gap-1">
                        {group.name || "Nhóm không tên"}
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-4 w-4 rounded-full p-0 ml-1"
                          onClick={() => setSelectedGroupId("")}
                        >
                          <span className="sr-only">Xóa</span>×
                        </Button>
                      </Badge>
                    ))}
                </div>
              )}
            </div>
          )}

          <div className="grid gap-2">
            <Label htmlFor="tags">Thẻ</Label>
            <div className="flex gap-2">
              <Input
                id="tags"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                placeholder="Nhập tên thẻ"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddTag();
                  }
                }}
              />
              <Button type="button" onClick={handleAddTag}>
                Thêm
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {tags.length > 0 ? (
                tags.map((tag) => (
                  <Badge
                    key={tag.id}
                    variant={selectedTagIds.includes(tag.id) ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => {
                      if (selectedTagIds.includes(tag.id)) {
                        handleRemoveTag(tag.id);
                      } else {
                        setSelectedTagIds([...selectedTagIds, tag.id]);
                      }
                    }}
                  >
                    {tag.name || "Thẻ không tên"}
                  </Badge>
                ))
              ) : (
                <span>Không có thẻ</span>
              )}
            </div>
            {selectedTagIds.length > 0 && (
              <div className="mt-2">
                <Label>Thẻ đã chọn</Label>
                <div className="flex flex-wrap gap-2 mt-1">
                  {selectedTagIds.map((tagId) => {
                    const tag = tags.find((t) => t.id === tagId);
                    return (
                      <Badge key={tagId} variant="secondary" className="flex items-center gap-1">
                        {tag?.name || "Thẻ không tên"}
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-4 w-4 rounded-full p-0 ml-1"
                          onClick={() => handleRemoveTag(tagId)}
                        >
                          <span className="sr-only">Xóa</span>×
                        </Button>
                      </Badge>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
            Hủy
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!documentTitle || !categoryId || isSubmitting}
          >
            {isSubmitting ? "Đang lưu..." : "Lưu thay đổi"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
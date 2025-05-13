"use client";

import { useState, useCallback } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
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
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Plus } from "lucide-react";
import { FileUploader } from "./DocumentUploader";
import Image from "next/image";
import { useAdminContext } from "@/contexts/adminContext";
import { AccessType } from "@/lib/types/document";
import { toast } from "sonner";
import documentApi from "@/lib/apis/documentApi";

interface UploadDocumentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit?: (data: UploadDocumentFormData) => void;
}

export interface UploadDocumentFormData {
  file: File | null;
  title: string;
  description: string;
  accessType: AccessType;
  categoryId: string;
  selectedTags: string[];
  groupId?: string;
}

export function UploadDocumentDialog({
  open,
  onOpenChange,
  onSubmit,
}: UploadDocumentDialogProps) {
  const { categories, tags, groups } = useAdminContext();

  const [file, setFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [accessType, setAccessType] = useState<AccessType>("PRIVATE");
  const [categoryId, setCategoryId] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [groupId, setGroupId] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [tagInput, setTagInput] = useState("");
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    if (!file) newErrors.file = "Vui lòng chọn tệp";
    if (!title.trim()) newErrors.title = "Tiêu đề là bắt buộc";
    if (!description.trim()) newErrors.description = "Mô tả là bắt buộc";
    if (!categoryId) newErrors.categoryId = "Vui lòng chọn danh mục";
    if (accessType === "GROUP" && !groupId) newErrors.groupId = "Vui lòng chọn nhóm";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleFileChange = useCallback((file: File | null) => {
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        toast.error("Tệp quá lớn, tối đa 10MB");
        return;
      }
      setFile(file);
      setErrors((prev) => ({ ...prev, file: "" }));

      const fileName = file.name.replace(/\.[^/.]+$/, "");
      setTitle(fileName);

      if (file.type === "application/pdf") {
        const reader = new FileReader();
        reader.onload = (e) => {
          setFilePreview(URL.createObjectURL(file));
        };
        reader.readAsDataURL(file);
      } else {
        setFilePreview(null);
      }
    } else {
      setFile(null);
      setFilePreview(null);
      setTitle("");
    }
  }, []);

  const handleAddTag = () => {
    const trimmedInput = tagInput.trim();
    if (!trimmedInput) return;

    // Tìm thẻ theo tên
    const tag = tags.find((t) => t.name.toLowerCase() === trimmedInput.toLowerCase());
    if (tag && !selectedTags.includes(tag.id)) {
      setSelectedTags([...selectedTags, tag.id]);
      setTagInput("");
      setErrors((prev) => ({ ...prev, tags: "" }));
    } else {
      setErrors((prev) => ({
        ...prev,
        tags: tag ? "Thẻ đã được chọn" : "Thẻ không tồn tại",
      }));
    }
  };

  const handleRemoveTag = (tagId: string) => {
    setSelectedTags(selectedTags.filter((id) => id !== tagId));
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      toast.error("Vui lòng điền đầy đủ các trường bắt buộc");
      return;
    }

    setIsUploading(true);

    try {
      const formData: UploadDocumentFormData = {
        file,
        title,
        description,
        accessType,
        categoryId,
        selectedTags,
        groupId: accessType === "GROUP" ? groupId : undefined,
      };

      const formDataToSend = new FormData();
      formDataToSend.append("file", file!);
      formDataToSend.append("title", title);
      formDataToSend.append("description", description);
      formDataToSend.append("accessType", accessType);
      formDataToSend.append("categoryId", categoryId);
      formDataToSend.append("tags", JSON.stringify(selectedTags));
      if (accessType === "GROUP" && groupId) {
        formDataToSend.append("groupId", groupId);
      }

      await documentApi.createDocument(formDataToSend);

      if (onSubmit) {
        await onSubmit(formData);
      }

      toast.success("Tài liệu đã được tải lên thành công");
      resetForm();
      onOpenChange(false);
    } catch (error: any) {
      console.error("Error uploading document:", error);
      toast.error(error.response?.data?.message || "Không thể tải lên tài liệu");
    } finally {
      setIsUploading(false);
    }
  };

  const resetForm = () => {
    setFile(null);
    setFilePreview(null);
    setTitle("");
    setDescription("");
    setAccessType("PRIVATE");
    setCategoryId("");
    setSelectedTags([]);
    setGroupId("");
    setTagInput("");
    setErrors({});
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] border-border">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Tải lên tài liệu mới</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-6 py-4">
          <div className="flex flex-col items-center">
            {!file ? (
              <FileUploader onFileSelected={handleFileChange} disabled={isUploading} />
            ) : (
              <div className="relative w-full aspect-[3/4] border border-border rounded-md overflow-hidden bg-card">
                <div className="absolute top-0 left-0 text-xs font-medium py-1 px-2 z-10 bg-primary/10 text-primary">
                  {file.type === "application/pdf"
                    ? "PDF"
                    : file.type.split("/")[1]?.toUpperCase() || "UNKNOWN"}
                </div>
                {filePreview ? (
                  <Image
                    src={filePreview || "/placeholder.svg"}
                    alt="Document preview"
                    className="w-full h-full object-contain"
                    layout="fill"
                    objectFit="contain"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                    {file.name}
                  </div>
                )}
                <Button
                  variant="destructive"
                  size="sm"
                  className="absolute bottom-2 right-2 opacity-80 hover:opacity-100"
                  onClick={() => handleFileChange(null)}
                >
                  Thay đổi
                </Button>
              </div>
            )}
            {errors.file && <p className="text-red-500 text-sm mt-2">{errors.file}</p>}
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">
                Tiêu đề <span className="text-red-500">*</span>
              </Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                  setErrors((prev) => ({ ...prev, title: "" }));
                }}
                placeholder="Nhập tiêu đề tài liệu"
                className="bg-background border-input focus:border-ring"
                required
              />
              {errors.title && <p className="text-red-500 text-sm">{errors.title}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">
                Mô tả <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => {
                  setDescription(e.target.value);
                  setErrors((prev) => ({ ...prev, description: "" }));
                }}
                placeholder="Nhập mô tả tài liệu..."
                className="min-h-[100px] bg-background border-input focus:border-ring"
                required
              />
              {errors.description && (
                <p className="text-red-500 text-sm">{errors.description}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="access-type">Quyền truy cập</Label>
              <Select
                value={accessType}
                onValueChange={(value) => {
                  setAccessType(value as AccessType);
                  if (value !== "GROUP") setGroupId("");
                }}
              >
                <SelectTrigger id="access-type">
                  <SelectValue placeholder="Chọn quyền truy cập" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PRIVATE">Riêng tư</SelectItem>
                  <SelectItem value="PUBLIC">Công khai</SelectItem>
                  <SelectItem value="GROUP">Nhóm</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {accessType === "GROUP" && (
              <div className="space-y-2">
                <Label htmlFor="group">
                  Nhóm <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={groupId}
                  onValueChange={(value) => {
                    setGroupId(value);
                    setErrors((prev) => ({ ...prev, groupId: "" }));
                  }}
                >
                  <SelectTrigger id="group">
                    <SelectValue placeholder="Chọn nhóm" />
                  </SelectTrigger>
                  <SelectContent>
                    {groups.map((group) => (
                      <SelectItem key={group.id} value={group.id}>
                        {group.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.groupId && <p className="text-red-500 text-sm">{errors.groupId}</p>}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="category">
                Danh mục <span className="text-red-500">*</span>
              </Label>
              <Select
                value={categoryId}
                onValueChange={(value) => {
                  setCategoryId(value);
                  setErrors((prev) => ({ ...prev, categoryId: "" }));
                }}
              >
                <SelectTrigger id="category">
                  <SelectValue placeholder="Chọn danh mục" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.categoryId && (
                <p className="text-red-500 text-sm">{errors.categoryId}</p>
              )}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="tags">Thẻ</Label>
              <div className="flex gap-2">
                <Input
                  id="tags"
                  value={tagInput}
                  onChange={(e) => {
                    setTagInput(e.target.value);
                    setErrors((prev) => ({ ...prev, tags: "" }));
                  }}
                  placeholder="Nhập tên thẻ"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddTag();
                    }
                  }}
                />
                <Button type="button" onClick={handleAddTag} disabled={!tagInput.trim()}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              {errors.tags && <p className="text-red-500 text-sm">{errors.tags}</p>}
              <div className="flex flex-wrap gap-2 mt-2">
                {tags.map((tag) => (
                  <Badge
                    key={tag.id}
                    variant={selectedTags.includes(tag.id) ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => {
                      if (selectedTags.includes(tag.id)) {
                        setSelectedTags(selectedTags.filter((id) => id !== tag.id));
                      } else {
                        setSelectedTags([...selectedTags, tag.id]);
                      }
                    }}
                  >
                    {tag.name}
                  </Badge>
                ))}
              </div>
              {selectedTags.length > 0 && (
                <div className="mt-2">
                  <Label>Thẻ đã chọn</Label>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {selectedTags.map((tagId) => {
                      const tag = tags.find((t) => t.id === tagId);
                      return (
                        <Badge
                          key={tagId}
                          variant="secondary"
                          className="flex items-center gap-1"
                        >
                          {tag?.name || tagId}
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
        </div>

        <DialogFooter className="sm:justify-between border-t border-border pt-4">
          <Button
            variant="ghost"
            onClick={() => {
              resetForm();
              onOpenChange(false);
            }}
            className="text-foreground hover:text-foreground hover:bg-destructive/10"
          >
            Hủy
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isUploading}
            className="bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            {isUploading ? "Đang tải lên..." : "Tải lên"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
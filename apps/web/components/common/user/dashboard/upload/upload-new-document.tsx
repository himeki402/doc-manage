"use client";

import type React from "react";
import { useState, useRef, useCallback } from "react";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
    ArrowRight,
    Check,
    FileText,
    Info,
    Loader2,
    Plus,
    Tag,
    Upload,
    X,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useDashboardContext } from "@/contexts/dashboardContext";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { AccessType, Document } from "@/lib/types/document";
import documentApi from "@/lib/apis/documentApi";

interface UploadNewDocumentProps {
    onUploadComplete: (newUpload: Document) => void;
}

export function UploadNewDocument({
    onUploadComplete,
}: UploadNewDocumentProps) {
    const { categories, groups, setRecentUploads, tags } =
        useDashboardContext();
    const router = useRouter();
    const [uploadStep, setUploadStep] = useState(1);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [categoryId, setCategoryId] = useState("");
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const [tagInput, setTagInput] = useState("");
    const [accessType, setAccessType] = useState<AccessType>("PRIVATE");
    const [groupId, setGroupId] = useState<string>("");
    const [errors, setErrors] = useState<{ groupId?: string }>({});
    const [fileError, setFileError] = useState<string | null>(null);
    const [uploadedDocument, setUploadedDocument] = useState<Document | null>(
        null
    );

    const fileInputRef = useRef<HTMLInputElement>(null);

    const validateForm = () => {
        const newErrors: { [key: string]: string } = {};
        if (!selectedFile) newErrors.file = "Vui lòng chọn tệp";
        if (!title.trim()) newErrors.title = "Tiêu đề là bắt buộc";
        if (!description.trim()) newErrors.description = "Mô tả là bắt buộc";
        if (!categoryId) newErrors.category = "Vui lòng chọn danh mục";
        if (accessType === "GROUP" && !groupId)
            newErrors.groupId = "Vui lòng chọn nhóm";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const acceptedFileTypes = ".pdf,.docx";
    const maxSizeInMB = 10;

    // Validate file
    const validateFile = useCallback(
        (file: File): boolean => {
            const fileExtension = file.name.split(".").pop()?.toLowerCase();
            const allowedExtensions = ["pdf", "docx"];

            if (!fileExtension || !allowedExtensions.includes(fileExtension)) {
                setFileError("Chỉ chấp nhận file PDF và DOCX");
                return false;
            }

            if (file.size > maxSizeInMB * 1024 * 1024) {
                setFileError(
                    `Kích thước file không được vượt quá ${maxSizeInMB}MB`
                );
                return false;
            }

            setFileError(null);
            return true;
        },
        [maxSizeInMB]
    );

    // Handle drag and drop
    const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    }, []);

    const handleDragLeave = useCallback(
        (e: React.DragEvent<HTMLDivElement>) => {
            e.preventDefault();
            e.stopPropagation();
            setIsDragging(false);
        },
        []
    );

    const handleDrop = useCallback(
        (e: React.DragEvent<HTMLDivElement>) => {
            e.preventDefault();
            e.stopPropagation();
            setIsDragging(false);

            if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
                const file = e.dataTransfer.files[0];
                if (file && validateFile(file)) {
                    handleFileSelect(file);
                }
            }
        },
        [validateFile]
    );

    const handleFileChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            if (e.target.files && e.target.files.length > 0) {
                const file = e.target.files[0];
                if (file && validateFile(file)) {
                    handleFileSelect(file);
                }
            }
        },
        [validateFile]
    );

    const handleButtonClick = useCallback(() => {
        if (fileInputRef.current) {
            setFileError(null);
            fileInputRef.current.click();
        }
    }, []);

    const handleFileSelect = (file: File) => {
        setSelectedFile(file);
        const fileName = file.name.replace(/\.[^/.]+$/, "");
        setTitle(fileName);
        setUploadStep(2);
    };

    const handleAddTag = () => {
        const trimmedInput = tagInput.trim();
        if (!trimmedInput) return;

        // Tìm thẻ theo tên
        const tag = tags.find(
            (t) => t.name.toLowerCase() === trimmedInput.toLowerCase()
        );
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

    const handleUpload = async () => {
        if (!validateForm()) {
            toast.error("Vui lòng điền đầy đủ thông tin");
            return;
        }
        setIsUploading(true);
        try {
            const formDataToSend = new FormData();

            if (selectedFile) {
                formDataToSend.append("file", selectedFile);
            }
            formDataToSend.append("title", title.trim());
            formDataToSend.append("description", description.trim());
            formDataToSend.append("accessType", accessType);
            formDataToSend.append("categoryId", categoryId);
            if (selectedTags.length > 0) {
                selectedTags.forEach((tagId) => {
                    formDataToSend.append("tagIds[]", tagId);
                });
            }
            if (accessType === "GROUP" && groupId) {
                formDataToSend.append("groupId", groupId);
            }

            const newDocument =
                await documentApi.uploadDocument(formDataToSend);
            if (!newDocument) {
                throw new Error("Không thể tạo tài liệu");
            }
            setUploadedDocument(newDocument);
            toast.success("Tài liệu đã được tải lên thành công");
            setUploadStep(3);
        } catch (error: any) {
            console.error("Error uploading document:", error);
            toast.error(
                error.response?.data?.message || "Không thể tải lên tài liệu"
            );
        } finally {
            setIsUploading(false);
        }
    };

    const resetForm = () => {
        setSelectedFile(null);
        setTitle("");
        setDescription("");
        setCategoryId("");
        setSelectedTags([]);
        setAccessType("PRIVATE");
        setGroupId("");
        setErrors({});
        setUploadStep(1);
        setFileError(null);
    };

    const handleFinish = () => {
        if (uploadedDocument) {
            onUploadComplete(uploadedDocument);
        }
        resetForm();

        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Tải lên tài liệu mới</CardTitle>
                <CardDescription>
                    Tải lên tài liệu học tập của bạn
                </CardDescription>
            </CardHeader>
            <CardContent>
                {/* Step 1: Select file */}
                {uploadStep === 1 && (
                    <div
                        className={cn(
                            "border-2 border-dashed rounded-lg p-8 text-center transition-colors",
                            isDragging
                                ? "border-primary bg-primary/10"
                                : "border-border bg-muted hover:border-muted-foreground cursor-pointer"
                        )}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                        onClick={handleButtonClick}
                        role="button"
                        aria-label="File uploader"
                    >
                        <input
                            ref={fileInputRef}
                            type="file"
                            className="hidden"
                            accept={acceptedFileTypes}
                            onChange={handleFileChange}
                        />

                        <div className="flex flex-col items-center justify-center space-y-4">
                            <div className="p-4 bg-muted rounded-full">
                                {isDragging ? (
                                    <Upload className="h-10 w-10 text-primary" />
                                ) : (
                                    <Upload className="h-10 w-10 text-muted-foreground" />
                                )}
                            </div>
                            <div className="space-y-2">
                                <h3 className="text-lg font-medium">
                                    {isDragging
                                        ? "Thả file để tải lên"
                                        : "Kéo thả file vào đây hoặc nhấp để chọn file"}
                                </h3>
                                <p className="text-sm text-muted-foreground">
                                    Hỗ trợ các định dạng: PDF, DOCX (tối đa{" "}
                                    {maxSizeInMB}MB)
                                </p>
                                {fileError && (
                                    <p className="text-sm text-destructive">
                                        {fileError}
                                    </p>
                                )}
                            </div>
                            <Button type="button">Chọn file</Button>
                        </div>
                    </div>
                )}

                {/* Step 2: Enter details */}
                {uploadStep === 2 && selectedFile && (
                    <div className="space-y-6">
                        <div className="flex items-center gap-4 p-4 bg-muted rounded-lg">
                            <div
                                className={`w-12 h-12 rounded-md flex items-center justify-center ${
                                    selectedFile.name.endsWith(".pdf")
                                        ? "bg-red-100 text-red-700"
                                        : selectedFile.name.endsWith(".docx")
                                          ? "bg-blue-100 text-blue-700"
                                          : "bg-amber-100 text-amber-700"
                                }`}
                            >
                                <FileText size={24} />
                            </div>
                            <div className="flex-1">
                                <p className="font-medium">
                                    {selectedFile.name}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                    {(selectedFile.size / 1024 / 1024).toFixed(
                                        2
                                    )}{" "}
                                    MB • {selectedFile.type || "Không xác định"}
                                </p>
                            </div>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => {
                                    setSelectedFile(null);
                                    setUploadStep(1);
                                }}
                            >
                                <X className="h-4 w-4" />
                            </Button>
                        </div>

                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="title">Tiêu đề</Label>
                                <Input
                                    id="title"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    placeholder="Nhập tiêu đề tài liệu"
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="description">Mô tả</Label>
                                <Textarea
                                    id="description"
                                    value={description}
                                    onChange={(e) =>
                                        setDescription(e.target.value)
                                    }
                                    placeholder="Nhập mô tả về tài liệu"
                                    rows={3}
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="category">Danh mục</Label>
                                    <Select
                                        value={categoryId}
                                        onValueChange={setCategoryId}
                                    >
                                        <SelectTrigger id="category">
                                            <SelectValue placeholder="Chọn danh mục" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {categories.map((category) => (
                                                <SelectItem
                                                    key={category.id}
                                                    value={category.id}
                                                >
                                                    {category.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="tags">Thẻ</Label>
                                    <div className="flex gap-2">
                                        <Input
                                            id="tags"
                                            value={tagInput}
                                            onChange={(e) => {
                                                setTagInput(e.target.value);
                                                setErrors((prev) => ({
                                                    ...prev,
                                                    tags: "",
                                                }));
                                            }}
                                            placeholder="Nhập tên thẻ"
                                            onKeyDown={(e) => {
                                                if (e.key === "Enter") {
                                                    e.preventDefault();
                                                    handleAddTag();
                                                }
                                            }}
                                        />
                                        <Button
                                            type="button"
                                            onClick={handleAddTag}
                                            disabled={!tagInput.trim()}
                                        >
                                            <Plus className="h-4 w-4" />
                                        </Button>
                                    </div>
                                    <div className="flex flex-wrap gap-2 mt-2">
                                        {tags.map((tag) => (
                                            <Badge
                                                key={tag.id}
                                                variant={
                                                    selectedTags.includes(
                                                        tag.id
                                                    )
                                                        ? "default"
                                                        : "outline"
                                                }
                                                className="cursor-pointer"
                                                onClick={() => {
                                                    if (
                                                        selectedTags.includes(
                                                            tag.id
                                                        )
                                                    ) {
                                                        setSelectedTags(
                                                            selectedTags.filter(
                                                                (id) =>
                                                                    id !==
                                                                    tag.id
                                                            )
                                                        );
                                                    } else {
                                                        setSelectedTags([
                                                            ...selectedTags,
                                                            tag.id,
                                                        ]);
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
                                                    const tag = tags.find(
                                                        (t) => t.id === tagId
                                                    );
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
                                                                onClick={() =>
                                                                    handleRemoveTag(
                                                                        tagId
                                                                    )
                                                                }
                                                            >
                                                                <span className="sr-only">
                                                                    Xóa
                                                                </span>
                                                                ×
                                                            </Button>
                                                        </Badge>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label>Quyền truy cập</Label>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                    <div
                                        className={`flex items-center gap-2 p-3 rounded-md border cursor-pointer ${
                                            accessType === "PRIVATE"
                                                ? "border-primary bg-primary/5"
                                                : "border-input"
                                        }`}
                                        onClick={() => setAccessType("PRIVATE")}
                                    >
                                        <div
                                            className={`w-4 h-4 rounded-full flex items-center justify-center ${
                                                accessType === "PRIVATE"
                                                    ? "bg-primary"
                                                    : "border border-input"
                                            }`}
                                        >
                                            {accessType === "PRIVATE" && (
                                                <Check className="h-3 w-3 text-primary-foreground" />
                                            )}
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium">
                                                Riêng tư
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                                Chỉ bạn mới có thể xem
                                            </p>
                                        </div>
                                    </div>
                                    <div
                                        className={`flex items-center gap-2 p-3 rounded-md border cursor-pointer ${
                                            accessType === "GROUP"
                                                ? "border-primary bg-primary/5"
                                                : "border-input"
                                        }`}
                                        onClick={() => setAccessType("GROUP")}
                                    >
                                        <div
                                            className={`w-4 h-4 rounded-full flex items-center justify-center ${
                                                accessType === "GROUP"
                                                    ? "bg-primary"
                                                    : "border border-input"
                                            }`}
                                        >
                                            {accessType === "GROUP" && (
                                                <Check className="h-3 w-3 text-primary-foreground" />
                                            )}
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium">
                                                Nhóm
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                                Chỉ nhóm được chọn
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {accessType === "GROUP" && (
                                <div className="space-y-2">
                                    <Label htmlFor="group">
                                        Nhóm{" "}
                                        <span className="text-red-500">*</span>
                                    </Label>
                                    <Select
                                        value={groupId}
                                        onValueChange={(value) => {
                                            setGroupId(value);
                                            setErrors((prev) => ({
                                                ...prev,
                                                groupId: "",
                                            }));
                                        }}
                                    >
                                        <SelectTrigger id="group">
                                            <SelectValue placeholder="Chọn nhóm" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {groups.map((group) => (
                                                <SelectItem
                                                    key={group.id}
                                                    value={group.id}
                                                >
                                                    {group.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.groupId && (
                                        <p className="text-red-500 text-sm">
                                            {errors.groupId}
                                        </p>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Step 3: Preview and complete */}
                {uploadStep === 3 && selectedFile && (
                    <div className="space-y-6">
                        <div className="flex items-center gap-2 p-3 bg-green-50 text-green-700 rounded-md">
                            <Check className="h-5 w-5" />
                            <p className="font-medium">Tải lên thành công!</p>
                        </div>

                        <div className="border rounded-md p-4 space-y-4">
                            <div className="flex items-center gap-4">
                                <div
                                    className={`w-16 h-16 rounded-md flex items-center justify-center ${
                                        selectedFile.name.endsWith(".pdf")
                                            ? "bg-red-100 text-red-700"
                                            : selectedFile.name.endsWith(
                                                    ".docx"
                                                )
                                              ? "bg-blue-100 text-blue-700"
                                              : "bg-amber-100 text-amber-700"
                                    }`}
                                >
                                    <FileText size={32} />
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-lg font-medium">
                                        {title}
                                    </h3>
                                    <p className="text-sm text-muted-foreground">
                                        {(
                                            selectedFile.size /
                                            1024 /
                                            1024
                                        ).toFixed(2)}{" "}
                                        MB •{" "}
                                        {selectedFile.type || "Không xác định"}
                                    </p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
                                <div>
                                    <h4 className="text-sm font-medium mb-2">
                                        Thông tin tài liệu
                                    </h4>
                                    <dl className="space-y-2">
                                        <div className="flex justify-between">
                                            <dt className="text-sm text-muted-foreground">
                                                Danh mục:
                                            </dt>
                                            <dd className="text-sm font-medium">
                                                {categories.find(
                                                    (c) => c.id === categoryId
                                                )?.name || "Chưa phân loại"}
                                            </dd>
                                        </div>
                                        <div className="flex justify-between">
                                            <dt className="text-sm text-muted-foreground">
                                                Quyền truy cập:
                                            </dt>
                                            <dd className="text-sm font-medium">
                                                {accessType === "PRIVATE"
                                                    ? "Riêng tư"
                                                    : accessType === "PUBLIC"
                                                      ? "Công khai"
                                                      : "Nhóm"}
                                            </dd>
                                        </div>
                                        <div className="flex justify-between">
                                            <dt className="text-sm text-muted-foreground">
                                                Ngày tải lên:
                                            </dt>
                                            <dd className="text-sm font-medium">
                                                {new Date().toLocaleDateString(
                                                    "vi-VN"
                                                )}
                                            </dd>
                                        </div>
                                    </dl>
                                </div>

                                <div>
                                    <h4 className="text-sm font-medium mb-2">
                                        Mô tả
                                    </h4>
                                    <p className="text-sm text-muted-foreground">
                                        {description || "Không có mô tả"}
                                    </p>

                                    {uploadedDocument && (
                                        <div className="mt-2">
                                            <h4 className="text-sm font-medium mb-1">
                                                Tags
                                            </h4>
                                            <div className="flex flex-wrap gap-1">
                                                {getTagNames(
                                                    uploadedDocument.tags
                                                ).length > 0 ? (
                                                    getTagNames(
                                                        uploadedDocument.tags
                                                    ).map((tagName, index) => (
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
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-2 p-3 bg-blue-50 text-blue-700 rounded-md">
                            <Info className="h-5 w-5" />
                            <p className="text-sm">
                                Tài liệu của bạn đã được tải lên thành công. Bạn
                                có thể xem và quản lý tài liệu trong phần "Tài
                                liệu".
                            </p>
                        </div>
                    </div>
                )}
            </CardContent>
            <CardFooter className="flex justify-between">
                {uploadStep > 1 && uploadStep < 3 && (
                    <Button
                        variant="outline"
                        onClick={() => setUploadStep((prev) => prev - 1)}
                    >
                        Quay lại
                    </Button>
                )}
                {uploadStep === 1 && <div></div>}
                {uploadStep === 3 ? (
                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            onClick={() => router.push("/dashboard")}
                        >
                            Xem tất cả tài liệu
                        </Button>
                        <Button onClick={handleFinish}>Hoàn tất</Button>
                    </div>
                ) : uploadStep === 2 ? (
                    <Button
                        onClick={handleUpload}
                        disabled={!title || isUploading}
                    >
                        {isUploading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />{" "}
                                Đang tải lên ...
                            </>
                        ) : (
                            <>
                                Tải lên <ArrowRight className="ml-2 h-4 w-4" />
                            </>
                        )}
                    </Button>
                ) : null}
            </CardFooter>
        </Card>
    );
}

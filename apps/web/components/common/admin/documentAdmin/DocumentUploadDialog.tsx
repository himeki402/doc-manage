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
import { Plus } from "lucide-react";
import { FileUploader } from "./DocumentUploader";
import Image from "next/image";
import { useAdminContext } from "@/contexts/adminContext";
import { AccessType } from "@/lib/types/document";
import { Label } from "@radix-ui/react-label";
import { Badge } from "@/components/ui/badge";

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
}

export function UploadDocumentDialog({
    open,
    onOpenChange,
    onSubmit,
}: UploadDocumentDialogProps) {
    const { categories, tags } = useAdminContext();

    const [file, setFile] = useState<File | null>(null);
    const [filePreview, setFilePreview] = useState<string | null>(null);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [accessType, setAccessType] = useState<AccessType>("PRIVATE");
    const [categoryId, setCategoryId] = useState("");
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const [isUploading, setIsUploading] = useState(false);
    const [tagInput, setTagInput] = useState("");

    const handleFileChange = useCallback((file: File | null) => {
        if (file) {
            setFile(file);

            const fileName = file.name.replace(/\.[^/.]+$/, ""); // Remove extension
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
        }
    }, []);

    const handleAddTag = () => {
        if (tagInput && !selectedTags.includes(tagInput)) {
            setSelectedTags([...selectedTags, tagInput]);
            setTagInput("");
        }
    };

    const handleRemoveTag = (tagToRemove: string) => {
        setSelectedTags(selectedTags.filter((tag) => tag !== tagToRemove));
    };

    const handleSubmit = async () => {
        if (!file || !title || !description) return;

        setIsUploading(true);

        try {
            // Prepare form data
            const formData: UploadDocumentFormData = {
                file,
                title,
                description,
                accessType,
                categoryId,
                selectedTags,
            };

            // Call the onSubmit callback with the form data
            if (onSubmit) {
                await onSubmit(formData);
            }

            // Reset form
            resetForm();
            onOpenChange(false);
        } catch (error) {
            console.error("Error uploading document:", error);
        } finally {
            setIsUploading(false);
        }
    };

    const resetForm = () => {
        setFile(null);
        setFilePreview(null);
        setTitle("");
        setCategoryId("");
        setSelectedTags([]);
        setDescription("");
        setAccessType("PRIVATE");
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[800px] border-border">
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold">
                        Tải lên tài liệu mới
                    </DialogTitle>
                </DialogHeader>

                <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-6 py-4">
                    {/* File upload/preview area */}
                    <div className="flex flex-col items-center">
                        {!file ? (
                            <FileUploader onFileSelected={handleFileChange} />
                        ) : (
                            <div className="relative w-full aspect-[3/4] border border-border rounded-md overflow-hidden bg-card">
                                <div className="absolute top-0 left-0 text-xs font-medium py-1 px-2 z-10 bg-primary/10 text-primary">
                                    {file.type === "application/pdf"
                                        ? "PDF"
                                        : file.type
                                              .split("/")[1]
                                              ?.toUpperCase() || "UNKNOWN"}
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
                                    onClick={() => {
                                        setFile(null);
                                        setFilePreview(null);
                                    }}
                                >
                                    Thay đổi
                                </Button>
                            </div>
                        )}
                    </div>

                    {/* Form area */}
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label
                                htmlFor="title"
                                className="text-sm font-medium"
                            >
                                Title{" "}
                                <span className="text-muted-foreground">
                                    (Required)
                                </span>
                            </label>
                            <Input
                                id="title"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="Enter document title"
                                className="bg-background border-input focus:border-ring"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <label
                                htmlFor="description"
                                className="text-sm font-medium"
                            >
                                Description{" "}
                                <span className="text-muted-foreground">
                                    (Required)
                                </span>
                            </label>
                            <Textarea
                                id="description"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Enter a description..."
                                className="min-h-[100px] bg-background border-input focus:border-ring"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="access-type">Access Type</Label>
                            <Select
                                value={accessType}
                                onValueChange={(value) =>
                                    setAccessType(value as AccessType)
                                }
                            >
                                <SelectTrigger id="access-type">
                                    <SelectValue placeholder="Select access type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="PRIVATE">
                                        Private
                                    </SelectItem>
                                    <SelectItem value="PUBLIC">
                                        Public
                                    </SelectItem>
                                    <SelectItem value="GROUP">Group</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="category">Category</Label>
                            <Select
                                value={categoryId}
                                onValueChange={setCategoryId}
                            >
                                <SelectTrigger id="category">
                                    <SelectValue placeholder="Select category" />
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
                            <Label htmlFor="tags">Tags</Label>
                            <div className="flex gap-2">
                                <Input
                                    id="tags"
                                    value={tagInput}
                                    onChange={(e) =>
                                        setTagInput(e.target.value)
                                    }
                                    placeholder="Add tags"
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter") {
                                            e.preventDefault();
                                            handleAddTag();
                                        }
                                    }}
                                />
                                <Button type="button" onClick={handleAddTag}>
                                    <Plus className="h-4 w-4" />
                                </Button>
                            </div>
                            <div className="flex flex-wrap gap-2 mt-2">
                                {tags.map((tag) => (
                                    <Badge
                                        key={tag.id}
                                        variant={
                                            selectedTags.includes(tag.id)
                                                ? "default"
                                                : "outline"
                                        }
                                        className="cursor-pointer"
                                        onClick={() => {
                                            if (selectedTags.includes(tag.id)) {
                                                setSelectedTags(
                                                    selectedTags.filter(
                                                        (id) => id !== tag.id
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
                                    <Label>Selected Tags</Label>
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
                                                            Remove
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
                        disabled={
                            !file || !title || !description || isUploading
                        }
                        className="bg-primary hover:bg-primary/90 text-primary-foreground"
                    >
                        {isUploading ? "Uploading..." : "Upload"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

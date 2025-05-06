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
import { Checkbox } from "@/components/ui/checkbox";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Info, ChevronUp, ChevronDown } from "lucide-react";
import { FileUploader } from "./DocumentUploader";
import Image from "next/image";

interface UploadDocumentDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSubmit?: (data: UploadDocumentFormData) => void;
}

export interface UploadDocumentFormData {
    file: File | null;
    title: string;
    description: string;
    isPrivate: boolean;
    allowCopyPaste: boolean;
    allowDownload: boolean;
    copyright: string;
}

export function UploadDocumentDialog({
    open,
    onOpenChange,
    onSubmit,
}: UploadDocumentDialogProps) {
    const [file, setFile] = useState<File | null>(null);
    const [filePreview, setFilePreview] = useState<string | null>(null);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [isPrivate, setIsPrivate] = useState(false);
    const [showAdvanced, setShowAdvanced] = useState(true);
    const [allowCopyPaste, setAllowCopyPaste] = useState(true);
    const [allowDownload, setAllowDownload] = useState(true);
    const [copyright, setCopyright] = useState("All Rights Reserved");
    const [isUploading, setIsUploading] = useState(false);

    const handleFileChange = useCallback((file: File | null) => {
        if (file) {
            setFile(file);

            // Auto-fill title from filename
            const fileName = file.name.replace(/\.[^/.]+$/, ""); // Remove extension
            setTitle(fileName);

            // Create preview for PDF
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

    const handleSubmit = async () => {
        if (!file || !title || !description) return;

        setIsUploading(true);

        try {
            // Prepare form data
            const formData: UploadDocumentFormData = {
                file,
                title,
                description,
                isPrivate,
                allowCopyPaste,
                allowDownload,
                copyright,
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
        setDescription("");
        setIsPrivate(false);
        setShowAdvanced(true);
        setAllowCopyPaste(true);
        setAllowDownload(true);
        setCopyright("All Rights Reserved");
    };

    const toggleAdvanced = () => {
        setShowAdvanced(!showAdvanced);
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

                        <div className="flex items-center space-x-2">
                            <Checkbox
                                id="private"
                                checked={isPrivate}
                                onCheckedChange={(checked) =>
                                    setIsPrivate(checked as boolean)
                                }
                            />
                            <label
                                htmlFor="private"
                                className="text-sm font-medium cursor-pointer flex items-center"
                            >
                                Chuyển tài liệu thành dạng riêng tư
                                <Info className="ml-1 h-4 w-4 text-muted-foreground" />
                            </label>
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

"use client";

import type React from "react";
import { useState, useRef, useCallback } from "react";
import { FileText, Upload } from "lucide-react";
import { cn } from "@/lib/utils";

interface FileUploaderProps {
  onFileSelected: (file: File | null) => void;
  acceptedFileTypes?: string;
  maxSize?: number; 
  disabled?: boolean; 
}

export function FileUploader({
  onFileSelected,
  acceptedFileTypes = "application/pdf",
  maxSize = 10, 
  disabled = false,
}: FileUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const getFileTypeLabel = () => {
    const types = acceptedFileTypes.split(",").map((type) => {
      if (type.includes("pdf")) return "PDF";
      if (type.includes("image")) return "Images";
      return type.split("/")[1]?.toUpperCase() || type;
    });
    return types.join(", ");
  };

  const handleDragOver = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      if (disabled) return;
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(true);
    },
    [disabled],
  );

  const handleDragLeave = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      if (disabled) return;
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);
    },
    [disabled],
  );

  const validateFile = useCallback(
    (file: File): boolean => {
      // Check file type
      if (!file.type.match(acceptedFileTypes.replace(/\*/g, ".*"))) {
        setError(`Chỉ chấp nhận file ${getFileTypeLabel()}`);
        return false;
      }

      if (file.size > maxSize * 1024 * 1024) {
        setError(`Kích thước file không được vượt quá ${maxSize}MB`);
        return false;
      }

      setError(null);
      return true;
    },
    [acceptedFileTypes, maxSize],
  );

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      if (disabled) return;
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);

      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        const file = e.dataTransfer.files[0];
        if (file && validateFile(file)) {
          onFileSelected(file);
        }
      }
    },
    [onFileSelected, validateFile, disabled],
  );

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (disabled) return;
      if (e.target.files && e.target.files.length > 0) {
        const file = e.target.files[0];
        if (file && validateFile(file)) {
          onFileSelected(file);
        }
      }
    },
    [onFileSelected, validateFile, disabled],
  );

  const handleButtonClick = useCallback(() => {
    if (disabled || !fileInputRef.current) return;
    setError(null);
    fileInputRef.current.click();
  }, [disabled]);

  return (
    <div
      className={cn(
        "w-full aspect-[3/4] border-2 border-dashed rounded-md flex flex-col items-center justify-center p-4 transition-colors",
        disabled
          ? "opacity-50 cursor-not-allowed"
          : isDragging
            ? "border-primary bg-primary/10"
            : "border-border bg-muted hover:border-muted-foreground cursor-pointer",
      )}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={handleButtonClick}
      role="button"
      aria-disabled={disabled}
      aria-label="File uploader"
    >
      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        accept={acceptedFileTypes}
        onChange={handleFileChange}
        disabled={disabled}
      />

      <div className="flex flex-col items-center text-center">
        <div className="mb-3 p-3 rounded-full bg-background">
          {isDragging && !disabled ? (
            <Upload className="h-6 w-6 text-primary" />
          ) : (
            <FileText className="h-6 w-6 text-muted-foreground" />
          )}
        </div>
        <p className="text-sm font-medium mb-1 text-foreground">
          {isDragging && !disabled ? "Thả file để tải lên" : "Kéo & thả file vào đây"}
        </p>
        <p className="text-xs text-muted-foreground mb-2">hoặc click để chọn file</p>
        <p className="text-xs text-muted-foreground/70">
          Chấp nhận file {getFileTypeLabel()} (tối đa {maxSize}MB)
        </p>

        {error && <p className="mt-2 text-xs text-destructive">{error}</p>}
      </div>
    </div>
  );
}
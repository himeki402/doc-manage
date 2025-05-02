"use client"

import type React from "react"

import { useState, useRef, useCallback } from "react"
import { FileText, Upload } from "lucide-react"
import { cn } from "@/lib/utils"

interface FileUploaderProps {
  onFileSelected: (file: File | null) => void
  acceptedFileTypes?: string
  maxSize?: number // in MB
}

export function FileUploader({
  onFileSelected,
  acceptedFileTypes = "application/pdf",
  maxSize = 10, // 10MB default
}: FileUploaderProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }, [])

  const validateFile = useCallback(
    (file: File): boolean => {
      // Check file type
      if (!file.type.match(acceptedFileTypes)) {
        setError(`Chỉ chấp nhận file ${acceptedFileTypes.split(",").join(", ")}`)
        return false
      }

      // Check file size
      if (file.size > maxSize * 1024 * 1024) {
        setError(`Kích thước file không được vượt quá ${maxSize}MB`)
        return false
      }

      setError(null)
      return true
    },
    [acceptedFileTypes, maxSize],
  )

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault()
      e.stopPropagation()
      setIsDragging(false)

      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        const file = e.dataTransfer.files[0]
        if (file && validateFile(file)) {
          onFileSelected(file)
        }
      }
    },
    [onFileSelected, validateFile],
  )

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files.length > 0) {
        const file = e.target.files[0]
        if (file && validateFile(file)) {
          onFileSelected(file)
        }
      }
    },
    [onFileSelected, validateFile],
  )

  const handleButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  return (
    <div
      className={cn(
        "w-full aspect-[3/4] border-2 border-dashed rounded-md flex flex-col items-center justify-center p-4 transition-colors",
        isDragging ? "border-blue-500 bg-blue-500/10" : "border-gray-700 bg-[#1a1a1a] hover:border-gray-500",
      )}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={handleButtonClick}
    >
      <input ref={fileInputRef} type="file" className="hidden" accept={acceptedFileTypes} onChange={handleFileChange} />

      <div className="flex flex-col items-center text-center">
        <div className="mb-3 p-3 rounded-full bg-gray-800">
          {isDragging ? <Upload className="h-6 w-6 text-blue-400" /> : <FileText className="h-6 w-6 text-gray-400" />}
        </div>
        <p className="text-sm font-medium mb-1">{isDragging ? "Thả file để tải lên" : "Kéo & thả file vào đây"}</p>
        <p className="text-xs text-gray-400 mb-2">hoặc click để chọn file</p>
        <p className="text-xs text-gray-500">Chấp nhận file PDF (tối đa {maxSize}MB)</p>

        {error && <p className="mt-2 text-xs text-red-500">{error}</p>}
      </div>
    </div>
  )
}

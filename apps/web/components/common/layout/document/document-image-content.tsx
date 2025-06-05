"use client";

import { Button } from "@/components/ui/button";
import { OCR_ENDPOINT } from "@/lib/constants";
import { Document } from "@/lib/types/document";
import {
    Loader2,
    Copy,
    Download,
    ZoomIn,
    ZoomOut,
    RotateCw,
} from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { toast } from "sonner";

interface DocumentImageContentProps {
    document: Document;
}

export function DocumentImageContent({ document }: DocumentImageContentProps) {
    const [isOcrLoading, setIsOcrLoading] = useState(false);
    const [ocrContent, setOcrContent] = useState<string | null>(null);
    const [imageScale, setImageScale] = useState(1);
    const [imageRotation, setImageRotation] = useState(0);

    const performOCR = async () => {
        if (!document.fileUrl) {
            toast.error("Không tìm thấy URL hình ảnh để thực hiện OCR");
            return;
        }

        setIsOcrLoading(true);
        try {
            const response = await fetch(`${OCR_ENDPOINT}/ocr`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    image_url: document.fileUrl,
                }),
            });

            if (response.ok) {
                const data = await response.json();
                setOcrContent(
                    data.response_message || "Không có nội dung được trích xuất"
                );
                toast.success("OCR thành công! Nội dung đã được trích xuất.");
            } else {
                toast.error(
                    `Lỗi OCR: ${response.status} ${response.statusText}`
                );
            }
        } catch (error) {
            toast.error(
                `Lỗi OCR: ${error instanceof Error ? error.message : "Đã xảy ra lỗi không xác định"}`
            );
        } finally {
            setIsOcrLoading(false);
        }
    };

    const copyToClipboard = async () => {
        if (ocrContent) {
            try {
                await navigator.clipboard.writeText(ocrContent);
                toast.success("Đã sao chép nội dung vào clipboard!");
            } catch (error) {
                toast.error("Không thể sao chép nội dung");
            }
        }
    };

    const zoomIn = () => setImageScale((prev) => Math.min(prev + 0.25, 3));
    const zoomOut = () => setImageScale((prev) => Math.max(prev - 0.25, 0.5));
    const rotateImage = () => setImageRotation((prev) => (prev + 90) % 360);

    return (
        <div className="h-full flex flex-col">
            {/* Header với controls */}
            <div className="flex items-center justify-between p-4 border-b bg-white sticky top-0 z-10">
                <h2 className="text-lg font-semibold truncate flex-1 mr-4">
                    {document.title}
                </h2>
                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={zoomOut}
                        disabled={imageScale <= 0.5}
                    >
                        <ZoomOut className="h-4 w-4" />
                    </Button>
                    <span className="text-sm px-2">
                        {Math.round(imageScale * 100)}%
                    </span>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={zoomIn}
                        disabled={imageScale >= 3}
                    >
                        <ZoomIn className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm" onClick={rotateImage}>
                        <RotateCw className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            {/* Main content area - sử dụng grid layout */}
            <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-6 p-6 overflow-hidden">
                {/* Image panel */}
                <div className="flex flex-col">
                    <h3 className="text-lg font-semibold mb-4">Hình ảnh</h3>
                    <div className="flex-1 border rounded-lg overflow-hidden bg-gray-50 relative">
                        <div className="w-full h-full overflow-auto">
                            <div
                                className="flex items-center justify-center min-h-full p-4"
                                style={{
                                    transform: `scale(${imageScale}) rotate(${imageRotation}deg)`,
                                    transition: "transform 0.2s ease-in-out",
                                }}
                            >
                                <Image
                                    src={
                                        document.fileUrl ||
                                        "/default-thumbnail.png"
                                    }
                                    alt={document.title}
                                    width={800}
                                    height={600}
                                    className="max-w-full h-auto shadow-lg"
                                    priority
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* OCR Results panel */}
                <div className="flex flex-col">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold">Nội dung OCR</h3>
                        <div className="flex gap-2">
                            <Button
                                onClick={performOCR}
                                disabled={isOcrLoading}
                                size="sm"
                            >
                                {isOcrLoading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Đang xử lý...
                                    </>
                                ) : (
                                    "Thực hiện OCR"
                                )}
                            </Button>
                            {ocrContent && (
                                <>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={copyToClipboard}
                                    >
                                        <Copy className="h-4 w-4 mr-1" />
                                        Sao chép
                                    </Button>
                                </>
                            )}
                        </div>
                    </div>

                    <div className="flex-1 border rounded-lg overflow-hidden">
                        {ocrContent ? (
                            <div className="h-full overflow-auto p-4 bg-white">
                                <pre className="text-sm text-gray-700 whitespace-pre-wrap font-sans leading-relaxed">
                                    {ocrContent}
                                </pre>
                            </div>
                        ) : (
                            <div className="h-full flex items-center justify-center bg-gray-50 text-gray-500">
                                <div className="text-center">
                                    <p className="text-sm">
                                        Chưa có nội dung OCR
                                    </p>
                                    <p className="text-xs mt-1">
                                        Nhấn "Thực hiện OCR" để trích xuất văn
                                        bản từ hình ảnh
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

"use client";

import { Document } from "@/lib/types/document";
import { DocumentContent } from "./document-content";
import { DocumentMetadata } from "./document-metadata";
import { DocumentRelated } from "./related-document";
import documentApi from "@/lib/apis/documentApi";
import { useState } from "react";
import { toast } from "sonner";

interface DocumentViewerProps {
    document: Document;
}

export function DocumentViewer({
    document: initialDocument,
}: DocumentViewerProps) {
    const [document, setDocument] = useState<Document>(initialDocument);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const handleRating = async (rating: "like" | "dislike") => {
        try {
            setIsLoading(true);
            if (rating === "like") {
                await documentApi.likeDocument(document.id);
                setDocument((prev) => ({
                    ...prev,
                    likeCount: prev.likeCount + 1,
                }));
            } else {
                await documentApi.dislikeDocument(document.id);
                setDocument((prev) => ({
                    ...prev,
                    dislikeCount: prev.dislikeCount + 1,
                }));
            }
            toast.success("Cập nhật đánh giá tài liệu thành công!");
        } catch (error: any) {
            toast.error("Lỗi khi cập nhật đánh giá tài liệu: ");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col min-h-screen bg-background">
            <div className="flex-grow container mx-auto px-4">
                <div className="grid grid-cols-12 gap-6 h-full">
                    <div className="col-span-3">
                        <DocumentMetadata
                            document={document}
                            onRating={(rating) => handleRating(rating)}
                            isLoading={isLoading}
                        />
                    </div>
                    <div className="col-span-7 h-full">
                        <DocumentContent document={document} />
                    </div>
                    <div className="col-span-2 h-full">
                        <DocumentRelated documentCatId={document.categoryId} />
                    </div>
                </div>
            </div>
        </div>
    );
}

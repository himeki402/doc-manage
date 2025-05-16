"use client";

import { Document } from "@/lib/types/document";
import { DocumentContent } from "./document-content";
import { DocumentMetadata } from "./document-metadata";
import { DocumentRelated } from "./related-document";

interface DocumentViewerProps {
    document: Document;
}

export function DocumentViewer({ document }: DocumentViewerProps) {
    return (
        <div className="flex flex-col min-h-screen bg-background">
            <div className="flex-grow container mx-auto px-4">
                <div className="grid grid-cols-12 gap-6 h-full">
                    <div className="col-span-3">
                        <DocumentMetadata document={document} />
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

"use client";

import type React from "react";
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UploadNewDocument } from "./upload-new-document";
import { RecentUploads } from "./upload-recently";
import { useDashboardContext } from "@/contexts/dashboardContext";
import { Document } from "@/lib/types/document";

export function UploadDocumentTab() {
    const [activeTab, setActiveTab] = useState("upload");
    const { recentUploads, setRecentUploads } = useDashboardContext();

    const addRecentUpload = (newUpload: Document) => {
        setRecentUploads([newUpload, ...recentUploads]);
    };

    return (
        <div className="space-y-4">
            {/* Header */}
            <div>
                <h2 className="text-2xl font-bold mb-2">Tải lên tài liệu</h2>
                <p className="text-muted-foreground">
                    Tải lên và quản lý tài liệu học tập của bạn
                </p>
            </div>

            {/* Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList>
                    <TabsTrigger value="upload">Tải lên mới</TabsTrigger>
                    <TabsTrigger value="recent">Tải lên gần đây</TabsTrigger>
                </TabsList>

                <TabsContent value="upload" className="space-y-4">
                    <UploadNewDocument
                        onUploadComplete={(newUpload) => {
                            addRecentUpload(newUpload);
                            setActiveTab("recent");
                        }}
                    />
                </TabsContent>

                <TabsContent value="recent" className="space-y-4">
                    <RecentUploads
                        recentUploads={recentUploads}
                        onUploadNew={() => setActiveTab("upload")}
                    />
                </TabsContent>
            </Tabs>
        </div>
    );
}
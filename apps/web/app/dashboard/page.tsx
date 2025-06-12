"use client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/authContext";
import {
    DocumentStatsResponseDto,
    GetDocumentsResponse,
} from "@/lib/types/document";
import documentApi, { DocumentQueryParams } from "@/lib/apis/documentApi";
import DocumentsTab from "@/components/common/user/dashboard/document/document-tab";
import WelcomeSection from "@/components/common/user/dashboard/welcome-section";
import OverviewCards from "@/components/common/user/dashboard/overview-card";
import OcrDocumentTab from "@/components/common/user/dashboard/ocr/ocr-document-tab";
import { GroupDocumentTab } from "@/components/common/user/dashboard/group/group-docment";
import { UploadDocumentTab } from "@/components/common/user/dashboard/upload/upload-document-tab";
import { AnalyticsTab } from "@/components/common/user/dashboard/document/analytics";

export default function Dashboard() {
    const { isAuthenticated, isLoading, user } = useAuth();
    const router = useRouter();
    const [documentsStats, setDocumentsStats] =
        useState<DocumentStatsResponseDto | null>(null);

    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            router.push("/login");
        }
        if (isAuthenticated && !isLoading) {
            fetchDocumentsStats();
        }
    }, [isAuthenticated, isLoading, router]);

    if (isLoading || !isAuthenticated) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                Loading...
            </div>
        );
    }

    const fetchDocumentsStats = async () => {
        try {
            const data = await documentApi.getUserDocumentStats();
            setDocumentsStats(data);
        } catch (err: any) {
            console.error("Error fetching documents stats:", err);
        }
    };

    return (
        <div className="flex flex-col min-h-screen bg-slate-100 max-w-screen-2xl mx-auto">
            <div className="flex-1 p-4 md:p-6 space-y-6">
                <WelcomeSection name={user?.name || ""} />
                <OverviewCards documentsStats={documentsStats} />

                {/* Main Dashboard Content */}
                <Tabs defaultValue="documents" className="space-y-4">
                    <TabsList>
                        <TabsTrigger value="documents">Tài liệu</TabsTrigger>

                        <TabsTrigger value="group">Nhóm</TabsTrigger>
                        <TabsTrigger value="OCR">
                            Tải lên tài liệu ảnh
                        </TabsTrigger>
                        <TabsTrigger value="upload">
                            Tải lên tài liệu văn bản
                        </TabsTrigger>
                        <TabsTrigger value="analytics" disabled>
                            Thống kê
                        </TabsTrigger>
                    </TabsList>
                    <TabsContent value="documents" className="space-y-4">
                        <DocumentsTab />
                    </TabsContent>

                    <TabsContent value="analytics" className="space-y-4">
                        <AnalyticsTab />
                    </TabsContent>

                    <TabsContent value="OCR" className="space-y-4">
                        <OcrDocumentTab />
                    </TabsContent>

                    <TabsContent value="group" className="space-y-4">
                        <GroupDocumentTab />
                    </TabsContent>
                    <TabsContent value="upload" className="space-y-4">
                        <UploadDocumentTab />
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}

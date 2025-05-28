"use client";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    BookText,
    CalendarDays,
    FileEdit,
    FileText,
    GraduationCap,
    History,
    Plus,
    Share2,
    Users,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/authContext";
import { GetDocumentsResponse } from "@/lib/types/document";
import documentApi, { DocumentQueryParams } from "@/lib/apis/documentApi";
import DocumentsTab from "@/components/common/user/dashboard/document/document-tab";
import WelcomeSection from "@/components/common/user/dashboard/welcome-section";
import OverviewCards from "@/components/common/user/dashboard/overview-card";
import OcrDocumentTab from "@/components/common/user/dashboard/ocr/ocr-document-tab";
import { GroupDocumentTab } from "@/components/common/user/dashboard/group/group-docment";

export default function Dashboard() {
    const { isAuthenticated, isLoading, user } = useAuth();
    const router = useRouter();
    const [documentsResponse, setDocumentsResponse] =
        useState<GetDocumentsResponse | null>(null);
    const [loadingDocuments, setLoadingDocuments] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            router.push("/login");
        }
        if (isAuthenticated && !isLoading) {
            fetchMyDocuments();
        }
    }, [isAuthenticated, isLoading, router]);

    if (isLoading || !isAuthenticated) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                Loading...
            </div>
        );
    }
    const fetchMyDocuments = async (
        params: DocumentQueryParams = { limit: 5 }
    ) => {
        try {
            setLoadingDocuments(true);
            setError(null);
            const data = await documentApi.getMyDocuments(params);
            setDocumentsResponse(data);
        } catch (err: any) {
            setError(err.message || "Failed to fetch documents");
            console.error("Error fetching documents:", err);
        } finally {
            setLoadingDocuments(false);
        }
    };
    return (
        <div className="flex flex-col min-h-screen bg-slate-100 max-w-screen-2xl mx-auto">
            <div className="flex-1 p-4 md:p-6 space-y-6">
                <WelcomeSection name={user?.name || ""} />
                <OverviewCards documentsResponse={documentsResponse} />

                {/* Main Dashboard Content */}
                <Tabs defaultValue="documents" className="space-y-4">
                    <TabsList>
                        <TabsTrigger value="documents">Tài liệu</TabsTrigger>
                        <TabsTrigger value="analytics">Thống kê</TabsTrigger>
                        <TabsTrigger value="group">Nhóm</TabsTrigger>
                        <TabsTrigger value="OCR">OCR</TabsTrigger>
                    </TabsList>
                    <TabsContent value="documents" className="space-y-4">
                        <DocumentsTab
                            documentsResponse={documentsResponse}
                            loading={loadingDocuments}
                            error={error}
                            onFetchDocuments={fetchMyDocuments}
                        />
                    </TabsContent>

                    <TabsContent value="analytics" className="space-y-4">
                        <Card>
                            <CardHeader>
                                <CardTitle>Thống kê học tập</CardTitle>
                                <CardDescription>
                                    Phân tích và thống kê về tài liệu học tập
                                    của bạn
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="border rounded-lg p-4">
                                    <h3 className="text-sm font-medium mb-4">
                                        Thống kê tài liệu theo môn học
                                    </h3>
                                    <div className="space-y-4">
                                        {[
                                            {
                                                name: "Mạng máy tính",
                                                count: 18,
                                                percent: 15,
                                            },
                                            {
                                                name: "An toàn thông tin",
                                                count: 15,
                                                percent: 12,
                                            },
                                            {
                                                name: "Lập trình Java",
                                                count: 22,
                                                percent: 18,
                                            },
                                            {
                                                name: "Cơ sở dữ liệu",
                                                count: 16,
                                                percent: 13,
                                            },
                                            {
                                                name: "Công nghệ phần mềm",
                                                count: 20,
                                                percent: 16,
                                            },
                                            {
                                                name: "Trí tuệ nhân tạo",
                                                count: 12,
                                                percent: 10,
                                            },
                                        ].map((subject, i) => (
                                            <div key={i} className="space-y-2">
                                                <div className="flex items-center justify-between">
                                                    <span className="text-sm font-medium">
                                                        {subject.name}
                                                    </span>
                                                    <span className="text-sm">
                                                        {subject.count} tài liệu
                                                    </span>
                                                </div>
                                                <div className="w-full bg-slate-100 rounded-full h-2">
                                                    <div
                                                        className="bg-blue-500 h-2 rounded-full"
                                                        style={{
                                                            width: `${subject.percent}%`,
                                                        }}
                                                    ></div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="border rounded-lg p-4">
                                    <h3 className="text-sm font-medium mb-4">
                                        Hoạt động học tập
                                    </h3>
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <CalendarDays className="h-5 w-5 text-muted-foreground" />
                                                <span className="text-sm">
                                                    Tài liệu đã đọc trong tháng
                                                    này
                                                </span>
                                            </div>
                                            <span className="font-medium">
                                                28
                                            </span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <FileEdit className="h-5 w-5 text-muted-foreground" />
                                                <span className="text-sm">
                                                    Bài tập đã hoàn thành
                                                </span>
                                            </div>
                                            <span className="font-medium">
                                                15
                                            </span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <Share2 className="h-5 w-5 text-muted-foreground" />
                                                <span className="text-sm">
                                                    Tài liệu đã chia sẻ với bạn
                                                    bè
                                                </span>
                                            </div>
                                            <span className="font-medium">
                                                12
                                            </span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <Users className="h-5 w-5 text-muted-foreground" />
                                                <span className="text-sm">
                                                    Nhóm học tập đã tham gia
                                                </span>
                                            </div>
                                            <span className="font-medium">
                                                4
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                            <CardFooter className="border-t p-4">
                                <Button variant="outline" className="w-full">
                                    Tạo báo cáo học tập
                                </Button>
                            </CardFooter>
                        </Card>
                    </TabsContent>

                    <TabsContent value="OCR" className="space-y-4">
                        <OcrDocumentTab />
                    </TabsContent>

                    <TabsContent value="group" className="space-y-4">
                        <GroupDocumentTab />
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}

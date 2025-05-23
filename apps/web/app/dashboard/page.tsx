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
import DocumentsTab from "@/components/common/user/dashboard/document-tab";
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
                        <TabsTrigger value="courses">Môn học</TabsTrigger>
                        <TabsTrigger value="references">
                            Tài liệu tham khảo
                        </TabsTrigger>
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

                    <TabsContent value="courses" className="space-y-4">
                        <Card>
                            <CardHeader>
                                <CardTitle>Môn học của tôi</CardTitle>
                                <CardDescription>
                                    Quản lý tài liệu theo môn học
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {[
                                        {
                                            name: "Mạng máy tính",
                                            code: "IT3080",
                                            documents: 18,
                                            progress: 75,
                                            color: "border-blue-500",
                                        },
                                        {
                                            name: "An toàn thông tin",
                                            code: "IT4015",
                                            documents: 15,
                                            progress: 60,
                                            color: "border-green-500",
                                        },
                                        {
                                            name: "Lập trình Java",
                                            code: "IT3100",
                                            documents: 22,
                                            progress: 100,
                                            color: "border-purple-500",
                                        },
                                        {
                                            name: "Cơ sở dữ liệu",
                                            code: "IT3090",
                                            documents: 16,
                                            progress: 85,
                                            color: "border-orange-500",
                                        },
                                        {
                                            name: "Công nghệ phần mềm",
                                            code: "IT4060",
                                            documents: 20,
                                            progress: 100,
                                            color: "border-red-500",
                                        },
                                        {
                                            name: "Trí tuệ nhân tạo",
                                            code: "IT4040",
                                            documents: 12,
                                            progress: 10,
                                            color: "border-indigo-500",
                                        },
                                        {
                                            name: "Phát triển ứng dụng Web",
                                            code: "IT4409",
                                            documents: 14,
                                            progress: 65,
                                            color: "border-emerald-500",
                                        },
                                        {
                                            name: "Điện toán đám mây",
                                            code: "IT4610",
                                            documents: 10,
                                            progress: 40,
                                            color: "border-amber-500",
                                        },
                                        {
                                            name: "Phân tích dữ liệu",
                                            code: "IT4931",
                                            documents: 8,
                                            progress: 30,
                                            color: "border-sky-500",
                                        },
                                    ].map((course, i) => (
                                        <Card
                                            key={i}
                                            className={`border-l-4 ${course.color}`}
                                        >
                                            <CardHeader className="pb-2">
                                                <div className="flex justify-between items-start">
                                                    <div>
                                                        <CardTitle className="text-base">
                                                            {course.name}
                                                        </CardTitle>
                                                        <CardDescription>
                                                            {course.code}
                                                        </CardDescription>
                                                    </div>
                                                    <Badge variant="outline">
                                                        {course.documents} tài
                                                        liệu
                                                    </Badge>
                                                </div>
                                            </CardHeader>
                                            <CardContent className="pb-2">
                                                <div className="space-y-2">
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-xs text-muted-foreground">
                                                            Tiến độ học tập
                                                        </span>
                                                        <span className="text-xs font-medium">
                                                            {course.progress}%
                                                        </span>
                                                    </div>
                                                    <Progress
                                                        value={course.progress}
                                                        className="h-1.5"
                                                    />
                                                </div>
                                            </CardContent>
                                            <CardFooter className="pt-0">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="w-full"
                                                >
                                                    Xem tài liệu
                                                </Button>
                                            </CardFooter>
                                        </Card>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="references" className="space-y-4">
                        <Card>
                            <CardHeader>
                                <CardTitle>Tài liệu tham khảo</CardTitle>
                                <CardDescription>
                                    Sách, giáo trình và tài liệu tham khảo
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-6">
                                    <div className="flex justify-between items-center">
                                        <h3 className="text-lg font-medium">
                                            Giáo trình
                                        </h3>
                                        <Button variant="outline" size="sm">
                                            <Plus className="h-4 w-4 mr-1" />{" "}
                                            Thêm giáo trình
                                        </Button>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {[
                                            {
                                                name: "Computer Networking: A Top-Down Approach",
                                                author: "James F. Kurose, Keith W. Ross",
                                                subject: "Mạng máy tính",
                                                type: "PDF",
                                            },
                                            {
                                                name: "Computer Security: Principles and Practice",
                                                author: "William Stallings, Lawrie Brown",
                                                subject: "An toàn thông tin",
                                                type: "PDF",
                                            },
                                            {
                                                name: "Core Java Volume I - Fundamentals",
                                                author: "Cay S. Horstmann",
                                                subject: "Lập trình Java",
                                                type: "PDF",
                                            },
                                        ].map((book, i) => (
                                            <Card key={i}>
                                                <CardContent className="p-4">
                                                    <div className="flex items-start gap-3">
                                                        <div className="bg-red-100 text-red-700 p-2 rounded-md">
                                                            <BookText
                                                                size={20}
                                                            />
                                                        </div>
                                                        <div>
                                                            <p className="font-medium text-sm">
                                                                {book.name}
                                                            </p>
                                                            <p className="text-xs text-muted-foreground mt-1">
                                                                {book.author}
                                                            </p>
                                                            <div className="flex items-center gap-2 mt-2">
                                                                <Badge
                                                                    variant="outline"
                                                                    className="bg-slate-50"
                                                                >
                                                                    {
                                                                        book.subject
                                                                    }
                                                                </Badge>
                                                                <Badge
                                                                    variant="outline"
                                                                    className="bg-red-50 text-red-700 border-red-200"
                                                                >
                                                                    {book.type}
                                                                </Badge>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        ))}
                                    </div>

                                    <div className="flex justify-between items-center mt-8">
                                        <h3 className="text-lg font-medium">
                                            Tài liệu chuyên ngành
                                        </h3>
                                        <Button variant="outline" size="sm">
                                            <Plus className="h-4 w-4 mr-1" />{" "}
                                            Thêm tài liệu
                                        </Button>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {[
                                            {
                                                name: "Tài liệu An toàn mạng không dây",
                                                author: "Nguyễn Văn A",
                                                subject: "An toàn thông tin",
                                                type: "PDF",
                                            },
                                            {
                                                name: "Hướng dẫn Phân tích mã độc",
                                                author: "Trần Văn B",
                                                subject: "An toàn thông tin",
                                                type: "PDF",
                                            },
                                            {
                                                name: "Tài liệu Điện toán đám mây và bảo mật",
                                                author: "Lê Thị C",
                                                subject: "Điện toán đám mây",
                                                type: "PDF",
                                            },
                                            {
                                                name: "Phát triển ứng dụng Web an toàn",
                                                author: "Phạm Văn D",
                                                subject: "Phát triển Web",
                                                type: "PDF",
                                            },
                                            {
                                                name: "Bảo mật cơ sở dữ liệu",
                                                author: "Hoàng Thị E",
                                                subject: "Cơ sở dữ liệu",
                                                type: "PDF",
                                            },
                                        ].map((doc, i) => (
                                            <Card key={i}>
                                                <CardContent className="p-4">
                                                    <div className="flex items-start gap-3">
                                                        <div className="bg-red-100 text-red-700 p-2 rounded-md">
                                                            <FileText
                                                                size={20}
                                                            />
                                                        </div>
                                                        <div>
                                                            <p className="font-medium text-sm">
                                                                {doc.name}
                                                            </p>
                                                            <p className="text-xs text-muted-foreground mt-1">
                                                                {doc.author}
                                                            </p>
                                                            <div className="flex items-center gap-2 mt-2">
                                                                <Badge
                                                                    variant="outline"
                                                                    className="bg-slate-50"
                                                                >
                                                                    {
                                                                        doc.subject
                                                                    }
                                                                </Badge>
                                                                <Badge
                                                                    variant="outline"
                                                                    className="bg-red-50 text-red-700 border-red-200"
                                                                >
                                                                    {doc.type}
                                                                </Badge>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        ))}
                                    </div>
                                </div>
                            </CardContent>
                            <CardFooter className="border-t p-4 flex justify-between">
                                <div className="text-sm text-muted-foreground">
                                    Hiển thị 9 trong số 24 tài liệu tham khảo
                                </div>
                                <Button variant="outline" size="sm">
                                    Xem thêm
                                </Button>
                            </CardFooter>
                        </Card>
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

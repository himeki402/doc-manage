import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { CalendarDays, FileEdit, Share2, Users } from "lucide-react";

export function AnalyticsTab() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Thống kê học tập</CardTitle>
                <CardDescription>
                    Phân tích và thống kê về tài liệu học tập của bạn
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
                                    Tài liệu đã đọc trong tháng này
                                </span>
                            </div>
                            <span className="font-medium">28</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <FileEdit className="h-5 w-5 text-muted-foreground" />
                                <span className="text-sm">
                                    Bài tập đã hoàn thành
                                </span>
                            </div>
                            <span className="font-medium">15</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <Share2 className="h-5 w-5 text-muted-foreground" />
                                <span className="text-sm">
                                    Tài liệu đã chia sẻ với bạn bè
                                </span>
                            </div>
                            <span className="font-medium">12</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <Users className="h-5 w-5 text-muted-foreground" />
                                <span className="text-sm">
                                    Nhóm học tập đã tham gia
                                </span>
                            </div>
                            <span className="font-medium">4</span>
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
    );
}

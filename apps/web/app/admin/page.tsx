"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, Users, ArrowUpRight, Clock, Pen } from "lucide-react";
import { Button } from "@/components/ui/button";
import PendingDocuments from "@/components/common/admin/overview/pending-document";
import StatsCards from "@/components/common/admin/overview/stats-cards";
import { useAdminContext } from "@/contexts/adminContext";
import NewUserTable from "@/components/common/admin/overview/new-user";

export default function AdminDashboard() {
  const { userStats, documentStats } = useAdminContext();
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">
                    Tổng quan quản trị
                </h1>
                <div className="flex items-center gap-2">
                    <Button>Xuất báo cáo</Button>
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <StatsCards
                    title="Tổng người dùng"
                    value={userStats?.totalUsers}
                    growthPercentage={userStats?.growthPercentage}
                    icon={<Users className="h-4 w-4 text-muted-foreground" />}
                />
                <StatsCards
                    title="Tổng tài liệu"
                    value={documentStats?.totalDocuments}
                    growthPercentage={documentStats?.growthPercentage}
                    icon={<FileText className="h-4 w-4 text-muted-foreground" />}
                />
            </div>

            <Tabs defaultValue="overview" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="overview">Tổng quan</TabsTrigger>
                    {/* <TabsTrigger value="analytics">Phân tích</TabsTrigger>
                    <TabsTrigger value="reports">Báo cáo</TabsTrigger> */}
                </TabsList>
                <TabsContent value="overview" className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
                        <PendingDocuments />
                        <NewUserTable />
                    </div>
                </TabsContent>
                {/* <TabsContent value="analytics" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Phân tích chi tiết</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground">
                                Dữ liệu phân tích chi tiết sẽ được hiển thị ở
                                đây.
                            </p>
                        </CardContent>
                    </Card>
                </TabsContent>
                <TabsContent value="reports" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Báo cáo hệ thống</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground">
                                Các báo cáo hệ thống sẽ được hiển thị ở đây.
                            </p>
                        </CardContent>
                    </Card>
                </TabsContent> */}
            </Tabs>
        </div>
    );
}

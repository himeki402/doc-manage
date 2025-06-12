// app/admin/analytics/page.tsx
"use client";
import { DashboardHeader } from "@/components/common/admin/admin-dashboard-header";
import { useAdminContext } from "@/contexts/adminContext";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatsOverviewCards } from "@/components/common/admin/analytics/stats-overview-cards";
import { DocumentTrendChart } from "@/components/common/admin/analytics/document-trend-chart";
import { MonthlyComparisonChart } from "@/components/common/admin/analytics/monthly-comparison-chart";
import AnalyticsLoadingSkeleton from "./loading";

export default function AnalyticsPage() {
    const { documentStats } = useAdminContext();

    // Kiểm tra dữ liệu có tồn tại và có đúng structure không
    if (!documentStats || typeof documentStats !== "object") {
        return (
            <div className="space-y-6">
                <DashboardHeader
                    title="Phân tích"
                    description="Phân tích dữ liệu hệ thống."
                    actionLabel="Xuất báo cáo"
                />
                <AnalyticsLoadingSkeleton />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <DashboardHeader
                title="Phân tích"
                description="Phân tích dữ liệu hệ thống."
                actionLabel="Xuất báo cáo"
            />

            {/* Overview Cards */}
            <StatsOverviewCards stats={documentStats} />

            {/* Charts Grid */}
            <div className="grid gap-6 md:grid-cols-2">
                <DocumentTrendChart data={documentStats.documentsByDay || []} />
                <MonthlyComparisonChart
                    currentMonth={documentStats.newDocumentsThisMonth || 0}
                    lastMonth={documentStats.newDocumentsLastMonth || 0}
                    growthPercentage={documentStats.growthPercentage || 0}
                />
            </div>

            {/* Additional Analytics Section */}
            <div className="grid gap-6">
                <AnalyticsSummaryCard stats={documentStats} />
            </div>
        </div>
    );
}

// Summary card component
function AnalyticsSummaryCard({ stats }: { stats: any }) {
    const {
        totalDocuments = 0,
        newDocumentsThisMonth = 0,
        newDocumentsLastMonth = 0,
        recentDocuments = 0,
        documentsByDay = [],
    } = stats || {};

    // Tính toán các chỉ số bổ sung với safe check
    const averagePerDay =
        documentsByDay.length > 0
            ? Math.round(
                  documentsByDay.reduce(
                      (sum: number, item: any) => sum + (item?.count || 0),
                      0
                  ) / documentsByDay.length
              )
            : 0;

    const peakDay =
        documentsByDay.length > 0
            ? documentsByDay.reduce(
                  (max: any, item: any) =>
                      (item?.count || 0) > (max?.count || 0) ? item : max,
                  null
              )
            : null;

    return (
        <Card>
            <CardHeader>
                <CardTitle>Tóm tắt thống kê</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid gap-4 md:grid-cols-3">
                    <div className="space-y-2">
                        <h4 className="text-sm font-medium text-muted-foreground">
                            Hoạt động tổng quan
                        </h4>
                        <div className="space-y-1">
                            <p className="text-sm">
                                <span className="text-primary font-medium">
                                    {totalDocuments}
                                </span>{" "}
                                tổng số tài liệu
                            </p>
                            <p className="text-sm">
                                <span className="text-primary font-medium">
                                    {averagePerDay}
                                </span>{" "}
                                tài liệu/ngày (TB)
                            </p>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <h4 className="text-sm font-medium text-muted-foreground">
                            Xu hướng gần đây
                        </h4>
                        <div className="space-y-1">
                            <p className="text-sm">
                                <span className="text-primary font-medium">
                                    {recentDocuments}
                                </span>{" "}
                                tài liệu trong 7 ngày
                            </p>
                            <p className="text-sm">
                                <span className="text-primary font-medium">
                                    {Math.round((recentDocuments / 7) * 10) /
                                        10}
                                </span>{" "}
                                tài liệu/ngày (7 ngày qua)
                            </p>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <h4 className="text-sm font-medium text-muted-foreground">
                            Ngày cao điểm
                        </h4>
                        <div className="space-y-1">
                            {peakDay ? (
                                <>
                                    <p className="text-sm">
                                        <span className="text-primary font-medium">
                                            {peakDay.count.toLocaleString()}
                                        </span>{" "}
                                        tài liệu
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                        {new Date(
                                            peakDay.date
                                        ).toLocaleDateString("vi-VN")}
                                    </p>
                                </>
                            ) : (
                                <p className="text-sm text-muted-foreground">
                                    Không có dữ liệu
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

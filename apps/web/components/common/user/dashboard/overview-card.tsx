"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DocumentStatsResponseDto, GetDocumentsResponse } from "@/lib/types/document";
import { FileText, GraduationCap, Share2, History } from "lucide-react"


interface OverviewCardsProps {
    documentsResponse: GetDocumentsResponse | null;
    documentsStats: DocumentStatsResponseDto | null;
}

export default function OverviewCards({ documentsResponse, documentsStats } : OverviewCardsProps) {
  const overviewData = [
    {
      title: "Tổng tài liệu",
      value: documentsResponse?.meta.total || 0,
      description: `${documentsStats?.data.newDocumentsThisMonth || 0} tài liệu mới trong tháng này`,
      icon: FileText,
    },
    {
      title: "Tài liệu được chia sẻ",
      value: documentsStats?.data.sharedDocuments || 0,
      description: `${documentsStats?.data.newSharedDocumentsThisWeek || 0} chia sẻ mới trong tuần này`,
      icon: Share2,
    },
    {
      title: "Tài liệu gần đây",
      value: documentsStats?.data.recentDocuments || 0,
      description: "Cập nhật trong 7 ngày qua",
      icon: History,
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {overviewData.map((item, index) => (
        <Card key={index}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{item.title}</CardTitle>
            <item.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{item.value}</div>
            <p className="text-xs text-muted-foreground">{item.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
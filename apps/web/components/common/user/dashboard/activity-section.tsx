"use client"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FileCheck, Upload, Share2, FileEdit, Clock } from "lucide-react"

export default function ActivitySection() {
  const activities = [
    {
      action: "đã đọc",
      document: "Giáo trình Mạng máy tính.pdf",
      time: "2 giờ trước",
      icon: FileCheck,
      color: "bg-blue-100 text-blue-700",
    },
    {
      action: "đã tải lên",
      document: "Bài giảng An toàn thông tin.pdf",
      time: "Hôm qua",
      icon: Upload,
      color: "bg-green-100 text-green-700",
    },
    {
      action: "đã chia sẻ",
      document: "Bài tập Lập trình Java.docx",
      time: "3 ngày trước",
      icon: Share2,
      color: "bg-purple-100 text-purple-700",
    },
    {
      action: "đã chỉnh sửa",
      document: "Báo cáo đồ án Công nghệ phần mềm.docx",
      time: "1 tuần trước",
      icon: FileEdit,
      color: "bg-amber-100 text-amber-700",
    },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Hoạt động gần đây</CardTitle>
        <CardDescription>Các hoạt động trên tài liệu học tập của bạn</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {activities.map((activity, i) => (
          <div key={i} className="flex items-start gap-3">
            <div className={`p-2 rounded-md ${activity.color}`}>
              <activity.icon size={16} />
            </div>
            <div>
              <p className="text-sm">
                <span className="font-medium">Bạn</span>
                <span className="text-muted-foreground"> {activity.action} </span>
                <span className="font-medium">{activity.document}</span>
              </p>
              <p className="text-xs text-muted-foreground flex items-center">
                <Clock className="mr-1 h-3 w-3" /> {activity.time}
              </p>
            </div>
          </div>
        ))}
      </CardContent>
      <CardFooter className="border-t p-4">
        <Button variant="ghost" className="w-full" size="sm">
          Xem tất cả hoạt động
        </Button>
      </CardFooter>
    </Card>
  )
}
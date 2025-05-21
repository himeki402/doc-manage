"use client"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FileText, FileEdit, Star } from "lucide-react"

export default function ImportantDocuments() {
  const documents = [
    {
      name: "Giáo trình Mạng máy tính.pdf",
      type: "PDF",
      subject: "Mạng máy tính",
      color: "bg-red-100 text-red-700",
    },
    {
      name: "Bài giảng An toàn thông tin.pdf",
      type: "PDF",
      subject: "An toàn thông tin",
      color: "bg-red-100 text-red-700",
    },
    {
      name: "Bài tập Lập trình Java.docx",
      type: "Word",
      subject: "Lập trình Java",
      color: "bg-blue-100 text-blue-700",
    },
    {
      name: "Tài liệu Cơ sở dữ liệu.pdf",
      type: "PDF",
      subject: "Cơ sở dữ liệu",
      color: "bg-red-100 text-red-700",
    },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Tài liệu quan trọng</CardTitle>
        <CardDescription>Các tài liệu được đánh dấu sao</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {documents.map((doc, i) => (
          <div key={i} className="flex items-start gap-3">
            <div className={`p-2 rounded-md ${doc.color}`}>
              {doc.type === "PDF" ? <FileText size={16} /> : <FileEdit size={16} />}
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium">{doc.name}</p>
              <div className="flex items-center justify-between">
                <p className="text-xs text-muted-foreground">
                  {doc.type} • {doc.subject}
                </p>
                <Button variant="ghost" size="icon" className="h-6 w-6">
                  <Star size={14} className="fill-amber-400 text-amber-400" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
      <CardFooter className="border-t p-4">
        <Button variant="ghost" className="w-full" size="sm">
          Xem tất cả tài liệu quan trọng
        </Button>
      </CardFooter>
    </Card>
  )
}
"use client"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { BookText, BookOpen, FileText, FolderIcon, ShieldCheck, Plus } from "lucide-react"

export default function CategoriesSidebar() {
  const categories = [
    { name: "Giáo trình", count: 28, icon: BookText, color: "text-blue-500" },
    { name: "Bài giảng", count: 42, icon: BookOpen, color: "text-purple-500" },
    { name: "Bài tập", count: 35, icon: FileText, color: "text-green-500" },
    { name: "Đồ án", count: 12, icon: FolderIcon, color: "text-orange-500" },
    { name: "Tài liệu tham khảo", count: 24, icon: BookOpen, color: "text-red-500" },
    { name: "Công nghệ", count: 18, icon: FileText, color: "text-indigo-500" },
    { name: "An toàn thông tin", count: 15, icon: ShieldCheck, color: "text-emerald-500" },
  ]

  return (
    <Card className="lg:col-span-2">
      <CardHeader>
        <CardTitle>Danh mục</CardTitle>
        <CardDescription>Phân loại tài liệu học tập</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {categories.map((category, i) => (
          <div key={i} className="flex items-center justify-between p-2 rounded-md hover:bg-slate-50">
            <div className="flex items-center gap-3">
              <category.icon className={`h-5 w-5 ${category.color}`} />
              <span className="text-sm font-medium">{category.name}</span>
            </div>
            <Badge variant="outline" className="text-xs">
              {category.count}
            </Badge>
          </div>
        ))}
      </CardContent>
      <CardFooter className="border-t p-4">
        <Button variant="ghost" className="w-full" size="sm">
          <Plus className="h-4 w-4 mr-1" /> Thêm danh mục mới
        </Button>
      </CardFooter>
    </Card>
  )
}
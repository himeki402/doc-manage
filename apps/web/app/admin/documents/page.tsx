import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { FileText, MoreHorizontal, Plus, Search } from "lucide-react"

export default function DocumentsPage() {
  const documents = [
    {
      id: "1",
      title: "Giáo trình Toán cao cấp",
      category: "Toán học",
      author: "Nguyễn Văn A",
      status: "approved",
      uploadDate: "12/04/2023",
      downloads: 245,
    },
    {
      id: "2",
      title: "Tài liệu Lập trình Java",
      category: "Công nghệ thông tin",
      author: "Trần Thị B",
      status: "pending",
      uploadDate: "15/04/2023",
      downloads: 0,
    },
    {
      id: "3",
      title: "Bài giảng Kinh tế vĩ mô",
      category: "Kinh tế",
      author: "Lê Văn C",
      status: "approved",
      uploadDate: "10/04/2023",
      downloads: 178,
    },
    {
      id: "4",
      title: "Tài liệu An toàn thông tin",
      category: "Công nghệ thông tin",
      author: "Phạm Thị D",
      status: "rejected",
      uploadDate: "08/04/2023",
      downloads: 0,
    },
    {
      id: "5",
      title: "Giáo trình Vật lý đại cương",
      category: "Vật lý",
      author: "Hoàng Văn E",
      status: "approved",
      uploadDate: "05/04/2023",
      downloads: 312,
    },
    {
      id: "6",
      title: "Tài liệu Tiếng Anh chuyên ngành",
      category: "Ngoại ngữ",
      author: "Đỗ Thị F",
      status: "pending",
      uploadDate: "18/04/2023",
      downloads: 0,
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Quản lý tài liệu</h1>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Thêm tài liệu
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Tài liệu</CardTitle>
          <CardDescription>Quản lý tất cả tài liệu trong hệ thống.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-1 items-center gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                <Input type="search" placeholder="Tìm kiếm tài liệu..." className="w-full pl-9" />
              </div>
              <Select defaultValue="all">
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Danh mục" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả danh mục</SelectItem>
                  <SelectItem value="math">Toán học</SelectItem>
                  <SelectItem value="it">Công nghệ thông tin</SelectItem>
                  <SelectItem value="economics">Kinh tế</SelectItem>
                  <SelectItem value="physics">Vật lý</SelectItem>
                  <SelectItem value="language">Ngoại ngữ</SelectItem>
                </SelectContent>
              </Select>
              <Select defaultValue="all">
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Trạng thái" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả trạng thái</SelectItem>
                  <SelectItem value="approved">Đã duyệt</SelectItem>
                  <SelectItem value="pending">Chờ duyệt</SelectItem>
                  <SelectItem value="rejected">Từ chối</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tiêu đề</TableHead>
                  <TableHead>Danh mục</TableHead>
                  <TableHead>Tác giả</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead>Ngày tải lên</TableHead>
                  <TableHead>Lượt tải</TableHead>
                  <TableHead className="w-[80px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {documents.map((doc) => (
                  <TableRow key={doc.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center">
                        <FileText className="mr-2 h-4 w-4 text-muted-foreground" />
                        {doc.title}
                      </div>
                    </TableCell>
                    <TableCell>{doc.category}</TableCell>
                    <TableCell>{doc.author}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          doc.status === "approved" ? "default" : doc.status === "pending" ? "outline" : "secondary"
                        }
                      >
                        {doc.status === "approved" ? "Đã duyệt" : doc.status === "pending" ? "Chờ duyệt" : "Từ chối"}
                      </Badge>
                    </TableCell>
                    <TableCell>{doc.uploadDate}</TableCell>
                    <TableCell>{doc.downloads}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Mở menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Hành động</DropdownMenuLabel>
                          <DropdownMenuItem>Xem chi tiết</DropdownMenuItem>
                          <DropdownMenuItem>Tải xuống</DropdownMenuItem>
                          {doc.status === "pending" && (
                            <>
                              <DropdownMenuItem>Phê duyệt</DropdownMenuItem>
                              <DropdownMenuItem>Từ chối</DropdownMenuItem>
                            </>
                          )}
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-red-600">Xóa tài liệu</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="mt-4 flex items-center justify-between">
            <div className="text-sm text-muted-foreground">Hiển thị 1-6 của 6 tài liệu</div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" disabled>
                Trước
              </Button>
              <Button variant="outline" size="sm" disabled>
                Tiếp theo
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

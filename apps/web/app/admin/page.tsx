"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  BarChart3,
  BookOpen,
  FileText,
  Users,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  CheckCircle2,
  AlertCircle,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Tổng quan quản trị</h1>
        <div className="flex items-center gap-2">
          <Button>Xuất báo cáo</Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Tổng người dùng</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,248</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-emerald-500 flex items-center">
                <ArrowUpRight className="mr-1 h-4 w-4" />
                +12% so với tháng trước
              </span>
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Tổng tài liệu</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3,642</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-emerald-500 flex items-center">
                <ArrowUpRight className="mr-1 h-4 w-4" />
                +8% so với tháng trước
              </span>
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Tổng quan</TabsTrigger>
          <TabsTrigger value="analytics">Phân tích</TabsTrigger>
          <TabsTrigger value="reports">Báo cáo</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>Tài liệu đang chờ duyệt</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    {
                      title: "Giáo trình Toán cao cấp",
                      author: "Nguyễn Văn A",
                      time: "2 giờ trước",
                    },
                    {
                      title: "Tài liệu Lập trình Java",
                      author: "Trần Thị B",
                      time: "3 giờ trước",
                    },
                    {
                      title: "Bài giảng Kinh tế vĩ mô",
                      author: "Lê Văn C",
                      time: "5 giờ trước",
                    },
                    {
                      title: "Tài liệu An toàn thông tin",
                      author: "Phạm Thị D",
                      time: "8 giờ trước",
                    },
                  ].map((doc, i) => (
                    <div key={i} className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{doc.title}</p>
                        <p className="text-sm text-muted-foreground">{doc.author}</p>
                      </div>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Clock className="mr-1 h-3 w-3" />
                        {doc.time}
                      </div>
                    </div>
                  ))}
                </div>
                <Button variant="outline" className="mt-4 w-full">
                  Xem tất cả
                </Button>
              </CardContent>
            </Card>
            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>Người dùng mới đăng ký</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    {
                      name: "Nguyễn Văn A",
                      email: "nguyenvana@example.com",
                      time: "1 giờ trước",
                    },
                    {
                      name: "Trần Thị B",
                      email: "tranthib@example.com",
                      time: "3 giờ trước",
                    },
                    {
                      name: "Lê Văn C",
                      email: "levanc@example.com",
                      time: "5 giờ trước",
                    },
                    {
                      name: "Phạm Thị D",
                      email: "phamthid@example.com",
                      time: "12 giờ trước",
                    },
                  ].map((user, i) => (
                    <div key={i} className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{user.name}</p>
                        <p className="text-sm text-muted-foreground">{user.email}</p>
                      </div>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Clock className="mr-1 h-3 w-3" />
                        {user.time}
                      </div>
                    </div>
                  ))}
                </div>
                <Button variant="outline" className="mt-4 w-full">
                  Xem tất cả
                </Button>
              </CardContent>
            </Card>
            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>Báo cáo hệ thống</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="mb-1 flex items-center justify-between text-sm">
                      <div className="flex items-center">
                        <CheckCircle2 className="mr-1 h-4 w-4 text-emerald-500" />
                        <span>Hệ thống hoạt động bình thường</span>
                      </div>
                      <span className="text-muted-foreground">100%</span>
                    </div>
                    <Progress value={100} className="h-2" />
                  </div>
                  <div>
                    <div className="mb-1 flex items-center justify-between text-sm">
                      <div className="flex items-center">
                        <CheckCircle2 className="mr-1 h-4 w-4 text-emerald-500" />
                        <span>Lưu trữ dữ liệu</span>
                      </div>
                      <span className="text-muted-foreground">68%</span>
                    </div>
                    <Progress value={68} className="h-2" />
                  </div>
                  <div>
                    <div className="mb-1 flex items-center justify-between text-sm">
                      <div className="flex items-center">
                        <AlertCircle className="mr-1 h-4 w-4 text-amber-500" />
                        <span>Băng thông mạng</span>
                      </div>
                      <span className="text-muted-foreground">82%</span>
                    </div>
                    <Progress value={82} className="h-2" />
                  </div>
                  <div>
                    <div className="mb-1 flex items-center justify-between text-sm">
                      <div className="flex items-center">
                        <CheckCircle2 className="mr-1 h-4 w-4 text-emerald-500" />
                        <span>Tài nguyên CPU</span>
                      </div>
                      <span className="text-muted-foreground">45%</span>
                    </div>
                    <Progress value={45} className="h-2" />
                  </div>
                </div>
                <Button variant="outline" className="mt-4 w-full">
                  Xem chi tiết
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="analytics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Phân tích chi tiết</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Dữ liệu phân tích chi tiết sẽ được hiển thị ở đây.</p>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="reports" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Báo cáo hệ thống</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Các báo cáo hệ thống sẽ được hiển thị ở đây.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

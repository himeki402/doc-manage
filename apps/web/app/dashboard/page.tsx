"use client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  BarChart3,
  BookOpen,
  BookText,
  CalendarDays,
  Clock,
  FileCheck,
  FileEdit,
  FilePlus,
  FileSearch,
  FileText,
  FolderIcon,
  GraduationCap,
  History,
  MoreHorizontal,
  PieChart,
  Plus,
  Share2,
  ShieldCheck,
  Star,
  Tag,
  Upload,
  Users,
} from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/contexts/authContext"

export default function Dashboard() {
  const { isAuthenticated, isLoading, user } = useAuth()
  const router = useRouter()

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login")
    }
  }, [isAuthenticated, isLoading, router])

  // Show loading or nothing while checking authentication
  if (isLoading || !isAuthenticated) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  return (
    <div className="flex flex-col min-h-screen bg-slate-100 max-w-screen-2xl mx-auto">
      <div className="flex-1 p-4 md:p-6 space-y-6">
        {/* Welcome Section */}
        <div className="flex flex-col md:flex-row justify-between gap-4 items-start md:items-center">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Xin chào, {user?.name || "Sinh viên"}</h1>
            <p className="text-muted-foreground">Quản lý tài liệu học tập của bạn</p>
          </div>
          <div className="flex gap-2">
            <Button>
              <FilePlus className="mr-2 h-4 w-4" /> Thêm tài liệu mới
            </Button>
            <Button variant="outline">
              <Upload className="mr-2 h-4 w-4" /> Tải lên
            </Button>
          </div>
        </div>

        {/* Overview Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tổng tài liệu</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">124</div>
              <p className="text-xs text-muted-foreground">+8 tài liệu trong tháng này</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Môn học</CardTitle>
              <GraduationCap className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12</div>
              <p className="text-xs text-muted-foreground">Học kỳ hiện tại</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tài liệu được chia sẻ</CardTitle>
              <Share2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">28</div>
              <p className="text-xs text-muted-foreground">5 chia sẻ mới trong tuần này</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tài liệu gần đây</CardTitle>
              <History className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">15</div>
              <p className="text-xs text-muted-foreground">Cập nhật trong 7 ngày qua</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Dashboard Content */}
        <Tabs defaultValue="documents" className="space-y-4">
          <TabsList>
            <TabsTrigger value="documents">Tài liệu</TabsTrigger>
            <TabsTrigger value="courses">Môn học</TabsTrigger>
            <TabsTrigger value="references">Tài liệu tham khảo</TabsTrigger>
            <TabsTrigger value="analytics">Thống kê</TabsTrigger>
          </TabsList>

          <TabsContent value="documents" className="space-y-4">
            <div className="flex justify-between items-center">
              <div className="flex gap-2">
                <Input placeholder="Tìm kiếm tài liệu..." className="w-64" />
                <Button variant="outline" size="sm">
                  <FileSearch className="h-4 w-4 mr-1" /> Tìm kiếm
                </Button>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Tag className="h-4 w-4 mr-1" /> Phân loại
                </Button>
                <Button variant="outline" size="sm">
                  Mới nhất
                </Button>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
              {/* Document List */}
              <Card className="lg:col-span-5">
                <CardHeader>
                  <CardTitle>Tài liệu của tôi</CardTitle>
                  <CardDescription>Quản lý và truy cập tất cả tài liệu học tập của bạn</CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="space-y-0 divide-y">
                    {[
                      {
                        name: "Giáo trình Mạng máy tính.pdf",
                        type: "PDF",
                        subject: "Mạng máy tính",
                        updated: "2 giờ trước",
                        status: "Đang học",
                      },
                      {
                        name: "Bài giảng An toàn thông tin.pdf",
                        type: "PDF",
                        subject: "An toàn thông tin",
                        updated: "Hôm qua",
                        status: "Đang học",
                      },
                      {
                        name: "Bài tập Lập trình Java.docx",
                        type: "Word",
                        subject: "Lập trình Java",
                        updated: "3 ngày trước",
                        status: "Đã hoàn thành",
                      },
                      {
                        name: "Tài liệu Cơ sở dữ liệu.pdf",
                        type: "PDF",
                        subject: "Cơ sở dữ liệu",
                        updated: "1 tuần trước",
                        status: "Đang học",
                      },
                      {
                        name: "Báo cáo đồ án Công nghệ phần mềm.docx",
                        type: "Word",
                        subject: "Công nghệ phần mềm",
                        updated: "2 tuần trước",
                        status: "Đã hoàn thành",
                      },
                      {
                        name: "Tài liệu tham khảo Trí tuệ nhân tạo.pdf",
                        type: "PDF",
                        subject: "Trí tuệ nhân tạo",
                        updated: "3 tuần trước",
                        status: "Chưa học",
                      },
                    ].map((doc, i) => (
                      <div key={i} className="flex items-center justify-between p-4 hover:bg-slate-50">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-10 h-10 rounded-md flex items-center justify-center ${
                              doc.type === "PDF" ? "bg-red-100 text-red-700" : "bg-blue-100 text-blue-700"
                            }`}
                          >
                            {doc.type === "PDF" ? <FileText size={20} /> : <FileEdit size={20} />}
                          </div>
                          <div>
                            <p className="text-sm font-medium">{doc.name}</p>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <span>{doc.type}</span>
                              <span>•</span>
                              <span>{doc.subject}</span>
                              <span>•</span>
                              <span>Cập nhật {doc.updated}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge
                            variant="outline"
                            className={`${
                              doc.status === "Đã hoàn thành"
                                ? "bg-green-50 text-green-700 border-green-200"
                                : doc.status === "Đang học"
                                  ? "bg-blue-50 text-blue-700 border-blue-200"
                                  : "bg-slate-50 text-slate-700 border-slate-200"
                            }`}
                          >
                            {doc.status}
                          </Badge>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal size={16} />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
                <CardFooter className="border-t p-4 flex justify-between">
                  <div className="text-sm text-muted-foreground">Hiển thị 6 trong số 124 tài liệu</div>
                  <div className="flex gap-1">
                    <Button variant="outline" size="sm">
                      Trước
                    </Button>
                    <Button variant="outline" size="sm">
                      Tiếp
                    </Button>
                  </div>
                </CardFooter>
              </Card>

              {/* Categories */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>Danh mục</CardTitle>
                  <CardDescription>Phân loại tài liệu học tập</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[
                    { name: "Giáo trình", count: 28, icon: BookText, color: "text-blue-500" },
                    { name: "Bài giảng", count: 42, icon: BookOpen, color: "text-purple-500" },
                    { name: "Bài tập", count: 35, icon: FileText, color: "text-green-500" },
                    { name: "Đồ án", count: 12, icon: FolderIcon, color: "text-orange-500" },
                    { name: "Tài liệu tham khảo", count: 24, icon: BookOpen, color: "text-red-500" },
                    { name: "Công nghệ", count: 18, icon: FileText, color: "text-indigo-500" },
                    { name: "An toàn thông tin", count: 15, icon: ShieldCheck, color: "text-emerald-500" },
                  ].map((category, i) => (
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
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {/* Recent Activity */}
              <Card>
                <CardHeader>
                  <CardTitle>Hoạt động gần đây</CardTitle>
                  <CardDescription>Các hoạt động trên tài liệu học tập của bạn</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[
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
                  ].map((activity, i) => (
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

              {/* Study Progress */}
          

              {/* Important Documents */}
              <Card>
                <CardHeader>
                  <CardTitle>Tài liệu quan trọng</CardTitle>
                  <CardDescription>Các tài liệu được đánh dấu sao</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[
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
                  ].map((doc, i) => (
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
            </div>
          </TabsContent>

          <TabsContent value="courses" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Môn học của tôi</CardTitle>
                <CardDescription>Quản lý tài liệu theo môn học</CardDescription>
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
                    <Card key={i} className={`border-l-4 ${course.color}`}>
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="text-base">{course.name}</CardTitle>
                            <CardDescription>{course.code}</CardDescription>
                          </div>
                          <Badge variant="outline">{course.documents} tài liệu</Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="pb-2">
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-muted-foreground">Tiến độ học tập</span>
                            <span className="text-xs font-medium">{course.progress}%</span>
                          </div>
                          <Progress value={course.progress} className="h-1.5" />
                        </div>
                      </CardContent>
                      <CardFooter className="pt-0">
                        <Button variant="ghost" size="sm" className="w-full">
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
                <CardDescription>Sách, giáo trình và tài liệu tham khảo</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-medium">Giáo trình</h3>
                    <Button variant="outline" size="sm">
                      <Plus className="h-4 w-4 mr-1" /> Thêm giáo trình
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
                              <BookText size={20} />
                            </div>
                            <div>
                              <p className="font-medium text-sm">{book.name}</p>
                              <p className="text-xs text-muted-foreground mt-1">{book.author}</p>
                              <div className="flex items-center gap-2 mt-2">
                                <Badge variant="outline" className="bg-slate-50">
                                  {book.subject}
                                </Badge>
                                <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
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
                    <h3 className="text-lg font-medium">Tài liệu chuyên ngành</h3>
                    <Button variant="outline" size="sm">
                      <Plus className="h-4 w-4 mr-1" /> Thêm tài liệu
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
                              <FileText size={20} />
                            </div>
                            <div>
                              <p className="font-medium text-sm">{doc.name}</p>
                              <p className="text-xs text-muted-foreground mt-1">{doc.author}</p>
                              <div className="flex items-center gap-2 mt-2">
                                <Badge variant="outline" className="bg-slate-50">
                                  {doc.subject}
                                </Badge>
                                <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
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
                <div className="text-sm text-muted-foreground">Hiển thị 9 trong số 24 tài liệu tham khảo</div>
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
                <CardDescription>Phân tích và thống kê về tài liệu học tập của bạn</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="border rounded-lg p-4">
                    <h3 className="text-sm font-medium mb-2">Phân loại tài liệu</h3>
                    <div className="h-64 flex items-center justify-center">
                      <div className="text-center">
                        <PieChart className="h-16 w-16 mx-auto text-muted-foreground" />
                        <p className="text-sm text-muted-foreground mt-2">Biểu đồ phân loại tài liệu</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2 mt-4">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-red-500"></div>
                        <span className="text-xs">PDF (65%)</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                        <span className="text-xs">Word (35%)</span>
                      </div>
                    </div>
                  </div>

                  <div className="border rounded-lg p-4">
                    <h3 className="text-sm font-medium mb-2">Hoạt động học tập theo thời gian</h3>
                    <div className="h-64 flex items-center justify-center">
                      <div className="text-center">
                        <BarChart3 className="h-16 w-16 mx-auto text-muted-foreground" />
                        <p className="text-sm text-muted-foreground mt-2">Biểu đồ hoạt động học tập</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border rounded-lg p-4">
                  <h3 className="text-sm font-medium mb-4">Thống kê tài liệu theo môn học</h3>
                  <div className="space-y-4">
                    {[
                      { name: "Mạng máy tính", count: 18, percent: 15 },
                      { name: "An toàn thông tin", count: 15, percent: 12 },
                      { name: "Lập trình Java", count: 22, percent: 18 },
                      { name: "Cơ sở dữ liệu", count: 16, percent: 13 },
                      { name: "Công nghệ phần mềm", count: 20, percent: 16 },
                      { name: "Trí tuệ nhân tạo", count: 12, percent: 10 },
                    ].map((subject, i) => (
                      <div key={i} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">{subject.name}</span>
                          <span className="text-sm">{subject.count} tài liệu</span>
                        </div>
                        <div className="w-full bg-slate-100 rounded-full h-2">
                          <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${subject.percent}%` }}></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="border rounded-lg p-4">
                  <h3 className="text-sm font-medium mb-4">Hoạt động học tập</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <CalendarDays className="h-5 w-5 text-muted-foreground" />
                        <span className="text-sm">Tài liệu đã đọc trong tháng này</span>
                      </div>
                      <span className="font-medium">28</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <FileEdit className="h-5 w-5 text-muted-foreground" />
                        <span className="text-sm">Bài tập đã hoàn thành</span>
                      </div>
                      <span className="font-medium">15</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Share2 className="h-5 w-5 text-muted-foreground" />
                        <span className="text-sm">Tài liệu đã chia sẻ với bạn bè</span>
                      </div>
                      <span className="font-medium">12</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Users className="h-5 w-5 text-muted-foreground" />
                        <span className="text-sm">Nhóm học tập đã tham gia</span>
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
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

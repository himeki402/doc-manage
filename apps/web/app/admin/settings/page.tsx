import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Cài đặt hệ thống</h1>
      </div>

      <Tabs defaultValue="general" className="space-y-4">
        <TabsList>
          <TabsTrigger value="general">Chung</TabsTrigger>
          <TabsTrigger value="appearance">Giao diện</TabsTrigger>
          <TabsTrigger value="notifications">Thông báo</TabsTrigger>
          <TabsTrigger value="security">Bảo mật</TabsTrigger>
        </TabsList>
        <TabsContent value="general" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Thông tin chung</CardTitle>
              <CardDescription>Cài đặt thông tin chung cho hệ thống.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="site-name">Tên trang web</Label>
                <Input id="site-name" defaultValue="Hệ thống quản lý tài liệu học tập" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="site-description">Mô tả trang web</Label>
                <Textarea
                  id="site-description"
                  defaultValue="Nền tảng quản lý và chia sẻ tài liệu học tập dành cho sinh viên và giảng viên."
                  className="min-h-[100px]"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contact-email">Email liên hệ</Label>
                <Input id="contact-email" type="email" defaultValue="admin@example.com" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="timezone">Múi giờ</Label>
                <Select defaultValue="asia_ho_chi_minh">
                  <SelectTrigger id="timezone">
                    <SelectValue placeholder="Chọn múi giờ" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="asia_ho_chi_minh">(GMT+7) Asia/Ho_Chi_Minh</SelectItem>
                    <SelectItem value="asia_bangkok">(GMT+7) Asia/Bangkok</SelectItem>
                    <SelectItem value="asia_singapore">(GMT+8) Asia/Singapore</SelectItem>
                    <SelectItem value="asia_tokyo">(GMT+9) Asia/Tokyo</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
            <CardFooter>
              <Button>Lưu thay đổi</Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Cài đặt tài liệu</CardTitle>
              <CardDescription>Cấu hình các tùy chọn cho tài liệu.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Yêu cầu phê duyệt tài liệu</Label>
                  <p className="text-sm text-muted-foreground">
                    Tài liệu cần được phê duyệt trước khi hiển thị công khai.
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Cho phép tải xuống</Label>
                  <p className="text-sm text-muted-foreground">Cho phép người dùng tải xuống tài liệu.</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Giới hạn kích thước tệp</Label>
                  <p className="text-sm text-muted-foreground">Kích thước tối đa cho mỗi tệp tài liệu (MB).</p>
                </div>
                <Input type="number" defaultValue="10" className="w-20 text-right" />
              </div>
            </CardContent>
            <CardFooter>
              <Button>Lưu thay đổi</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        <TabsContent value="appearance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Giao diện</CardTitle>
              <CardDescription>Tùy chỉnh giao diện của hệ thống.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Chế độ màu</Label>
                <div className="flex items-center gap-4">
                  <div className="flex items-center space-x-2">
                    <input type="radio" id="light" name="theme" value="light" defaultChecked className="h-4 w-4" />
                    <Label htmlFor="light">Sáng</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input type="radio" id="dark" name="theme" value="dark" className="h-4 w-4" />
                    <Label htmlFor="dark">Tối</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input type="radio" id="system" name="theme" value="system" className="h-4 w-4" />
                    <Label htmlFor="system">Theo hệ thống</Label>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="primary-color">Màu chủ đạo</Label>
                <Select defaultValue="blue">
                  <SelectTrigger id="primary-color">
                    <SelectValue placeholder="Chọn màu chủ đạo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="blue">Xanh dương</SelectItem>
                    <SelectItem value="green">Xanh lá</SelectItem>
                    <SelectItem value="purple">Tím</SelectItem>
                    <SelectItem value="red">Đỏ</SelectItem>
                    <SelectItem value="orange">Cam</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Hiệu ứng chuyển động</Label>
                  <p className="text-sm text-muted-foreground">Bật hiệu ứng chuyển động trong giao diện.</p>
                </div>
                <Switch defaultChecked />
              </div>
            </CardContent>
            <CardFooter>
              <Button>Lưu thay đổi</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Thông báo</CardTitle>
              <CardDescription>Cấu hình cài đặt thông báo hệ thống.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Thông báo qua email</Label>
                  <p className="text-sm text-muted-foreground">Gửi thông báo qua email cho người dùng.</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Thông báo tài liệu mới</Label>
                  <p className="text-sm text-muted-foreground">Thông báo khi có tài liệu mới được tải lên.</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Thông báo người dùng mới</Label>
                  <p className="text-sm text-muted-foreground">Thông báo khi có người dùng mới đăng ký.</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Thông báo bình luận</Label>
                  <p className="text-sm text-muted-foreground">Thông báo khi có bình luận mới trên tài liệu.</p>
                </div>
                <Switch />
              </div>
            </CardContent>
            <CardFooter>
              <Button>Lưu thay đổi</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        <TabsContent value="security" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Bảo mật</CardTitle>
              <CardDescription>Cấu hình cài đặt bảo mật cho hệ thống.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Xác thực hai yếu tố</Label>
                  <p className="text-sm text-muted-foreground">Yêu cầu xác thực hai yếu tố cho tài khoản quản trị.</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Tự động đăng xuất</Label>
                  <p className="text-sm text-muted-foreground">
                    Tự động đăng xuất người dùng sau thời gian không hoạt động.
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="space-y-2">
                <Label htmlFor="session-timeout">Thời gian hết hạn phiên (phút)</Label>
                <Input id="session-timeout" type="number" defaultValue="30" className="w-20 text-right" />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Giới hạn đăng nhập thất bại</Label>
                  <p className="text-sm text-muted-foreground">Khóa tài khoản sau nhiều lần đăng nhập thất bại.</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="space-y-2">
                <Label htmlFor="login-attempts">Số lần thử tối đa</Label>
                <Input id="login-attempts" type="number" defaultValue="5" className="w-20 text-right" />
              </div>
            </CardContent>
            <CardFooter>
              <Button>Lưu thay đổi</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

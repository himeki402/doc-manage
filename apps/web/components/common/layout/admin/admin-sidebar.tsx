"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { BarChart3, BookOpen, FileText, Home, LayoutDashboard, Library, Settings, Users } from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
} from "@/components/ui/sidebar"

const sidebarItems = [
  {
    title: "Tổng quan",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    title: "Người dùng",
    href: "/admin/users",
    icon: Users,
  },
  {
    title: "Tài liệu",
    href: "/admin/documents",
    icon: FileText,
  },
  {
    title: "Khóa học",
    href: "/admin/courses",
    icon: BookOpen,
  },
  {
    title: "Tài liệu tham khảo",
    href: "/admin/references",
    icon: Library,
  },
  {
    title: "Phân tích",
    href: "/admin/analytics",
    icon: BarChart3,
  },
  {
    title: "Cài đặt",
    href: "/admin/settings",
    icon: Settings,
  },
]

export function AdminSidebar() {
  const pathname = usePathname()

  return (
    <SidebarProvider defaultOpen>
      <Sidebar className="border-r border-gray-200">
        <SidebarHeader className="border-b border-gray-200 py-4">
          <div className="flex items-center px-4">
            <Link href="/admin" className="flex items-center gap-2">
              <FileText className="h-6 w-6" />
              <span className="text-xl font-bold">Admin Dashboard</span>
            </Link>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            {sidebarItems.map((item) => (
              <SidebarMenuItem key={item.href}>
                <SidebarMenuButton asChild isActive={pathname === item.href} tooltip={item.title}>
                  <Link href={item.href} className="flex items-center">
                    <item.icon className="mr-2 h-5 w-5" />
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter className="border-t border-gray-200 p-4">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip="Trang chủ">
                <Link href="/" className="flex items-center">
                  <Home className="mr-2 h-5 w-5" />
                  <span>Quay lại trang chủ</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>
    </SidebarProvider>
  )
}

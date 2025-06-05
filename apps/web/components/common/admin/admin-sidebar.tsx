"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboardIcon,
    UsersIcon,
    FileTextIcon,
    FolderIcon,
    BarChartIcon,
    SettingsIcon,
    HomeIcon,
    TagIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const sidebarLinks = [
    {
        title: "Tổng quan quản trị",
        href: "/admin",
        icon: LayoutDashboardIcon,
    },
    {
        title: "Tài liệu",
        href: "/admin/documents",
        icon: FileTextIcon,
    },
    {
        title: "Người dùng",
        href: "/admin/users",
        icon: UsersIcon,
    },
    {
        title: "Danh mục",
        href: "/admin/categories",
        icon: FolderIcon,
    },
    {
        title: "Nhóm",
        href: "/admin/groups",
        icon: UsersIcon,
    },
    { title: "Thẻ", href: "/admin/tags", icon: TagIcon },
    {
        title: "Phân tích",
        href: "/admin/analytics",
        icon: BarChartIcon,
    },
    {
        title: "Cài đặt",
        href: "/admin/settings",
        icon: SettingsIcon,
    },
];

export function AdminSidebar() {
    const pathname = usePathname();

    return (
        <div className="group/sidebar relative flex h-full w-[80px] flex-col border-r bg-card transition-all duration-300 ease-in-out hover:w-64 md:w-64">
            <div className="flex h-16 items-center justify-center border-b px-4">
                <span className="inline-flex items-center gap-2 font-semibold">
                    <Link href="/" className="flex items-center gap-2">
                        <div className="bg-red-500 w-8 h-8 rounded-full flex items-center justify-center">
                            <svg
                                width="16"
                                height="16"
                                viewBox="0 0 24 24"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    d="M12 4L4 8L12 12L20 8L12 4Z"
                                    fill="white"
                                />
                                <path
                                    d="M4 12L12 16L20 12"
                                    stroke="white"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                                <path
                                    d="M4 16L12 20L20 16"
                                    stroke="white"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            </svg>
                        </div>
                        <span className="font-bold text-xl text-red-500">
                            KMA Document
                        </span>{" "}
                    </Link>
                </span>
            </div>
            <div className="flex-1 overflow-auto py-4">
                <nav className="grid items-start gap-2 px-2 text-base">
                    {sidebarLinks.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={cn(
                                "group/link flex items-center gap-3 rounded-md px-3 py-2 font-medium transition-all hover:bg-red-100 hover:text-accent-foreground",
                                pathname === link.href ||
                                    (link.href !== "/admin" &&
                                        pathname.startsWith(link.href + "/"))
                                    ? "bg-red-100 text-red-600"
                                    : "hover:text-red-600"
                            )}
                        >
                            <link.icon className="h-5 w-5" />
                            <span className="invisible whitespace-nowrap group-hover/sidebar:visible md:visible">
                                {link.title}
                            </span>
                        </Link>
                    ))}
                </nav>
            </div>
            <div className="flex flex-col gap-4 p-4 border-t">
                <Link
                    href="/"
                    className={cn(
                        "group/link flex items-center gap-3 rounded-md px-3 py-2 font-medium transition-all hover:bg-red-100 hover:text-accent-foreground",
                        pathname === "/"
                            ? "bg-red-500 text-red-600"
                            : "hover:text-red-600"
                    )}
                >
                    <Button
                        variant="ghost"
                        className="w-full justify-start gap-3 px-3"
                    >
                        <HomeIcon className="h-5 w-5" />
                        <span className="invisible whitespace-nowrap group-hover/sidebar:visible md:visible">
                            Quay lại trang chủ
                        </span>
                    </Button>
                </Link>
            </div>
        </div>
    );
}

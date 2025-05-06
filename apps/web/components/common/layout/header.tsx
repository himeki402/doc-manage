"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { ModeToggle } from "@/components/ui/themeToggle";
import { useAuth } from "@/contexts/authContext";
import {
    Bell,
    GlobeIcon,
    LayoutDashboardIcon,
    LogIn,
    LogOutIcon,
    Menu,
    Search,
    ShieldIcon,
    User,
    UserPlus,
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

interface MainHeaderProps {
    showSearch?: boolean;
}

export function Header({ showSearch = true }: MainHeaderProps) {
    const { user, isAuthenticated, logout, isLoading } = useAuth();
    const isAdmin = user?.role === "ADMIN";

    if (isLoading) {
        return (
            <header className="sticky top-0 z-40 w-full border-b bg-background animate-pulse">
                <div className="flex h-16 items-center justify-between px-4 md:px-9 max-w-7xl mx-auto">
                    <div className="flex items-center gap-4">
                        <Skeleton className="md:hidden h-8 w-8 rounded-full" />
                        <div className="hidden md:flex items-center gap-2">
                            <Skeleton className="w-8 h-8 rounded-full" />
                            <Skeleton className="h-6 w-32 rounded-md" />
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        {showSearch && (
                            <div className="relative hidden md:flex items-center">
                                <Skeleton className="h-9 w-64 rounded-full" />
                            </div>
                        )}
                        <ModeToggle />
                        <Skeleton className="h-8 w-8 rounded-full" />
                        <Skeleton className="h-8 w-8 rounded-full" />
                    </div>
                </div>
            </header>
        );
    }

    const handleLogout = async () => {
        try {
            await logout();
            toast.success("Đăng xuất thành công");
        } catch (error) {
            toast.error("Đăng xuất thất bại");
        }
    };
    return (
        <header className="sticky top-0 z-40 w-full border-b bg-background">
            <div className="flex h-16 items-center justify-between px-4 md:px-9 max-w-7xl mx-auto">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" className="md:hidden">
                        <Menu className="h-5 w-5" />
                        <span className="sr-only">Toggle menu</span>
                    </Button>
                    <div className="hidden md:flex items-center gap-2">
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
                            <span className="font-semibold text-lg text-foreground">
                                KMA Document
                            </span>{" "}
                        </Link>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    {showSearch && (
                        <div className="relative hidden md:flex items-center">
                            <Search className="absolute left-2.5 h-4 w-4 text-slate-500" />
                            <Input
                                type="search"
                                placeholder="Tìm kiếm tài liệu..."
                                className="w-64 pl-8 rounded-full bg-slate-100 border-slate-200 focus-visible:ring-blue-500"
                            />
                        </div>
                    )}

                    {isAuthenticated ? (
                        <>
                            <ModeToggle />
                            <Button
                                variant="ghost"
                                size="icon"
                                className="text-slate-500"
                            >
                                <Bell className="h-5 w-5" />
                                <span className="sr-only">Notifications</span>
                            </Button>

                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button
                                        variant="ghost"
                                        className="relative h-8 w-8 rounded-full"
                                    >
                                        <Avatar className="h-8 w-8">
                                            <AvatarImage
                                                src={user?.avatar}
                                                alt={user?.name || "User"}
                                            />
                                            <AvatarFallback>
                                                {user?.name ? (
                                                    user.name
                                                        .charAt(0)
                                                        .toUpperCase()
                                                ) : (
                                                    <User className="h-4 w-4" />
                                                )}
                                            </AvatarFallback>
                                        </Avatar>
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuLabel>
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm font-semibold text-foreground">
                                               {"Xin chào"} {user?.name || "Người dùng"} {"!"}
                                            </span>
                                        </div>
                                    </DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem asChild>
                                        <Link href="/dashboard">
                                            <LayoutDashboardIcon className="h-5 w-5 mr-2" />
                                            <span>
                                                Dashboard{" "}
                                            </span>
                                        </Link>
                                    </DropdownMenuItem>
                                    {isAdmin && (
                                        <DropdownMenuItem asChild>
                                            <Link href="/admin">
                                                <ShieldIcon className="h-5 w-5 mr-2" />
                                                <span>
                                                    Quản trị hệ thống
                                                </span>
                                            </Link>
                                        </DropdownMenuItem>
                                    )}
                                    <DropdownMenuItem asChild>
                                        <Link href="/profile">
                                            <User className="h-5 w-5 mr-2" />
                                            <span>
                                                Hồ sơ{" "}
                                            </span>
                                        </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem asChild>
                                        <Link href="#">
                                            <GlobeIcon className="h-5 w-5 mr-2" />
                                            <span>
                                                Hỗ trợ
                                            </span>
                                        </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem onClick={handleLogout}>
                                        <LogOutIcon className="h-5 w-5 mr-2" />
                                        <span>
                                            Đăng xuất
                                        </span>
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </>
                    ) : (
                        <>
                            <Button
                                variant="ghost"
                                size="sm"
                                className="gap-1"
                                asChild
                            >
                                <Link href="/login">
                                    <LogIn className="h-4 w-4 mr-1" />
                                    Đăng nhập
                                </Link>
                            </Button>
                            <Button
                                variant="default"
                                size="sm"
                                className="gap-1"
                                asChild
                            >
                                <Link href="/register">
                                    <UserPlus className="h-4 w-4 mr-1" />
                                    Đăng ký
                                </Link>
                            </Button>
                        </>
                    )}
                </div>
            </div>
        </header>
    );
}

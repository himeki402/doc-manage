"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    Calendar,
    Mail,
    Phone,
    MapPin,
    FileText,
    Users,
    LogOut,
    Edit,
    Camera,
} from "lucide-react";
import Link from "next/link";
import { formatDateToFullOptions } from "@/lib/utils";
import { useAuth } from "@/contexts/authContext";
import { useState } from "react";
import userApi from "@/lib/apis/userApi";
import { toast } from "sonner";
import AvatarUploadModal from "@/components/common/user/profile/avatar-upload";

export default function ProfilePage() {
    const { user } = useAuth();
    const [showUploadModal, setShowUploadModal] = useState(false);

    const handleUploadAvatar = async (file: File) => {
        try {
            const data = await userApi.uploadAvatar(file);
            toast.success("Ảnh đại diện đã được cập nhật thành công");
        } catch (error) {
            console.error("Error uploading avatar:", error);
        }
    };

    if (!user) {
        return (
            <div className="container mx-auto max-w-4xl px-4 py-8">
                <Card className="border-none shadow-lg">
                    <CardHeader>
                        <CardTitle className="text-2xl font-bold text-red-600">
                            Lỗi
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-gray-600">
                            Không thể lấy thông tin người dùng.
                        </p>
                        <p className="text-gray-500 mt-2">
                            Vui lòng đăng nhập để xem trang này.
                        </p>
                        <Button asChild className="mt-4">
                            <Link href="/login">Đăng nhập</Link>
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    try {
        return (
            <div className="container mx-auto max-w-4xl px-4 py-8">
                <Card className="border-none shadow-lg">
                    <CardHeader className="bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-t-lg">
                        <div className="flex items-center space-x-4 relative">
                            <div className="relative">
                                <Avatar className="h-24 w-24 border-4 border-white">
                                    <AvatarImage
                                        src={user.avatar && user.avatar !== "" ? user.avatar : "/placeholder.svg"}
                                        alt={user.name}
                                    />
                                    <AvatarFallback>
                                        {user.name.charAt(0)}
                                    </AvatarFallback>
                                </Avatar>
                            </div>
                            <button
                                onClick={() => setShowUploadModal(true)}
                                className="absolute bottom-0 right-0 bg-white text-gray-600 rounded-full p-2 shadow-lg hover:bg-gray-50 transition-colors z-10"
                                title="Thay đổi ảnh đại diện"
                            >
                                <Camera className="h-4 w-4" />
                            </button>
                            <div>
                                <CardTitle className="text-2xl font-bold">
                                    {user.name}
                                </CardTitle>
                                <p className="text-sm opacity-80">
                                    {user.email}
                                </p>
                                <Badge
                                    className={`mt-2 ${
                                        user.status === "ACTIVE"
                                            ? "bg-green-500"
                                            : user.status === "LOCKED"
                                              ? "bg-red-500"
                                              : "bg-yellow-500"
                                    }`}
                                >
                                    {user.status.charAt(0).toUpperCase() +
                                        user.status.slice(1)}
                                </Badge>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold text-gray-700">
                                    Thông tin cá nhân
                                </h3>
                                <div className="flex items-center space-x-2">
                                    <Mail className="h-5 w-5 text-gray-500" />
                                    <span>{user.email}</span>
                                </div>
                                {user.phone && (
                                    <div className="flex items-center space-x-2">
                                        <Phone className="h-5 w-5 text-gray-500" />
                                        <span>{user.phone}</span>
                                    </div>
                                )}
                                {user.address && (
                                    <div className="flex items-center space-x-2">
                                        <MapPin className="h-5 w-5 text-gray-500" />
                                        <span>{user.address}</span>
                                    </div>
                                )}
                                {user.bio && (
                                    <div className="mt-4">
                                        <h4 className="text-sm font-medium text-gray-600">
                                            Tiểu sử
                                        </h4>
                                        <p className="text-sm text-gray-500">
                                            {user.bio}
                                        </p>
                                    </div>
                                )}
                            </div>
                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold text-gray-700">
                                    Hoạt động
                                </h3>
                                <div className="flex items-center space-x-2">
                                    <Calendar className="h-5 w-5 text-gray-500" />
                                    <span>
                                        Đăng ký:{" "}
                                        {formatDateToFullOptions(
                                            user.registrationDate
                                        )}
                                    </span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Calendar className="h-5 w-5 text-gray-500" />
                                    <span>
                                        Đăng nhập cuối:{" "}
                                        {user.lastLogin
                                            ? formatDateToFullOptions(
                                                  user.lastLogin
                                              )
                                            : "Chưa đăng nhập"}
                                    </span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <FileText className="h-5 w-5 text-gray-500" />
                                    <span>
                                        Tài liệu đã tải lên:{" "}
                                        {user.documentsUploaded}
                                    </span>
                                </div>
                                {user.groups && user.groups.length > 0 && (
                                    <div className="mt-4">
                                        <h4 className="text-sm font-medium text-gray-600 flex items-center space-x-2">
                                            <Users className="h-5 w-5" />
                                            <span>Nhóm tham gia</span>
                                        </h4>
                                        <div className="flex flex-wrap gap-2 mt-2">
                                            {user.groups.map((group) => (
                                                <Badge
                                                    key={group.id}
                                                    variant="secondary"
                                                >
                                                    {group.name}
                                                </Badge>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="mt-6 flex justify-end space-x-2">
                            <Button variant="outline" asChild>
                                <Link href="/profile/edit">
                                    <Edit className="h-4 w-4 mr-2" /> Chỉnh sửa
                                    hồ sơ
                                </Link>
                            </Button>
                            <Button variant="destructive">
                                <LogOut className="h-4 w-4 mr-2" /> Đăng xuất
                            </Button>
                        </div>
                    </CardContent>
                </Card>
                <AvatarUploadModal
                    isOpen={showUploadModal}
                    onClose={() => setShowUploadModal(false)}
                    onUpload={handleUploadAvatar}
                />
            </div>
        );
    } catch (error) {
        console.error("Lỗi khi lấy thông tin người dùng:", error);
        return (
            <div className="container mx-auto max-w-4xl px-4 py-8">
                <Card className="border-none shadow-lg">
                    <CardHeader>
                        <CardTitle className="text-2xl font-bold text-red-600">
                            Lỗi
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-gray-600">
                            Không thể lấy thông tin người dùng.
                        </p>
                        <p className="text-gray-500 mt-2">
                            Vui lòng đăng nhập để xem trang này.
                        </p>
                        <Button asChild className="mt-4">
                            <Link href="/login">Đăng nhập</Link>
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }
}

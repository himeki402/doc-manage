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
    RefreshCw,
    CheckCircle2,
} from "lucide-react";
import Link from "next/link";
import { formatDateToFullOptions } from "@/lib/utils";
import { useAuth } from "@/contexts/authContext";
import { useState } from "react";
import userApi from "@/lib/apis/userApi";
import { toast } from "sonner";
import AvatarUploadModal from "@/components/common/user/profile/avatar-upload";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
    const { user, logout, isLoading, error, clearError } = useAuth();
    const [showUploadModal, setShowUploadModal] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const [isVerifyingEmail, setIsVerifyingEmail] = useState(false);
    const router = useRouter();

    const handleUploadAvatar = async (file: File) => {
        if (!user) return;
        
        setIsUploading(true);
        clearError();
        
        try {
            const response = await userApi.uploadAvatar(file);
            
            toast.success("Ảnh đại diện đã được cập nhật thành công");
            setShowUploadModal(false);
        } catch (error) {
            console.error("Error uploading avatar:", error);
            toast.error("Có lỗi xảy ra khi cập nhật ảnh đại diện");
        } finally {
            setIsUploading(false);
        }
    };

    const handleLogout = async () => {
        setIsLoggingOut(true);
        clearError();
        
        try {
            await logout();
            toast.success("Đăng xuất thành công");
            router.push("/login");
        } catch (error) {
            console.error("Logout error:", error);
            toast.error("Có lỗi xảy ra khi đăng xuất");
        } finally {
            setIsLoggingOut(false);
        }
    };

    const handleVerifyEmail = async () => {
        if (!user) return;
        
        setIsVerifyingEmail(true);
        clearError();
        
        try {
            await userApi.verifyEmail(user.email);
            toast.success("Yêu cầu xác thực email đã được gửi");
        } catch (error) {
            console.error("Email verification error:", error);
            toast.error("Có lỗi xảy ra khi gửi yêu cầu xác thực email");
        } finally {
            setIsVerifyingEmail(false);
        }
    };

    // Loading state
    if (isLoading) {
        return (
            <div className="container mx-auto max-w-4xl px-4 py-8">
                <Card className="border-none shadow-lg">
                    <CardContent className="p-8">
                        <div className="flex items-center justify-center space-x-2">
                            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                            <span className="text-gray-600">Đang tải thông tin...</span>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="container mx-auto max-w-4xl px-4 py-8">
                <Card className="border-none shadow-lg">
                    <CardHeader>
                        <CardTitle className="text-2xl font-bold text-red-600">
                            {error ? "Lỗi" : "Chưa đăng nhập"}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-gray-600">
                            {error || "Không thể lấy thông tin người dùng."}
                        </p>
                        <p className="text-gray-500 mt-2">
                            Vui lòng đăng nhập để xem trang này.
                        </p>
                        <div className="flex space-x-2 mt-4">
                            <Button asChild>
                                <Link href="/login">Đăng nhập</Link>
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="container mx-auto max-w-4xl px-4 py-8">
            <Card className="border-none shadow-lg">
                <CardHeader className="bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-t-lg">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4 relative">
                            <div className="relative">
                                <Avatar className="h-24 w-24 border-4 border-white">
                                    <AvatarImage
                                        src={user.avatar && user.avatar !== "" ? user.avatar : "/placeholder.svg"}
                                        alt={user.name}
                                    />
                                    <AvatarFallback className="text-xl font-semibold">
                                        {user.name.charAt(0).toUpperCase()}
                                    </AvatarFallback>
                                </Avatar>
                                <button
                                    onClick={() => setShowUploadModal(true)}
                                    disabled={isUploading}
                                    className="absolute -bottom-1 -right-1 bg-white text-gray-600 rounded-full p-2 shadow-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    title="Thay đổi ảnh đại diện"
                                >
                                    {isUploading ? (
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600"></div>
                                    ) : (
                                        <Camera className="h-4 w-4" />
                                    )}
                                </button>
                            </div>
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
                                            ? "bg-green-500 hover:bg-green-600"
                                            : user.status === "LOCKED"
                                              ? "bg-red-500 hover:bg-red-600"
                                              : "bg-yellow-500 hover:bg-yellow-600"
                                    }`}
                                >
                                    {user.status === "ACTIVE" ? "Hoạt động" :
                                     user.status === "LOCKED" ? "Bị khóa" : 
                                     user.status.charAt(0).toUpperCase() + user.status.slice(1).toLowerCase()}
                                </Badge>
                            </div>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-6">
                    {error && (
                        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                            <p className="text-red-700 text-sm">{error}</p>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={clearError}
                                className="mt-2"
                            >
                                Đóng
                            </Button>
                        </div>
                    )}
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-gray-700 border-b pb-2">
                                Thông tin cá nhân
                            </h3>
                            <div className="space-y-3">
                                <div className="flex items-center space-x-3">
                                    <Mail className="h-5 w-5 text-gray-500 flex-shrink-0" />
                                    <div className="flex items-center space-x-2">
                                        <span className="text-gray-700">{user.email}</span>
                                        {user.status === "PENDING" && (
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={handleVerifyEmail}
                                                disabled={isVerifyingEmail}
                                                className="text-gray-600 hover:text-gray-800"
                                            >
                                                {isVerifyingEmail ? (
                                                    <>
                                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600 mr-2"></div>
                                                        Đang gửi...
                                                    </>
                                                ) : (
                                                    <>
                                                        <RefreshCw className="h-4 w-4 mr-2" />
                                                        Xác thực
                                                    </>
                                                )}
                                            </Button>
                                        )}
                                    </div>
                                </div>
                                {user.phone ? (
                                    <div className="flex items-center space-x-3">
                                        <Phone className="h-5 w-5 text-gray-500 flex-shrink-0" />
                                        <span className="text-gray-700">{user.phone}</span>
                                    </div>
                                ) : (
                                    <div className="flex items-center space-x-3">
                                        <Phone className="h-5 w-5 text-gray-300 flex-shrink-0" />
                                        <span className="text-gray-400 italic">Chưa cập nhật số điện thoại</span>
                                    </div>
                                )}
                                {user.address ? (
                                    <div className="flex items-center space-x-3">
                                        <MapPin className="h-5 w-5 text-gray-500 flex-shrink-0" />
                                        <span className="text-gray-700">{user.address}</span>
                                    </div>
                                ) : (
                                    <div className="flex items-center space-x-3">
                                        <MapPin className="h-5 w-5 text-gray-300 flex-shrink-0" />
                                        <span className="text-gray-400 italic">Chưa cập nhật địa chỉ</span>
                                    </div>
                                )}
                                {user.bio ? (
                                    <div className="mt-4">
                                        <h4 className="text-sm font-medium text-gray-600 mb-2">
                                            Giới thiệu bản thân
                                        </h4>
                                        <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg">
                                            {user.bio}
                                        </p>
                                    </div>
                                ) : (
                                    <div className="mt-4">
                                        <h4 className="text-sm font-medium text-gray-400 mb-2">
                                            Giới thiệu bản thân
                                        </h4>
                                        <p className="text-sm text-gray-400 italic bg-gray-50 p-3 rounded-lg">
                                            Chưa có thông tin giới thiệu
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-gray-700 border-b pb-2">
                                Thông tin hoạt động
                            </h3>
                            <div className="space-y-3">
                                <div className="flex items-center space-x-3">
                                    <Calendar className="h-5 w-5 text-gray-500 flex-shrink-0" />
                                    <div>
                                        <span className="text-sm font-medium text-gray-600">Ngày đăng ký:</span>
                                        <p className="text-gray-700">
                                            {formatDateToFullOptions(user.registrationDate)}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <Calendar className="h-5 w-5 text-gray-500 flex-shrink-0" />
                                    <div>
                                        <span className="text-sm font-medium text-gray-600">Đăng nhập cuối:</span>
                                        <p className="text-gray-700">
                                            {user.lastLogin
                                                ? formatDateToFullOptions(user.lastLogin)
                                                : "Chưa có thông tin"}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <FileText className="h-5 w-5 text-gray-500 flex-shrink-0" />
                                    <div>
                                        <span className="text-sm font-medium text-gray-600">Tài liệu đã tải lên:</span>
                                        <p className="text-gray-700 font-semibold">
                                            {user.documentsUploaded || 0}
                                        </p>
                                    </div>
                                </div>
                                {user.groups && user.groups.length > 0 && (
                                    <div className="mt-4">
                                        <h4 className="text-sm font-medium text-gray-600 flex items-center space-x-2 mb-3">
                                            <Users className="h-5 w-5" />
                                            <span>Nhóm tham gia ({user.groups.length})</span>
                                        </h4>
                                        <div className="flex flex-wrap gap-2">
                                            {user.groups.map((group) => (
                                                <Badge
                                                    key={group.id}
                                                    variant="secondary"
                                                    className="text-xs"
                                                >
                                                    {group.name}
                                                </Badge>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="mt-8 flex justify-end space-x-3 pt-6 border-t">
                        <Button variant="outline" asChild>
                            <Link href="/profile/edit">
                                <Edit className="h-4 w-4 mr-2" /> 
                                Chỉnh sửa hồ sơ
                            </Link>
                        </Button>
                        <Button 
                            variant="destructive" 
                            onClick={handleLogout}
                            disabled={isLoggingOut}
                        >
                            {isLoading ? (
                                <>
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                    Đang đăng xuất...
                                </>
                            ) : (
                                <>
                                    <LogOut className="h-4 w-4 mr-2" /> 
                                    Đăng xuất
                                </>
                            )}
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
}
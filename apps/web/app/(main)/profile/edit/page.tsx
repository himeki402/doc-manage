"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Calendar,
    FileText,
    Users,
    Save,
    ArrowLeft,
    Camera,
} from "lucide-react";
import Link from "next/link";
import { formatDateToFullOptions } from "@/lib/utils";
import { useAuth } from "@/contexts/authContext";
import { useState } from "react";
import userApi from "@/lib/apis/userApi";
import { toast } from "sonner";
import AvatarUploadModal from "@/components/common/user/profile/avatar-upload";

interface EditFormData {
    email: string;
    name: string;
    phone: string;
    address: string;
    bio: string;
}

export default function EditProfilePage() {
    const { user, updateUser } = useAuth();
    const [showUploadModal, setShowUploadModal] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
    const [formData, setFormData] = useState<EditFormData>({
        email: user?.email || "",
        name: user?.name || "",
        phone: user?.phone || "",
        address: user?.address || "",
        bio: user?.bio || "",
    });

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            if (!user) {
                toast.error("Không tìm thấy thông tin người dùng.");
                setIsLoading(false);
                return;
            }

            const updatedUser = await userApi.updateProfile(formData);
            updateUser(updatedUser);
            toast.success("Thông tin cá nhân đã được cập nhật thành công");
        } catch (error: any) {
            console.error("Error updating profile:", error);

            // Xử lý lỗi cụ thể
            if (error.response?.status === 400) {
                toast.error(
                    "Dữ liệu không hợp lệ. Vui lòng kiểm tra lại thông tin."
                );
            } else if (error.response?.status === 409) {
                toast.error("Email đã được sử dụng bởi tài khoản khác.");
            } else {
                toast.error("Có lỗi xảy ra khi cập nhật thông tin");
            }
        } finally {
            setIsLoading(false);
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

    return (
        <div className="container mx-auto max-w-4xl px-4 py-8">
            <Card className="border-none shadow-lg">
                <CardHeader className="bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-t-lg">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <Button
                                variant="ghost"
                                size="sm"
                                asChild
                                className="text-white hover:bg-white/10"
                            >
                                <Link href="/profile">
                                    <ArrowLeft className="h-4 w-4 mr-2" />
                                    Quay lại
                                </Link>
                            </Button>
                            <CardTitle className="text-2xl font-bold">
                                Chỉnh sửa hồ sơ
                            </CardTitle>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-6">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold text-gray-700 border-b pb-2">
                                    Thông tin cá nhân
                                </h3>

                                <div className="space-y-2">
                                    <Label htmlFor="name">Họ và tên *</Label>
                                    <Input
                                        id="name"
                                        name="name"
                                        type="text"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        placeholder="Nhập họ và tên"
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="email">Email *</Label>
                                    <Input
                                        id="email"
                                        name="email"
                                        type="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        placeholder="Nhập email"
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="phone">Số điện thoại</Label>
                                    <Input
                                        id="phone"
                                        name="phone"
                                        type="tel"
                                        value={formData.phone}
                                        onChange={handleInputChange}
                                        placeholder="Nhập số điện thoại"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="address">Địa chỉ</Label>
                                    <Input
                                        id="address"
                                        name="address"
                                        type="text"
                                        value={formData.address}
                                        onChange={handleInputChange}
                                        placeholder="Nhập địa chỉ"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="bio">
                                        Giới thiệu bản thân
                                    </Label>
                                    <Textarea
                                        id="bio"
                                        name="bio"
                                        value={formData.bio}
                                        onChange={handleInputChange}
                                        placeholder="Viết vài dòng giới thiệu về bản thân..."
                                        rows={4}
                                    />
                                </div>
                            </div>

                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold text-gray-700 border-b pb-2">
                                    Thông tin hoạt động
                                </h3>

                                <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                                    <div className="flex items-center space-x-2">
                                        <Calendar className="h-5 w-5 text-gray-500" />
                                        <span className="text-sm">
                                            <span className="font-medium">
                                                Đăng ký:
                                            </span>{" "}
                                            {formatDateToFullOptions(
                                                user.registrationDate
                                            )}
                                        </span>
                                    </div>

                                    <div className="flex items-center space-x-2">
                                        <Calendar className="h-5 w-5 text-gray-500" />
                                        <span className="text-sm">
                                            <span className="font-medium">
                                                Đăng nhập cuối:
                                            </span>{" "}
                                            {user.lastLogin
                                                ? formatDateToFullOptions(
                                                      user.lastLogin
                                                  )
                                                : "Chưa đăng nhập"}
                                        </span>
                                    </div>

                                    <div className="flex items-center space-x-2">
                                        <FileText className="h-5 w-5 text-gray-500" />
                                        <span className="text-sm">
                                            <span className="font-medium">
                                                Tài liệu đã tải lên:
                                            </span>{" "}
                                            {user.documentsUploaded}
                                        </span>
                                    </div>
                                </div>

                                {user.groups && user.groups.length > 0 && (
                                    <div>
                                        <h4 className="text-sm font-medium text-gray-600 flex items-center space-x-2 mb-2">
                                            <Users className="h-5 w-5" />
                                            <span>Nhóm tham gia</span>
                                        </h4>
                                        <div className="flex flex-wrap gap-2">
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

                        <div className="flex justify-end space-x-2 pt-6 border-t">
                            <Button variant="outline" asChild>
                                <Link href="/profile">Hủy</Link>
                            </Button>
                            <Button type="submit" disabled={isLoading}>
                                {isLoading ? (
                                    <>
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                        Đang lưu...
                                    </>
                                ) : (
                                    <>
                                        <Save className="h-4 w-4 mr-2" />
                                        Lưu thay đổi
                                    </>
                                )}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}

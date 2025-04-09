"use client";

import { Mail } from "lucide-react";
import Link from "next/link";

export function Footer() {
    return (
        <footer className="w-full border-t bg-background">
            <div className="container mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center py-4 px-6">
                    {/* Left side - Contact Information */}
                    <div className="space-y-2">
                        <h3 className="font-medium text-foreground">
                            Bản quyền thuộc Nguyễn Xuân Sơn
                        </h3>
                        <div className="flex items-center gap-2">
                            <span className="font-medium text-foreground">
                                Địa chỉ:
                            </span>
                            <span className="text-muted-foreground">
                                141 Đường Chiến Thắng - Tân Triều - Thanh Trì -
                                Hà nội
                            </span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="font-medium text-foreground">
                                Email:
                            </span>
                            <Link
                                href="mailto:email@email.com"
                                className="text-muted-foreground hover:text-primary"
                            >
                                email@email.com
                            </Link>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="font-medium text-foreground">
                                Điện thoại:
                            </span>
                            <Link
                                href="tel:024xxxxxxxx"
                                className="text-muted-foreground hover:text-primary"
                            >
                                024xxxxxxxx
                            </Link>
                        </div>
                    </div>

                    {/* Right side - Stats and Social Links */}
                    <div className="flex flex-col items-end gap-2">
                        <div className="text-right space-y-1 text-muted-foreground">
                            <p>
                                Hôm nay:{" "}
                                {new Date().toLocaleDateString("vi-VN")}
                            </p>
                            <p>Người dùng online: xxx</p>
                            <p>Ngày hôm nay: xxxx</p>
                            <p>Tháng này: xxxxx</p>
                            <p>Tổng lượt truy cập: xxxxx</p>
                        </div>

                        {/* Social Links */}
                        <div className="flex gap-4 mt-4">
                            <Link
                                href="#"
                                className="text-muted-foreground hover:text-primary transition-colors"
                            >
                                <Mail size={24} />
                                <span className="sr-only">Email</span>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}

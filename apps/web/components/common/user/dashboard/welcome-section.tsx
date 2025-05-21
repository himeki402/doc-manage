"use client";
import { Button } from "@/components/ui/button";
import { FilePlus } from "lucide-react";

interface WelcomeSectionProps {
    name?: string;
}

export default function WelcomeSection({ name }: WelcomeSectionProps) {
    return (
        <div className="flex flex-col md:flex-row justify-between gap-4 items-start md:items-center">
            <div>
                <h1 className="text-2xl font-bold tracking-tight">
                    Xin chào, {name || "Sinh viên"}
                </h1>
                <p className="text-muted-foreground">
                    Quản lý tài liệu học tập của bạn
                </p>
            </div>
            <div className="flex gap-2">
                <Button>
                    <FilePlus className="mr-2 h-4 w-4" /> Thêm tài liệu mới
                </Button>
            </div>
        </div>
    );
}

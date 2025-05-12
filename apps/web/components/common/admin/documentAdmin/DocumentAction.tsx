"use client";

import { Document } from "@/lib/types/document";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";
import documentApi from "@/lib/apis/documentApi";
import { useRouter } from "next/navigation";

interface DocumentActionsProps {
    document: Document;
}

export function DocumentActions({ document }: DocumentActionsProps) {
    const router = useRouter();

    const handleDelete = async () => {
        if (confirm("Bạn có chắc muốn xóa tài liệu này?")) {
            try {
                await documentApi.deleteDocument(document.id);
                router.refresh();
            } catch (error) {
                console.error("Failed to delete document:", error);
            }
        }
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                    <MoreHorizontal className="h-4 w-4" />
                    <span className="sr-only">Mở menu</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuLabel>Hành động</DropdownMenuLabel>
                <DropdownMenuItem
                    onClick={() =>
                        router.push(`/admin/documents/${document.id}`)
                    }
                >
                    Xem chi tiết
                </DropdownMenuItem>
                <DropdownMenuItem>
                    <a href={document.file_url} download>
                        Tải xuống
                    </a>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                    className="text-red-600"            
                    onClick={handleDelete}
                >
                    Xóa tài liệu
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

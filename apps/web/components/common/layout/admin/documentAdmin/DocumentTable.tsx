
"use client";

import { Document } from "@/lib/types/document";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { FileText } from "lucide-react";
import { DocumentActions } from "./DocumentAction";
interface DocumentTableProps {
    documents: Document[];
}

export function DocumentTable({ documents }: DocumentTableProps) {
    return (
        <div className="rounded-md border">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Tiêu đề</TableHead>
                        <TableHead>Danh mục</TableHead>
                        <TableHead>Người đăng</TableHead>
                        <TableHead>Trạng thái</TableHead>
                        <TableHead>Ngôn ngữ</TableHead>
                        <TableHead>Ngày tải lên</TableHead>
                        <TableHead>Lượt xem</TableHead>
                        <TableHead>Đánh giá</TableHead>
                        <TableHead className="w-[80px]"></TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {documents.map((doc) => (
                        <TableRow key={doc.id}>
                            <TableCell className="font-medium">
                                <div className="flex items-center">
                                    <FileText className="mr-2 h-4 w-4 text-muted-foreground" />
                                    <span className="line-clamp-2">{doc.title}</span>
                                </div>
                            </TableCell>
                            <TableCell>{doc.category?.name || "N/A"}</TableCell>
                            <TableCell>{doc.created_by?.username || "N/A"}</TableCell>
                            <TableCell>
                                <Badge
                                    variant={
                                        doc.status === "approved"
                                            ? "default"
                                            : doc.status === "pending"
                                            ? "outline"
                                            : "secondary"
                                    }
                                >
                                    {doc.status === "approved"
                                        ? "Đã duyệt"
                                        : doc.status === "pending"
                                        ? "Chờ duyệt"
                                        : "Từ chối"}
                                </Badge>
                            </TableCell>
                            <TableCell>{doc.language || "N/A"}</TableCell>
                            <TableCell>
                                {new Date(doc.created_at).toLocaleDateString("vi-VN")}
                            </TableCell>
                            <TableCell>{doc.view}</TableCell>
                            <TableCell>
                                {doc.rating ? `${doc.rating.toFixed(1)} (${doc.ratingCount})` : "Chưa có"}
                            </TableCell>
                            <TableCell>
                                <DocumentActions document={doc} />
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}
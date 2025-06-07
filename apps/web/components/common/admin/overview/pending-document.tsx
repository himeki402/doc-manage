"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock } from "lucide-react";
import Link from "next/link";
import documentApi from "@/lib/apis/documentApi";
import { formatTimeAgo } from "@/lib/utils";
import { useAdminContext } from "@/contexts/adminContext";
import { toast } from "sonner";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { useState } from "react";
import { Document } from "@/lib/types/document";

export default function PendingDocuments() {
    const { pendingDocuments, setPendingDocuments, totalPendingDocuments } =
        useAdminContext();
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [allPendingDocs, setAllPendingDocs] = useState<Document[]>([]);

    const fetchAllPendingDocs = async () => {
        try {
            const response = await documentApi.getPendingDocuments({
                limit: totalPendingDocuments,
            });
            setAllPendingDocs(response.data);
        } catch (error: any) {
            console.error("Error fetching all pending documents:", error);
            toast.error(error.message || "Không thể tải danh sách tài liệu");
        }
    };

    const approveDocument = async (id: string) => {
        try {
            await documentApi.approveDocument(id);
            const approvedDoc = pendingDocuments.find((doc) => doc.id === id);
            setPendingDocuments(
                pendingDocuments.filter((doc) => doc.id !== id)
            );
            toast.success(
                `Tài liệu ${approvedDoc?.title || ""} đã được phê duyệt`
            );
            const pendingResponse = await documentApi.getPendingDocuments();
            const updatedPendingDocs = pendingResponse.data;
            setPendingDocuments(updatedPendingDocs);
        } catch (error: any) {
            console.error("Error approving document:", error);
            toast.error(error.message || "Không thể phê duyệt tài liệu");
        }
    };

    const rejectDocument = async (id: string) => {
        try {
            await documentApi.rejectDocument(id);
            setPendingDocuments(
                pendingDocuments.filter((doc) => doc.id !== id)
            );
            toast.success(`Tài liệu ${id} đã bị từ chối`);
        } catch (error: any) {
            console.error("Error rejecting document:", error);
            toast.error(error.message || "Không thể từ chối tài liệu");
        }
    };

    return (
        <Card className="col-span-1">
            <CardHeader>
                <CardTitle>Tài liệu đang chờ duyệt</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {pendingDocuments.length > 0 ? (
                        pendingDocuments.map((doc) => (
                            <div
                                key={doc.id}
                                className="flex items-center justify-between"
                            >
                                <div>
                                    <p className="font-medium">{doc.title}</p>
                                    <p className="text-sm text-muted-foreground">
                                        {doc.createdByName}
                                    </p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="flex items-center text-sm text-muted-foreground">
                                        <Clock className="mr-1 h-3 w-3" />
                                        {formatTimeAgo(doc.created_at)}
                                    </div>
                                    <Button
                                        size="sm"
                                        variant="destructive"
                                        onClick={() => rejectDocument(doc.id)}
                                    >
                                        Từ chối
                                    </Button>
                                    <Button
                                        size="sm"
                                        className="bg-green-500 text-white hover:bg-green-600"
                                        onClick={() => approveDocument(doc.id)}
                                    >
                                        Phê duyệt
                                    </Button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-sm text-muted-foreground text-center">
                            Hiện không có tài liệu nào đang chờ duyệt.
                        </p>
                    )}
                </div>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    {pendingDocuments.length > 0 && (
                        <DialogTrigger asChild>
                            <Button
                                variant="outline"
                                className="mt-4 w-full"
                                onClick={() => {
                                    setIsDialogOpen(true);
                                    fetchAllPendingDocs();
                                }}
                            >
                                Xem tất cả
                            </Button>
                        </DialogTrigger>
                    )}
                    <DialogContent className="max-w-4xl">
                        <DialogHeader>
                            <DialogTitle>
                                Danh sách tài liệu đang chờ duyệt
                            </DialogTitle>
                        </DialogHeader>
                        <div className="mt-4 max-h-[60vh] overflow-y-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Tiêu đề</TableHead>
                                        <TableHead>Người tạo</TableHead>
                                        <TableHead>Thời gian tạo</TableHead>
                                        <TableHead>Hành động</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {allPendingDocs.length > 0 ? (
                                        allPendingDocs.map((doc) => (
                                            <TableRow key={doc.id}>
                                                <TableCell>
                                                    {doc.title}
                                                </TableCell>
                                                <TableCell>
                                                    {doc.createdByName}
                                                </TableCell>
                                                <TableCell>
                                                    {formatTimeAgo(
                                                        doc.created_at
                                                    )}
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex gap-2">
                                                        <Button
                                                            size="sm"
                                                            variant="destructive"
                                                            onClick={() =>
                                                                rejectDocument(
                                                                    doc.id
                                                                )
                                                            }
                                                        >
                                                            Từ chối
                                                        </Button>
                                                        <Button
                                                            size="sm"
                                                            className="bg-green-500 text-white hover:bg-green-600"
                                                            onClick={() =>
                                                                approveDocument(
                                                                    doc.id
                                                                )
                                                            }
                                                        >
                                                            Phê duyệt
                                                        </Button>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell
                                                colSpan={4}
                                                className="text-center"
                                            >
                                                Không có tài liệu nào đang chờ
                                                duyệt
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </DialogContent>
                </Dialog>
            </CardContent>
        </Card>
    );
}

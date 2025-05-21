"use client";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, FileEdit, MoreHorizontal, Trash2, Eye, Edit } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { DocumentQueryParams } from "@/lib/apis/documentApi";
import { Document, GetDocumentsResponse } from "@/lib/types/document";
import { formatDateToFullOptions } from "@/lib/utils";
import { useState } from "react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface DocumentListProps {
    documentsResponse: GetDocumentsResponse | null;
    onFetchDocuments?: (params?: DocumentQueryParams) => void;
    onEdit?: (document: Document) => void;
    onDelete?: (documentId: string) => void;
    setSelectedDocument?: (document: Document) => void;
    setIsDetailsModalOpen?: (open: boolean) => void;
}

export default function DocumentList({
    documentsResponse,
    onFetchDocuments,
    onEdit,
    onDelete,
    setSelectedDocument,
    setIsDetailsModalOpen,
}: DocumentListProps) {
    const [isLoadingPage, setIsLoadingPage] = useState(false);
    const handleNextPage = async () => {
        if (
            documentsResponse &&
            documentsResponse.meta.page < documentsResponse.meta.totalPages &&
            onFetchDocuments
        ) {
            setIsLoadingPage(true);
            try {
                await onFetchDocuments({
                    limit: documentsResponse.meta.limit,
                    page: documentsResponse.meta.page + 1,
                });
            } finally {
                setIsLoadingPage(false);
            }
        }
    };

    const handlePrevPage = async () => {
        if (
            documentsResponse &&
            documentsResponse.meta.page > 1 &&
            onFetchDocuments
        ) {
            setIsLoadingPage(true);
            try {
                await onFetchDocuments({
                    limit: documentsResponse.meta.limit,
                    page: documentsResponse.meta.page - 1,
                });
            } finally {
                setIsLoadingPage(false);
            }
        }
    };

    const renderEmptyState = () => (
    <div className="flex flex-col items-center justify-center p-8 text-center">
      <FileText className="w-16 h-16 text-muted-foreground mb-4" />
      <h3 className="text-lg font-medium text-muted-foreground">
        Không có tài liệu để hiển thị
      </h3>
      <p className="text-sm text-muted-foreground mt-2 mb-4">
        Hãy bắt đầu bằng cách thêm tài liệu mới!
      </p>
    </div>
  );

    return (
        <Card className="lg:col-span-5">
      <CardHeader>
        <CardTitle>Tài liệu của tôi</CardTitle>
        <CardDescription>
          Quản lý và truy cập tất cả tài liệu học tập của bạn
        </CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        {isLoadingPage ? (
          <div className="text-center p-4">Đang tải tài liệu...</div>
        ) : !documentsResponse || documentsResponse.data.length === 0 ? (
          renderEmptyState()
        ) : (
          <div className="space-y-0 divide-y">
            {documentsResponse.data.map((doc) => (
              <div
                key={doc.id}
                className="flex items-center justify-between p-4 hover:bg-slate-50"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-md flex items-center justify-center ${
                      doc.mimeType === "application/pdf"
                        ? "bg-red-100 text-red-700"
                        : "bg-blue-100 text-blue-700"
                    }`}
                  >
                    {doc.mimeType === "application/pdf" ? (
                      <FileText size={20} />
                    ) : (
                      <FileEdit size={20} />
                    )}
                  </div>
                  <div>
                    <p
                      className="text-sm font-medium truncate max-w-[500px]"
                      title={doc.title}
                    >
                      {doc.title}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span>{doc.mimeType === "application/pdf" ? "PDF" : "Word"}</span>
                      <span>•</span>
                      <span>{doc.subject || "Không có môn học"}</span>
                      <span>•</span>
                      <span>Cập nhật {formatDateToFullOptions(doc.updated_at)}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge
                    variant="outline"
                    className={`${
                      doc.status === "Đã hoàn thành"
                        ? "bg-green-50 text-green-700 border-green-200"
                        : doc.status === "Đang học"
                        ? "bg-blue-50 text-blue-700 border-blue-200"
                        : "bg-slate-50 text-slate-700 border-slate-200"
                    }`}
                  >
                    {doc.status}
                  </Badge>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Mở menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Hành động</DropdownMenuLabel>
                      <DropdownMenuItem
                        onClick={() => {
                          if (setSelectedDocument && setIsDetailsModalOpen) {
                            setSelectedDocument(doc);
                            setIsDetailsModalOpen(true);
                          }
                        }}
                      >
                        <Eye className="mr-2 h-4 w-4" />
                        <span>Xem chi tiết</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => onEdit?.(doc)}
                        disabled={!onEdit}
                      >
                        <Edit className="mr-2 h-4 w-4" />
                        <span>Sửa</span>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        className="text-red-600"
                        onClick={() => onDelete?.(doc.id)}
                        disabled={!onDelete}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        <span>Xóa</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
      <CardFooter className="border-t p-4 flex justify-between">
        <div className="text-sm text-muted-foreground">
          {documentsResponse && documentsResponse.data.length > 0 ? (
            <>
              Hiển thị {documentsResponse.data.length} trong số {documentsResponse.meta.total} tài liệu (Trang {documentsResponse.meta.page}/{documentsResponse.meta.totalPages})
            </>
          ) : (
            ""
          )}
        </div>
        {documentsResponse && documentsResponse.data.length > 0 && (
          <div className="flex gap-1">
            <Button
              variant="outline"
              size="sm"
              onClick={handlePrevPage}
              disabled={
                isLoadingPage ||
                !documentsResponse ||
                documentsResponse.meta.page === 1
              }
            >
              Trước
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleNextPage}
              disabled={
                isLoadingPage ||
                !documentsResponse ||
                documentsResponse.meta.page === documentsResponse.meta.totalPages
              }
            >
              Tiếp
            </Button>
          </div>
        )}
      </CardFooter>
    </Card>
    );
}

"use client";

import { useState } from "react";
import {
    type ColumnDef,
    flexRender,
    getCoreRowModel,
    getPaginationRowModel,
    useReactTable,
    type SortingState,
    getSortedRowModel,
    VisibilityState,
} from "@tanstack/react-table";
import {
    Eye,
    Tag,
    Lock,
    Globe,
    Users,
    MoreHorizontal,
    Trash2,
    Edit,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { AccessType, Document } from "@/lib/types/document";
import { useAdminContext } from "@/contexts/adminContext";
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { formatDateToFullOptions } from "@/lib/utils";

interface DocumentsTableProps {
    onEdit: (document: Document) => void;
    onDelete: (documentId: string) => void;
}

export function DocumentsTable({ onEdit, onDelete }: DocumentsTableProps) {
    const {
        filteredDocuments,
        setSelectedDocument,
        pagination,
        setPagination,
        totalDocuments,
        isLoading,
        setIsShareModalOpen,
        setIsVersionModalOpen,
        setIsDetailsModalOpen,
    } = useAdminContext();
    const [sorting, setSorting] = useState<SortingState>([]);
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({
        view: false,
        version: false,
        createdBy: false,
    });

    const getAccessTypeIcon = (accessType: AccessType) => {
        switch (accessType) {
            case "PRIVATE":
                return <Lock className="h-4 w-4 text-red-500" />;
            case "PUBLIC":
                return <Globe className="h-4 w-4 text-green-500" />;
            case "GROUP":
                return <Users className="h-4 w-4 text-blue-500" />;
        }
    };

    const formatMimeType = (mimeType: string) => {
        if (!mimeType) return "Unknown";
        switch (mimeType.toLowerCase()) {
            case "application/pdf":
                return "PDF";
            case "application/msword":
            case "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
                return "Word";
            case "application/vnd.ms-excel":
            case "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet":
                return "Excel";
            case "application/vnd.ms-powerpoint":
            case "application/vnd.openxmlformats-officedocument.presentationml.presentation":
                return "PowerPoint";
            case "image/jpeg":
            case "image/jpg":
                return "JPEG";
            case "image/png":
                return "PNG";
            case "image/gif":
                return "GIF";
            case "text/plain":
                return "Text";
            case "application/json":
                return "JSON";
            default:
                return mimeType;
        }
    };

    const columns: ColumnDef<Document>[] = [
        {
            id: "stt",
            header: "STT",
            cell: ({ row }) => {
                return (
                    <div className="text-center">
                        {pagination.pageIndex * pagination.pageSize +
                            row.index +
                            1}
                    </div>
                );
            },
            enableHiding: false, 
            size: 50,
        },
        {
            accessorKey: "Tiêu đề",
            header: "Tiêu đề",
            size: 300, 
            maxSize: 300,
            cell: ({ row }) => {
                const document = row.original;
                return (
                    <div className="flex items-center gap-2">
                        <div className="flex flex-col">
                            <span className="font-medium truncate max-w-[280px]" title={document.title}>
                                {document.title}
                            </span>
                            <span className="text-xs text-muted-foreground truncate max-w-[300px]">
                                {document.description}
                            </span>
                        </div>
                    </div>
                );
            },
        },
        {
            accessorKey: "Loại văn bản",
            header: "Loại văn bản",
            cell: ({ row }) => (
                <Badge variant="outline">
                    {formatMimeType(row.original.mimeType)}
                </Badge>
            ),
        },
        {
            accessorKey: "Danh mục",
            header: "Danh mục",
            cell: ({ row }) => (
                <div className="flex items-center gap-1">
                    <span>{row.original.categoryName}</span>
                </div>
            ),
        },
        {
            accessorKey: "tags",
            header: "Thẻ",
            cell: ({ row }) => {
                const document = row.original;
                return (
                    <div className="flex flex-wrap gap-1">
                        {document.tags?.map((tag) => (
                            <Badge key={tag.id} variant="secondary" className="text-xs flex items-center gap-1">
                                <Tag className="h-3 w-3" />
                                {tag.name}
                            </Badge>
                        )) || "Không có thẻ"}
                    </div>
                );
            },
        },
        {
            accessorKey: "Quyền truy cập",
            header: "Quyền truy cập",
            cell: ({ row }) => {
                const accessType = row.original.accessType;
                return (
                    <div className="flex items-center gap-1">
                        {getAccessTypeIcon(accessType)}
                        <span className="capitalize">{accessType}</span>
                    </div>
                );
            },
        },
        {
            accessorKey: "Lượt xem",
            header: "Lượt xem",
            cell: ({ row }) => (
                <div className="flex items-center gap-1">
                    <Eye className="h-4 w-4 text-muted-foreground" />
                    <span>{row.original.view}</span>
                </div>
            ),
        },
        {
            accessorKey: "Được tạo bởi",
            header: "Được tạo bởi",
            cell: ({ row }) => <span>{row.original.createdByName}</span>,
        },
        {
            accessorKey: "Lần thay đổi cuối",
            header: "Lần thay đổi cuối",
            cell: ({ row }) => formatDateToFullOptions(row.original.updated_at),
        },
        {
            id: "actions",
            cell: ({ row }) => {
                const document = row.original;
                return (
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
                                    setSelectedDocument(document);
                                    setIsDetailsModalOpen(true);
                                }}
                            >
                                <Eye className="mr-2 h-4 w-4" />
                                <span>Xem chi tiết</span>
                            </DropdownMenuItem>

                            <DropdownMenuItem onClick={() => onEdit(document)}>
                                <Edit className="mr-2 h-4 w-4" />
                                <span>Sửa</span>
                            </DropdownMenuItem>

                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                                className="text-red-600"
                                onClick={() => onDelete(document.id)}
                            >
                                <Trash2 className="mr-2 h-4 w-4" />
                                <span>Xóa</span>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                );
            },
        },
    ];

    const table = useReactTable({
        data: filteredDocuments,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        onPaginationChange: (updater) => {
            const newPagination =
                typeof updater === "function" ? updater(pagination) : updater;
            setPagination(newPagination);
        },
        state: {
            pagination,
            sorting,
            columnVisibility,
        },
        onSortingChange: setSorting,
        onColumnVisibilityChange: setColumnVisibility,
        getSortedRowModel: getSortedRowModel(),
        manualPagination: true,
        pageCount: Math.ceil(totalDocuments / pagination.pageSize),
    });

    const totalPages = Math.ceil(totalDocuments / pagination.pageSize);

    return (
        <div className="flex flex-col gap-4">
            <div className="flex justify-between items-center mb-2">
                <div className="flex items-center gap-2">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant="outline"
                                size="sm"
                                className="ml-auto"
                            >
                                Cột
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            {table
                                .getAllColumns()
                                .filter((column) => column.getCanHide())
                                .map((column) => (
                                    <DropdownMenuCheckboxItem
                                        key={column.id}
                                        className="capitalize"
                                        checked={column.getIsVisible()}
                                        onCheckedChange={(value) =>
                                            column.toggleVisibility(!!value)
                                        }
                                    >
                                        {column.id}
                                    </DropdownMenuCheckboxItem>
                                ))}
                        </DropdownMenuContent>
                    </DropdownMenu>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                            table.toggleAllColumnsVisible(false);
                            table.getColumn("Tiêu đề")?.toggleVisibility(true);
                            table.getColumn("actions")?.toggleVisibility(true);
                        }}
                    >
                        Đặt lại cột
                    </Button>
                </div>
            </div>

            <div className="rounded-md border overflow-x-auto">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <TableHead key={header.id}>
                                        {header.isPlaceholder
                                            ? null
                                            : flexRender(
                                                  header.column.columnDef
                                                      .header,
                                                  header.getContext()
                                              )}
                                    </TableHead>
                                ))}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            <TableRow>
                                <TableCell
                                    colSpan={columns.length}
                                    className="h-24 text-center"
                                >
                                    Đang tải...
                                </TableCell>
                            </TableRow>
                        ) : table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    data-state={
                                        row.getIsSelected() && "selected"
                                    }
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext()
                                            )}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell
                                    colSpan={columns.length}
                                    className="h-24 text-center"
                                >
                                    Không tìm thấy tài liệu.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            <div className="flex items-center justify-between">
                <div className="text-sm text-muted-foreground">
                    Hiển thị {pagination.pageIndex * pagination.pageSize + 1}{" "}
                    đến{" "}
                    {Math.min(
                        (pagination.pageIndex + 1) * pagination.pageSize,
                        totalDocuments
                    )}{" "}
                    của {totalDocuments} tài liệu
                </div>

                <Pagination>
                    <PaginationContent>
                        <PaginationItem>
                            <PaginationPrevious
                                onClick={() => table.previousPage()}
                                disabled={!table.getCanPreviousPage()}
                            />
                        </PaginationItem>

                        {Array.from({ length: Math.min(5, totalPages) }).map(
                            (_, index) => (
                                <PaginationItem key={index}>
                                    <PaginationLink
                                        isActive={
                                            index === pagination.pageIndex
                                        }
                                        onClick={() =>
                                            table.setPageIndex(index)
                                        }
                                    >
                                        {index + 1}
                                    </PaginationLink>
                                </PaginationItem>
                            )
                        )}

                        {totalPages > 5 && (
                            <PaginationItem>
                                <PaginationEllipsis />
                            </PaginationItem>
                        )}

                        <PaginationItem>
                            <PaginationNext
                                onClick={() => table.nextPage()}
                                disabled={!table.getCanNextPage()}
                            />
                        </PaginationItem>
                    </PaginationContent>
                </Pagination>
            </div>
        </div>
    );
}

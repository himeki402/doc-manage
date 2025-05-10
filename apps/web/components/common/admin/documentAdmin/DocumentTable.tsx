"use client";

import { useMemo, useState } from "react";
import {
    type ColumnDef,
    flexRender,
    getCoreRowModel,
    getPaginationRowModel,
    useReactTable,
    type SortingState,
    getSortedRowModel,
    type ColumnFiltersState,
    getFilteredRowModel,
    VisibilityState,
} from "@tanstack/react-table";
import {
    Eye,
    Tag,
    Lock,
    Globe,
    Users,
    Star,
    MoreHorizontal,
    Download,
    Share2,
    History,
    Trash2,
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
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function DocumentsTable() {
    const {
        filteredDocuments,
        setSelectedDocument,
        pagination,
        setPagination,
        setIsShareModalOpen,
        setIsVersionModalOpen,
        setIsDetailsModalOpen,
        categories,
        tags,
        users,
    } = useAdminContext();
    const [sorting, setSorting] = useState<SortingState>([]);
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({
    view: false,
    version: false,
    createdBy: false,
  })

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

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        }).format(date);
    };

    const columns: ColumnDef<Document>[] = useMemo(
        () => [
            {
                accessorKey: "title",
                header: "Tiêu đề",
                cell: ({ row }) => {
                    const document = row.original;
                    return (
                        <div className="flex items-center gap-2">
                            <div className="flex flex-col">
                                <span className="font-medium">
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
                accessorKey: "type",
                header: "Type",
                cell: ({ row }) => {
                    return (
                        <Badge variant="outline">{row.original.mimeType}</Badge>
                    );
                },
            },
            {
                accessorKey: "categoryId",
                header: "Danh mục",
                cell: ({ row }) => {
                    return (
                        <div className="flex items-center gap-1">
                            <span>{row.original.categoryName}</span>
                        </div>
                    );
                },
            },
            {
                accessorKey: "tags",
                header: "Tags",
                cell: ({ row }) => {
                    const tagNames = row.original.tags || [""];
                    return (
                        <div className="flex flex-wrap gap-1 max-w-[200px]">
                            {tagNames.map((tagName) => (
                                <Badge
                                    key={tagName}
                                    variant="secondary"
                                    className="text-xs flex items-center gap-1"
                                >
                                    <Tag className="h-3 w-3" />
                                    {tagName}
                                </Badge>
                            ))}
                        </div>
                    );
                },
            },
            {
                accessorKey: "size",
                header: "Size",
            },
            {
                accessorKey: "accessType",
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
                accessorKey: "views",
                header: "Views",
                cell: ({ row }) => {
                    return (
                        <div className="flex items-center gap-1">
                            <Eye className="h-4 w-4 text-muted-foreground" />
                            <span>{row.original.view}</span>
                        </div>
                    );
                },
            },
            {
                accessorKey: "rating",
                header: "Rating",
                cell: ({ row }) => {
                    const rating = row.original.rating;
                    return (
                        <div className="flex items-center">
                            <span className="mr-1">{rating.toFixed(1)}</span>
                            <div className="flex text-yellow-400">
                                {Array.from({ length: 5 }).map((_, i) => (
                                    <Star
                                        key={i}
                                        className="h-3 w-3"
                                        fill={
                                            i < Math.floor(rating)
                                                ? "currentColor"
                                                : "none"
                                        }
                                    />
                                ))}
                            </div>
                        </div>
                    );
                },
            },
            {
                accessorKey: "version",
                header: "Version",
                cell: ({ row }) => {
                    return <span>v{row.original.version}</span>;
                },
            },
            {
                accessorKey: "createdBy",
                header: "Created By",
                cell: ({ row }) => {
                    return <span>{row.original.createdByName}</span>;
                },
            },
            {
                accessorKey: "updatedAt",
                header: "Last Modified",
                cell: ({ row }) => {
                    return formatDate(row.original.updated_at);
                },
            },
            {
                id: "actions",
                cell: ({ row }) => {
                    const document = row.original;

                    return (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-8 w-8 p-0">
                                    <span className="sr-only">Open menu</span>
                                    <MoreHorizontal className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuItem
                                    onClick={() => {
                                        setSelectedDocument(document);
                                        setIsDetailsModalOpen(true);
                                    }}
                                >
                                    <Eye className="mr-2 h-4 w-4" />
                                    <span>View Details</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                    <Download className="mr-2 h-4 w-4" />
                                    <span>Download</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    onClick={() => {
                                        setSelectedDocument(document);
                                        setIsShareModalOpen(true);
                                    }}
                                >
                                    <Share2 className="mr-2 h-4 w-4" />
                                    <span>Share</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    onClick={() => {
                                        setSelectedDocument(document);
                                        setIsVersionModalOpen(true);
                                    }}
                                >
                                    <History className="mr-2 h-4 w-4" />
                                    <span>Upload New Version</span>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="text-red-600">
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    <span>Delete</span>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    );
                },
            },
        ],
        [
            categories,
            tags,
            users,
            setSelectedDocument,
            setIsDetailsModalOpen,
            setIsShareModalOpen,
            setIsVersionModalOpen,
        ]
    );

    const table = useReactTable({
        data: filteredDocuments,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        onPaginationChange: setPagination,
        state: {
            pagination,
            sorting,
            columnVisibility,
        },
        onSortingChange: setSorting,
        onColumnVisibilityChange: setColumnVisibility,
        getSortedRowModel: getSortedRowModel(),
        manualPagination: false,
    });

    return (
        <div className="flex flex-col gap-4">
            <div className="flex justify-between items-center mb-2">
                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                            table.toggleAllColumnsVisible(false);
                            table.getColumn("name")?.toggleVisibility(true);
                            table.getColumn("actions")?.toggleVisibility(true);
                        }}
                    >
                        Reset Columns
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
                        {table.getRowModel().rows?.length ? (
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
                                    No documents found.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            <div className="flex items-center justify-between">
                <div className="text-sm text-muted-foreground">
                    Showing{" "}
                    {table.getState().pagination.pageIndex *
                        table.getState().pagination.pageSize +
                        1}{" "}
                    to{" "}
                    {Math.min(
                        (table.getState().pagination.pageIndex + 1) *
                            table.getState().pagination.pageSize,
                        filteredDocuments.length
                    )}{" "}
                    of {filteredDocuments.length} documents
                </div>

                <Pagination>
                    <PaginationContent>
                        <PaginationItem>
                            <PaginationPrevious
                                onClick={() => table.previousPage()}
                                disabled={!table.getCanPreviousPage()}
                            />
                        </PaginationItem>

                        {Array.from({
                            length: Math.min(5, table.getPageCount()),
                        }).map((_, index) => (
                            <PaginationItem key={index}>
                                <PaginationLink
                                    isActive={
                                        index ===
                                        table.getState().pagination.pageIndex
                                    }
                                    onClick={() => table.setPageIndex(index)}
                                >
                                    {index + 1}
                                </PaginationLink>
                            </PaginationItem>
                        ))}

                        {table.getPageCount() > 5 && (
                            <PaginationItem>
                                <PaginationLink>...</PaginationLink>
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

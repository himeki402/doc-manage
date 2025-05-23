import React, { useState, useEffect } from "react";
import {
    useReactTable,
    getCoreRowModel,
    getSortedRowModel,
    getFilteredRowModel,
    flexRender,
    SortingState,
    ColumnFiltersState,
    ColumnDef,
} from "@tanstack/react-table";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
    MoreHorizontal,
    ChevronLeft,
    ChevronRight,
    ChevronsRight,
    ChevronsLeft,
} from "lucide-react";
import { useAdminContext } from "@/contexts/adminContext";
import { User } from "@/lib/types/user";
import userApi from "@/lib/apis/userApi";
import { toast } from "sonner";
import { formatTimeAgo } from "@/lib/utils";

interface UserTableProps {
    onEdit?: (user: User) => void;
    onDelete?: (user: User) => void;
    onViewDetails?: (user: User) => void;
}

export default function UserTable({
    onEdit,
    onDelete,
    onViewDetails,
}: UserTableProps) {
    const { users, setUsers, isLoading, pagination, setPagination } =
        useAdminContext();

    const [sorting, setSorting] = useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [totalUsers, setTotalUsers] = useState(0);

    // Define columns
    const columns: ColumnDef<User>[] = React.useMemo(
        () => [
            {
                accessorKey: "name",
                header: "Tên",
                cell: ({ row }) => (
                    <div className="font-medium">{row.getValue("name")}</div>
                ),
            },
            {
                accessorKey: "email",
                header: "Email",
                cell: ({ row }) => (
                    <div>{row.getValue("email")}</div>
                ),
            },
            {
                accessorKey: "role",
                header: "Vai trò",
                cell: ({ row }) => (
                    <div>{row.getValue("role")}</div>
                ),
            },
            {
                accessorKey: "status",
                header: "Trạng thái",
                cell: ({ row }) => {
                    const status = row.getValue("status") as string;
                    return (
                        <Badge
                            variant={
                                status === "ACTIVE"
                                    ? "default"
                                    : status === "PENDING"
                                      ? "secondary"
                                      : "outline"
                            }
                        >
                            {status === "ACTIVE"
                                ? "Hoạt động"
                                : status === "PENDING"
                                  ? "Chờ xác nhận"
                                  : "Không hoạt động"}
                        </Badge>
                    );
                },
            },
            {
                accessorKey: "lastLogin",
                header: "Hoạt động gần đây",
                cell: ({ row }) => (
                    <div>{formatTimeAgo(row.getValue("lastLogin"))}</div>
                ),
            },
            {
                accessorKey: "documentsUploaded",
                header: "Tài liệu đã tải lên",
                cell: ({ row }) => (
                    <div>{row.getValue("documentsUploaded")}</div>
                ),
            },
            {
                id: "actions",
                header: "",
                cell: ({ row }) => {
                    const user = row.original;
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
                                    onClick={() => onViewDetails?.(user)}
                                >
                                    Xem chi tiết
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    onClick={() => onEdit?.(user)}
                                >
                                    Chỉnh sửa
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                    className="text-red-600"
                                    onClick={() => onDelete?.(user)}
                                >
                                    Xóa người dùng
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    );
                },
            },
        ],
        [onViewDetails, onEdit, onDelete]
    );

    // Fetch users with pagination
    const loadUsers = async () => {
        try {
            const response = await userApi.getAllUsers({
                page: pagination.pageIndex + 1,
                limit: pagination.pageSize,
            });
            setUsers(response.data);
            setTotalUsers(response.meta?.total || response.data.length);
        } catch (error: any) {
            console.error("Error fetching users:", error);
            toast.error(error.message || "Không thể tải danh sách người dùng");
        }
    };

    useEffect(() => {
        loadUsers();
    }, [pagination.pageIndex, pagination.pageSize]);

    // Refresh function
    const handleRefresh = () => {
        loadUsers();
    };

    const table = useReactTable({
        data: users,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        onPaginationChange: (updaterOrValue) => {
            if (typeof updaterOrValue === "function") {
                const newPagination = updaterOrValue(pagination);
                setPagination(newPagination);
            } else {
                setPagination(updaterOrValue);
            }
        },
        state: {
            sorting,
            columnFilters,
            pagination,
        },
        manualPagination: true,
        rowCount: totalUsers,
    });

    return (
        <div className="space-y-4">
            {/* Search/Filter */}
            <div className="flex items-center justify-between">
                <Input
                    placeholder="Tìm kiếm theo tên..."
                    value={
                        (table.getColumn("name")?.getFilterValue() as string) ??
                        ""
                    }
                    onChange={(event) =>
                        table
                            .getColumn("name")
                            ?.setFilterValue(event.target.value)
                    }
                    className="max-w-sm"
                />
                <Button
                    variant="outline"
                    onClick={handleRefresh}
                    disabled={isLoading}
                >
                    {isLoading ? "Đang tải..." : "Làm mới"}
                </Button>
            </div>

            {/* Table */}
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <TableHead
                                        key={header.id}
                                        className={
                                            header.id === "actions"
                                                ? "w-[80px]"
                                                : ""
                                        }
                                    >
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
                                    Đang tải dữ liệu...
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
                                    Không có dữ liệu.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between space-x-2 py-4">
                <div className="text-sm text-muted-foreground">
                    Hiển thị {pagination.pageIndex * pagination.pageSize + 1}{" "}
                    đến{" "}
                    {Math.min(
                        (pagination.pageIndex + 1) * pagination.pageSize,
                        totalUsers
                    )}{" "}
                    trong tổng số {totalUsers} kết quả
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-muted-foreground">Hiển thị</span>
                <select
                    value={table.getState().pagination.pageSize}
                    onChange={(e) => {
                        table.setPageSize(Number(e.target.value));
                    }}
                    className="px-2 py-1 border rounded text-sm"
                >
                    {[5, 10, 20, 30, 50].map((pageSize) => (
                        <option key={pageSize} value={pageSize}>
                            {pageSize}
                        </option>
                    ))}
                </select>
                <span className="text-sm text-muted-foreground">
                    kết quả mỗi trang
                </span>
                    <div className="flex w-[100px] items-center justify-center text-sm font-medium">
                        Trang {table.getState().pagination.pageIndex + 1} của{" "}
                        {table.getPageCount()}
                    </div>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.firstPage()}
                        disabled={!table.getCanPreviousPage() || isLoading}
                    >
                        <ChevronsLeft className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage() || isLoading}
                    >
                        <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.nextPage()}
                        disabled={!table.getCanNextPage() || isLoading}
                    >
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.lastPage()}
                        disabled={!table.getCanNextPage() || isLoading}
                    >
                        <ChevronsRight className="h-4 w-4" />
                    </Button>
                </div>
            </div>
        </div>
    );
}

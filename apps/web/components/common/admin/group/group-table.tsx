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
} from "@tanstack/react-table";
import { MoreHorizontal, Trash2, Edit, Users, UserPlus } from "lucide-react";
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";
import { Group } from "@/lib/types/group";
import { User } from "@/lib/types/user";
import { formatDateToFullOptions } from "@/lib/utils";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface GroupsTableProps {
    groups: Group[];
    users: User[];
    isLoading?: boolean;
    onEdit: (group: Group) => void;
    onDelete: (groupId: string) => void;
}

export function GroupsTable({
    groups,
    users,
    isLoading = false,
    onEdit,
    onDelete,
}: GroupsTableProps) {
    const [sorting, setSorting] = useState<SortingState>([]);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [groupToDelete, setGroupToDelete] = useState<Group | null>(null);
    const [pagination, setPagination] = useState({
        pageIndex: 0,
        pageSize: 10,
    });

    const handleDeleteClick = (group: Group) => {
        setGroupToDelete(group);
        setDeleteDialogOpen(true);
    };

    const handleConfirmDelete = () => {
        if (groupToDelete) {
            onDelete(groupToDelete.id);
            setDeleteDialogOpen(false);
            setGroupToDelete(null);
        }
    };

    const getUserName = (userId: string | undefined) => {
        if (!userId) return "Unknown";
        const user = users.find((u) => u.id === userId);
        return user ? user.name : "Unknown";
    };

    const columns: ColumnDef<Group>[] = [
        {
            accessorKey: "name",
            header: "Name",
            cell: ({ row }) => {
                return <div className="font-medium">{row.original.name}</div>;
            },
        },
        {
            accessorKey: "description",
            header: "Description",
        },
        {
            accessorKey: "members",
            header: "Members",
            cell: ({ row }) => {
                const members = row.original.members;
                return (
                    <div className="flex -space-x-2">
                        {(members ?? []).slice(0, 3).map((member) => {
                            const userId =
                                typeof member === "string"
                                    ? member
                                    : member.user_id;
                            const user = users.find((u) => u.id === userId);
                            return (
                                <Avatar
                                    key={userId}
                                    className="h-8 w-8 border-2 border-background"
                                >
                                    <AvatarImage
                                        src={user?.avatar || "/placeholder.svg"}
                                        alt={user?.name}
                                    />
                                    <AvatarFallback>
                                        {user?.name?.charAt(0)}
                                    </AvatarFallback>
                                </Avatar>
                            );
                        })}
                        {(members?.length ?? 0) > 3 && (
                            <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-background bg-muted text-xs font-medium">
                                +{(members?.length ?? 0) - 3}
                            </div>
                        )}
                    </div>
                );
            },
        },
        {
            accessorKey: "createdBy",
            header: "Created By",
            cell: ({ row }) => {
                return getUserName(row.original.createdBy);
            },
        },
        {
            accessorKey: "createdAt",
            header: "Created",
            cell: ({ row }) => {
                return formatDateToFullOptions(row.original.created_at);
            },
        },
        {
            id: "actions",
            cell: ({ row }) => {
                const group = row.original; // Lấy group từ row
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
                            <DropdownMenuItem onClick={() => onEdit(group)}>
                                <Edit className="mr-2 h-4 w-4" />
                                <span>Edit Group</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                                <UserPlus className="mr-2 h-4 w-4" />
                                <span>Add Members</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                                <Users className="mr-2 h-4 w-4" />
                                <span>View Members</span>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                                className="text-red-600"
                                onClick={() => handleDeleteClick(group)}
                            >
                                <Trash2 className="mr-2 h-4 w-4" />
                                <span>Delete Group</span>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                );
            },
        },
    ];

    const table = useReactTable({
        data: groups,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        onPaginationChange: setPagination,
        state: {
            pagination,
            sorting,
        },
        onSortingChange: setSorting,
        getSortedRowModel: getSortedRowModel(),
        manualPagination: false,
    });

    return (
        <div className="flex flex-col gap-4">
            <div className="rounded-md border">
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
                                    No groups found.
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
                        groups.length
                    )}{" "}
                    of {groups.length} groups
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

                        <PaginationItem>
                            <PaginationNext
                                onClick={() => table.nextPage()}
                                disabled={!table.getCanNextPage()}
                            />
                        </PaginationItem>
                    </PaginationContent>
                </Pagination>
            </div>
            <AlertDialog
                open={deleteDialogOpen}
                onOpenChange={setDeleteDialogOpen}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Bạn chắc chứ?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Hành động này sẽ xóa vĩnh viễn thẻ "
                            {groupToDelete?.name}". Hành động này không thể khôi
                            phục.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleConfirmDelete}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}

"use client";

import { useState, useEffect } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
    Users,
    Calendar,
    UserMinus,
    Crown,
    User,
    AlertCircle,
    Mail,
    UserCheck,
} from "lucide-react";
import { useAdminContext } from "@/contexts/adminContext";
import { Group, Member } from "@/lib/types/group";
import groupApi from "@/lib/apis/groupApi";
import { toast } from "sonner";
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
import { formatDateToFullOptions } from "@/lib/utils";

interface GroupDetailDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    group: Group | null;
    onGroupUpdate?: (updatedGroup: Group) => void;
}

export function GroupDetailDialog({
    open,
    onOpenChange,
    group,
    onGroupUpdate,
}: GroupDetailDialogProps) {
    const { users, setGroups, groups } = useAdminContext();
    const [isLoading, setIsLoading] = useState(false);
    const [groupDetails, setGroupDetails] = useState<Group | null>(null);
    const [removingMemberId, setRemovingMemberId] = useState<string | null>(
        null
    );
    const [showRemoveAlert, setShowRemoveAlert] = useState(false);
    const [memberToRemove, setMemberToRemove] = useState<Member | null>(null);

    // Fetch group details when dialog opens
    useEffect(() => {
        if (open && group?.id) {
            fetchGroupDetails(group.id);
        }
    }, [open, group?.id]);

    const fetchGroupDetails = async (groupId: string) => {
        setIsLoading(true);
        try {
            const response = await groupApi.getGroupById(groupId);
            setGroupDetails(response);
        } catch (error) {
            toast.error("Lỗi khi lấy thông tin chi tiết nhóm");
            console.error("Failed to fetch group details:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleRemoveMember = (member: Member) => {
        setMemberToRemove(member);
        setShowRemoveAlert(true);
    };

    const confirmRemoveMember = async () => {
        if (!memberToRemove || !groupDetails) return;

        setRemovingMemberId(memberToRemove.user_id);
        try {
            await groupApi.removeMember(
                groupDetails.id,
                memberToRemove.user_id
            );

            // Update local state
            const updatedGroup = {
                ...groupDetails,
                members:
                    groupDetails.members?.filter(
                        (m) => m.user_id !== memberToRemove.user_id
                    ) || [],
            };
            setGroupDetails(updatedGroup);

            // Update global state
            setGroups(
                groups.map((g) => (g.id === groupDetails.id ? updatedGroup : g))
            );

            toast.success("Đã xóa thành viên khỏi nhóm");
            onGroupUpdate?.(updatedGroup);
        } catch (error) {
            toast.error("Lỗi khi xóa thành viên");
            console.error("Failed to remove member:", error);
        } finally {
            setRemovingMemberId(null);
            setShowRemoveAlert(false);
            setMemberToRemove(null);
        }
    };

    const getUserById = (userId: string) => {
        return users.find((user) => user.id === userId);
    };

    const getRoleIcon = (role: string) => {
        switch (role) {
            case "ADMIN":
                return <Crown className="h-4 w-4" />;
            default:
                return <User className="h-4 w-4" />;
        }
    };

    const getRoleBadgeVariant = (role: string) => {
        switch (role) {
            case "ADMIN":
                return "default";
            default:
                return "outline";
        }
    };

    if (!groupDetails && !isLoading) return null;

    return (
        <>
            <Dialog open={open} onOpenChange={onOpenChange}>
                <DialogContent className="sm:max-w-[700px] max-h-[90vh]">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <Users className="h-5 w-5" />
                            Chi tiết nhóm
                        </DialogTitle>
                        <DialogDescription>
                            Xem thông tin chi tiết và quản lý thành viên của
                            nhóm
                        </DialogDescription>
                    </DialogHeader>

                    {isLoading ? (
                        <div className="flex items-center justify-center py-8">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                        </div>
                    ) : groupDetails ? (
                        <ScrollArea className="max-h-[60vh] pr-4">
                            <div className="space-y-6">
                                {/* Group Information */}
                                <div className="space-y-4">
                                    <div>
                                        <h3 className="text-lg font-semibold">
                                            {groupDetails.name}
                                        </h3>
                                        {groupDetails.description && (
                                            <p className="text-muted-foreground mt-1">
                                                {groupDetails.description}
                                            </p>
                                        )}
                                    </div>

                                    <div className="grid grid-cols-2 gap-4 text-sm">
                                        <div className="flex items-center gap-2">
                                            <Users className="h-4 w-4 text-muted-foreground" />
                                            <span className="text-muted-foreground">
                                                Thành viên:
                                            </span>
                                            <Badge variant="secondary">
                                                {groupDetails.members?.length ||
                                                    0}
                                            </Badge>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Calendar className="h-4 w-4 text-muted-foreground" />
                                            <span className="text-muted-foreground">
                                                Tạo lúc:
                                            </span>
                                            <span className="text-xs">
                                                {groupDetails.created_at &&
                                                    formatDateToFullOptions(
                                                        groupDetails.created_at
                                                    )}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <Separator />

                                {/* Members List */}
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <h4 className="font-medium flex items-center gap-2">
                                            <Users className="h-4 w-4" />
                                            Danh sách thành viên
                                        </h4>
                                        <Badge variant="outline">
                                            {groupDetails.members?.length || 0}{" "}
                                            thành viên
                                        </Badge>
                                    </div>

                                    {groupDetails.members &&
                                    groupDetails.members.length > 0 ? (
                                        <div className="space-y-3">
                                            {groupDetails.members.map(
                                                (member) => {
                                                    const user = getUserById(
                                                        member.user_id
                                                    );
                                                    return (
                                                        <div
                                                            key={member.user_id}
                                                            className="flex items-center justify-between p-3 rounded-lg border bg-card"
                                                        >
                                                            <div className="flex items-center gap-3 flex-1 min-w-0">
                                                                <Avatar className="h-10 w-10">
                                                                    <AvatarImage
                                                                        src={
                                                                            user?.avatar ||
                                                                            "/placeholder.svg"
                                                                        }
                                                                        alt={
                                                                            user?.name ||
                                                                            "Unknown"
                                                                        }
                                                                    />
                                                                    <AvatarFallback>
                                                                        {user?.name
                                                                            ?.charAt(
                                                                                0
                                                                            )
                                                                            .toUpperCase() ||
                                                                            "?"}
                                                                    </AvatarFallback>
                                                                </Avatar>
                                                                <div className="flex-1 min-w-0">
                                                                    <div className="flex items-center gap-2">
                                                                        <p className="font-medium truncate">
                                                                            {user?.name ||
                                                                                "Người dùng không tồn tại"}
                                                                        </p>
                                                                        <Badge
                                                                            variant={getRoleBadgeVariant(
                                                                                member.role
                                                                            )}
                                                                            className="flex items-center gap-1 text-xs"
                                                                        >
                                                                            {getRoleIcon(
                                                                                member.role
                                                                            )}
                                                                            {
                                                                                member.role
                                                                            }
                                                                        </Badge>
                                                                    </div>
                                                                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                                                        <Mail className="h-3 w-3" />
                                                                        <span className="truncate">
                                                                            {user?.email ||
                                                                                "Email không khả dụng"}
                                                                        </span>
                                                                    </div>
                                                                    {member.joined_at && (
                                                                        <p className="text-xs text-muted-foreground">
                                                                            Tham
                                                                            gia:{" "}
                                                                            {formatDateToFullOptions(
                                                                                member.joined_at
                                                                            )}
                                                                        </p>
                                                                    )}
                                                                </div>
                                                            </div>

                                                            {member.role !==
                                                                "ADMIN" && (
                                                                <Button
                                                                    variant="ghost"
                                                                    size="sm"
                                                                    onClick={() =>
                                                                        handleRemoveMember(
                                                                            member
                                                                        )
                                                                    }
                                                                    disabled={
                                                                        removingMemberId ===
                                                                        member.user_id
                                                                    }
                                                                    className="text-destructive hover:text-destructive hover:bg-destructive/10"
                                                                >
                                                                    {removingMemberId ===
                                                                    member.user_id ? (
                                                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
                                                                    ) : (
                                                                        <UserMinus className="h-4 w-4" />
                                                                    )}
                                                                </Button>
                                                            )}
                                                        </div>
                                                    );
                                                }
                                            )}
                                        </div>
                                    ) : (
                                        <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
                                            <Users className="h-12 w-12 mb-3 opacity-50" />
                                            <p className="text-sm">
                                                Nhóm chưa có thành viên nào
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </ScrollArea>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
                            <AlertCircle className="h-12 w-12 mb-3 opacity-50" />
                            <p className="text-sm">
                                Không thể tải thông tin nhóm
                            </p>
                        </div>
                    )}

                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                        >
                            Đóng
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Remove Member Confirmation Dialog */}
            <AlertDialog
                open={showRemoveAlert}
                onOpenChange={setShowRemoveAlert}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            Xác nhận xóa thành viên
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            Bạn có chắc chắn muốn xóa thành viên "
                            {getUserById(memberToRemove?.user_id || "")?.name}"
                            khỏi nhóm "{groupDetails?.name}"? Hành động này
                            không thể hoàn tác.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Hủy</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={confirmRemoveMember}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                            Xóa thành viên
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}

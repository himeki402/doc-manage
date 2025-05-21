"use client";

import { useState } from "react";
import { PlusIcon } from "lucide-react";
import { toast } from "sonner";
import { DashboardHeader } from "@/components/common/admin/admin-dashboard-header";
import { useAdminContext } from "@/contexts/adminContext";
import { Group } from "@/lib/types/group";
import groupApi from "@/lib/apis/groupApi";
import { GroupsTable } from "@/components/common/admin/group/group-table";
import { CreateGroupDialog } from "@/components/common/admin/group/create-group-dialog";

export default function GroupsPage() {
    const { groups, setGroups, users } = useAdminContext();

    const [showGroupDialog, setShowGroupDialog] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [editingGroup, setEditingGroup] = useState<Group | null>(null);

    const handleAddgroup = () => {
        setEditingGroup(null);
        setShowGroupDialog(true);
    };

    const handleEditgroup = (group: Group) => {
        setEditingGroup(group);
        setShowGroupDialog(true);
    };

    const handleDeletegroup = async (groupId: string) => {
        try {
            await groupApi.deleteGroup(groupId);
            setGroups(groups.filter((group) => group.id !== groupId));
            toast.success("Xóa group thành công");
        } catch (error) {
            toast.error("Xóa group thất bại");
        }
    };

    const handleSavegroup = async (group: Group) => {
        try {
            if (group.id) {
                await groupApi.updateGroup(group.id, {
                    name: group.name,
                    description: group.description,
                });
                setGroups(
                    groups.map((t) => (t.id === group.id ? { ...t, ...group } : t))
                );
                toast.success("Đã chỉnh sửa group thành công");
            } else {
                const response = await groupApi.createGroup({
                    name: group.name,
                    description: group.description,
                });
                setGroups([...groups, { ...response }]);
                toast.success("Tạo group thành công");
            }
            setShowGroupDialog(false);
            setEditingGroup(null);
        } catch (error: any) {
            console.error("Failed to save group:", error);
            toast.error(error.message || "Failed to save group");
        }
    };
    return (
        <div className="space-y-6">
            <DashboardHeader
                title="Quản lý nhóm"
                description="Quản lý nhóm người dùng."
                actionLabel="Thêm group"
                actionIcon={PlusIcon}
                onAction={handleAddgroup}
            />
            <GroupsTable
                groups={groups}
                users={users}
                isLoading={false}
                onEdit={handleEditgroup}
                onDelete={handleDeletegroup}
            />
            <CreateGroupDialog
                open={showGroupDialog}
                onOpenChange={setShowGroupDialog}
                onSave={handleSavegroup}
            />
        </div>
    );
}

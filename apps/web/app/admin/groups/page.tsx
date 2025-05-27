"use client";

import { useState } from "react";
import { Edit, PlusIcon } from "lucide-react";
import { toast } from "sonner";
import { DashboardHeader } from "@/components/common/admin/admin-dashboard-header";
import { useAdminContext } from "@/contexts/adminContext";
import { AddMember, Group } from "@/lib/types/group";
import groupApi from "@/lib/apis/groupApi";
import { GroupsTable } from "@/components/common/admin/group/group-table";
import { GroupDialog } from "@/components/common/admin/group/group-dialog";
import { AddMemberDialog } from "@/components/common/admin/group/add-member-dialog";
import { GroupDetailDialog } from "@/components/common/admin/group/group-detail";

export default function GroupsPage() {
    const { groups, setGroups, users, isLoading } = useAdminContext();

    const [showGroupDialog, setShowGroupDialog] = useState(false);
    const [editingGroup, setEditingGroup] = useState<Group | null>(null);
    const [showAddMemberDialog, setShowAddMemberDialog] = useState(false);
    const [showDetailGroupDialog, setShowDetailGroupDialog] = useState(false);
    const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);

    const handleAddGroup = () => {
        setEditingGroup(null);
        setShowGroupDialog(true);
    };

    const handleAddMember = (group: Group) => {
        setSelectedGroup(group);
        setShowAddMemberDialog(true);
    };

    const handleEditGroup = (group: Group) => {
        setEditingGroup(group);
        setShowGroupDialog(true);
    };

    const handleViewDetail = (group: Group) => {
        setSelectedGroup(group);
        setShowDetailGroupDialog(true);
    };

    const handleDeleteGroup = async (groupId: string) => {
        try {
            await groupApi.deleteGroup(groupId);
            setGroups(groups.filter((group: Group) => group.id !== groupId));
            toast.success("Xóa group thành công");
        } catch (error) {
            toast.error("Xóa group thất bại");
        }
    };

    const handleSaveGroup = async (group: Group) => {
        try {
            if (editingGroup) {
                const updatedGroup = await groupApi.updateGroup(
                    editingGroup.id,
                    group
                );
                setGroups(
                    groups.map((g) => (g.id === updatedGroup.id ? updatedGroup : g))
                );
            } else {
                const newGroup = await groupApi.createGroup(group);
                setGroups([...groups, newGroup]);
            }
            setShowGroupDialog(false);
        } catch (error) {
            toast.error("Lưu thất bại");
        }
    };
    const handleConfirmAddMember = async (
        groupId: string,
        members: AddMember[]
    ) => {
        try {
            await groupApi.addMultipleMember(groupId, members);

            const updatedGroup = await groupApi.getGroupById(groupId);
            setGroups(groups.map((g) => (g.id === groupId ? updatedGroup : g)));

            toast.success("Thêm thành viên thành công");
            setShowAddMemberDialog(false);
        } catch (error) {
            toast.error("Thêm thành viên thất bại");
        }
    };

    const handleGroupUpdate = (updatedGroup: Group) => {
        setGroups(
            groups.map((g) => (g.id === updatedGroup.id ? updatedGroup : g))
        );
    };

    return (
        <div className="space-y-6">
            <DashboardHeader
                title="Quản lý nhóm"
                description="Quản lý nhóm người dùng."
                actionLabel="Thêm group"
                actionIcon={PlusIcon}
                onAction={handleAddGroup}
            />

            <GroupsTable
                groups={groups}
                users={users}
                isLoading={isLoading}
                onEdit={handleEditGroup}
                onDelete={handleDeleteGroup}
                onAddMember={handleAddMember}
                onViewDetail={handleViewDetail}
            />

            {/* Group Create/Edit Dialog */}
            <GroupDialog
                open={showGroupDialog}
                onOpenChange={setShowGroupDialog}
                onSave={handleSaveGroup}
                group={editingGroup}
            />

            {/* Add Member Dialog */}
            <AddMemberDialog
                open={showAddMemberDialog}
                onOpenChange={setShowAddMemberDialog}
                onSubmit={handleConfirmAddMember}
                group={selectedGroup}
            />

            {/* Group Detail Dialog */}
            <GroupDetailDialog
                open={showDetailGroupDialog}
                onOpenChange={setShowDetailGroupDialog}
                group={selectedGroup}
                onGroupUpdate={handleGroupUpdate}
            />
        </div>
    );
}

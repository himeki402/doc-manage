"use client";

import { useEffect, useState } from "react";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    FileText,
    FolderIcon,
    Plus,
    Search,
    Share2,
    Users,
    Loader2,
} from "lucide-react";
import groupApi from "@/lib/apis/groupApi";
import { Group } from "@/lib/types/group";
import { GroupDetail } from "./group-detail";
import { toast } from "sonner";

export function GroupDocumentTab() {
    const [groups, setGroups] = useState<Group[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
    const [showCreateGroupDialog, setShowCreateGroupDialog] = useState(false);
    const [showInviteDialog, setShowInviteDialog] = useState(false);
    const [newGroupName, setNewGroupName] = useState("");
    const [newGroupDescription, setNewGroupDescription] = useState("");
    const [inviteEmail, setInviteEmail] = useState("");
    const [creating, setCreating] = useState(false);
    const [inviting, setInviting] = useState(false);

    useEffect(() => {
        getGroups();
    }, []);

    const loadGroupDetails = async (groupId: string) => {
        try {
            const group = await groupApi.getGroupById(groupId);
            setSelectedGroup(group);
        } catch (error) {
            toast.error("Không thể tải chi tiết nhóm");
        }
    };

    const getGroups = async () => {
        try {
            setLoading(true);
            const response = await groupApi.getMygroups();
            setGroups(response.data);
            setLoading(false);
            return response;
        } catch (error) {
            setLoading(false);
            console.log(error);
        }
    };

    const filteredGroups = groups.filter(
        (group) =>
            group.name.includes(searchTerm) ||
            group.description.includes(searchTerm)
    );

    const handleCreateGroup = async () => {
        if (!newGroupName.trim()) {
            toast.error("Vui lòng nhập tên nhóm");
            return;
        }

        try {
            setCreating(true);
            const response = await groupApi.createGroup({
                name: newGroupName,
                description: newGroupDescription,
            });

            setGroups((prev) => [...prev, response]);
            setNewGroupName("");
            setNewGroupDescription("");
            setShowCreateGroupDialog(false);
            toast.success("Tạo nhóm thành công");
        } catch (error) {
            console.error("Error creating group:", error);
            toast.error("Không thể tạo nhóm");
        } finally {
            setCreating(false);
        }
    };
    // Xử lý mời thành viên
    const handleInviteMember = async () => {
        if (!inviteEmail.trim() || !selectedGroup) {
            toast.error("Vui lòng nhập email");
            return;
        }
        try {
            setInviting(true);
            const updatedGroup = await groupApi.addMultipleMember(
                selectedGroup.id,
                [{ email: inviteEmail }]
            );

            setSelectedGroup(updatedGroup);
            setGroups((prev) =>
                prev.map((g) => (g.id === updatedGroup.id ? updatedGroup : g))
            );
            setInviteEmail("");
            setShowInviteDialog(false);
            toast.success("Mời thành viên thành công");
        } catch (error) {
            console.error("Error inviting member:", error);
            toast.error("Không thể mời thành viên");
        } finally {
            setInviting(false);
        }
    };

    const handleRemoveMember = async (memberId: string) => {
        if (!selectedGroup) return;

        try {
            await groupApi.removeMember(selectedGroup.id, memberId);

            // Reload group details
            await loadGroupDetails(selectedGroup.id);
            toast.success("Xóa thành viên thành công");
        } catch (error) {
            console.error("Error removing member:", error);
            toast.error("Không thể xóa thành viên");
        }
    };

    const getRoleText = (role: string) => {
        switch (role) {
            case "OWNER":
                return "Chủ nhóm";
            case "ADMIN":
                return "Quản trị viên";
            case "MEMBER":
                return "Thành viên";
            default:
                return "Thành viên";
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center p-8">
                <Loader2 className="h-8 w-8 animate-spin" />
                <span className="ml-2">Đang tải...</span>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {/* Header và tìm kiếm */}
            <div className="flex flex-col md:flex-row justify-between gap-4">
                <div className="flex-1">
                    <h2 className="text-2xl font-bold mb-2">Nhóm tài liệu</h2>
                    <p className="text-muted-foreground">
                        Quản lý và truy cập tài liệu theo nhóm
                    </p>
                </div>
                <div className="flex gap-2 items-start">
                    <div className="relative">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            type="search"
                            placeholder="Tìm kiếm nhóm..."
                            className="pl-9 w-[250px]"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <Dialog
                        open={showCreateGroupDialog}
                        onOpenChange={setShowCreateGroupDialog}
                    >
                        <DialogTrigger asChild>
                            <Button>
                                <Plus className="mr-2 h-4 w-4" /> Tạo nhóm mới
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Tạo nhóm mới</DialogTitle>
                                <DialogDescription>
                                    Tạo một nhóm mới để chia sẻ và quản lý tài
                                    liệu cùng nhau.
                                </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4 py-4">
                                <div className="space-y-2">
                                    <Label htmlFor="group-name">Tên nhóm</Label>
                                    <Input
                                        id="group-name"
                                        placeholder="Nhập tên nhóm"
                                        value={newGroupName}
                                        onChange={(e) =>
                                            setNewGroupName(e.target.value)
                                        }
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="group-description">
                                        Mô tả
                                    </Label>
                                    <Textarea
                                        id="group-description"
                                        placeholder="Nhập mô tả về nhóm"
                                        value={newGroupDescription}
                                        onChange={(e) =>
                                            setNewGroupDescription(
                                                e.target.value
                                            )
                                        }
                                    />
                                </div>
                            </div>
                            <DialogFooter>
                                <Button
                                    variant="outline"
                                    onClick={() =>
                                        setShowCreateGroupDialog(false)
                                    }
                                >
                                    Hủy
                                </Button>
                                <Button
                                    onClick={handleCreateGroup}
                                    disabled={creating}
                                >
                                    {creating && (
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    )}
                                    Tạo nhóm
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            {/* Danh sách nhóm hoặc chi tiết nhóm */}
            {selectedGroup ? (
                <GroupDetail
                    documents={selectedGroup.documents || []}
                    members={selectedGroup.members || []}
                    group={selectedGroup}
                    onBack={() => setSelectedGroup(null)}
                    onShowInviteDialog={() => setShowInviteDialog(true)}
                    onRemoveMember={handleRemoveMember}
                />
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredGroups.map((group) => (
                        <Card key={group.id} className="overflow-hidden">
                            <CardHeader className="pb-2">
                                <CardTitle className="flex justify-between items-start">
                                    <span className="truncate">
                                        {group.name}
                                    </span>
                                    {group.isAdmin && (
                                        <Badge
                                            variant="outline"
                                            className="bg-blue-50 text-blue-700 border-blue-200"
                                        >
                                            Chủ nhóm
                                        </Badge>
                                    )}
                                </CardTitle>
                                <CardDescription className="line-clamp-2">
                                    {group.description}
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="pb-2">
                                <div className="flex items-center justify-between text-sm text-muted-foreground">
                                    <div className="flex items-center">
                                        <Users className="h-4 w-4 mr-1" />
                                        <span>
                                            {group.memberCount} thành viên
                                        </span>
                                    </div>
                                    <div className="flex items-center">
                                        <FileText className="h-4 w-4 mr-1" />
                                        <span>
                                            {group.documentCount} tài liệu
                                        </span>
                                    </div>
                                </div>
                            </CardContent>
                            <CardFooter className="pt-0 flex justify-between">
                                <Button variant="ghost" size="sm">
                                    <Share2 className="h-4 w-4 mr-1" /> Chia sẻ
                                </Button>
                                <Button
                                    variant="default"
                                    size="sm"
                                    onClick={() => loadGroupDetails(group.id)}
                                >
                                    Xem chi tiết
                                </Button>
                            </CardFooter>
                        </Card>
                    ))}

                    {filteredGroups.length === 0 && (
                        <div className="col-span-full flex flex-col items-center justify-center p-8 text-center bg-muted/50 rounded-lg">
                            <FolderIcon className="h-12 w-12 text-muted-foreground mb-4" />
                            <h3 className="text-lg font-medium">
                                Không tìm thấy nhóm nào
                            </h3>
                            <p className="text-muted-foreground mt-2 mb-4">
                                {searchTerm
                                    ? `Không tìm thấy nhóm nào phù hợp với "${searchTerm}"`
                                    : "Bạn chưa tham gia nhóm nào. Hãy tạo nhóm mới để bắt đầu."}
                            </p>
                            <Button
                                onClick={() => setShowCreateGroupDialog(true)}
                            >
                                <Plus className="mr-2 h-4 w-4" /> Tạo nhóm mới
                            </Button>
                        </div>
                    )}
                </div>
            )}

            {/* Dialog mời thành viên */}
            <Dialog open={showInviteDialog} onOpenChange={setShowInviteDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Mời thành viên</DialogTitle>
                        <DialogDescription>
                            Mời thành viên tham gia nhóm của bạn.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="invite-email">Email</Label>
                            <Input
                                id="invite-email"
                                type="email"
                                placeholder="Nhập email người dùng"
                                value={inviteEmail}
                                onChange={(e) => setInviteEmail(e.target.value)}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setShowInviteDialog(false)}
                        >
                            Hủy
                        </Button>
                        <Button
                            onClick={handleInviteMember}
                            disabled={inviting}
                        >
                            {inviting && (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            )}
                            Gửi lời mời
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}

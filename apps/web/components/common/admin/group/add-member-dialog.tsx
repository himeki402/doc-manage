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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Search, Users, UserPlus } from "lucide-react";
import { useAdminContext } from "@/contexts/adminContext";
import { Group, AddMember } from "@/lib/types/group";

interface AddMemberDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSubmit: (groupId: string, members: AddMember[]) => Promise<void>;
    group: Group | null;
}

export function AddMemberDialog({
    open,
    onOpenChange,
    onSubmit,
    group,
}: AddMemberDialogProps) {
    const { users } = useAdminContext();
    const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Reset state when dialog opens/closes or group changes
    useEffect(() => {
        if (open && group) {
            setSelectedMembers([]);
            setSearchTerm("");
        }
    }, [open, group]);

    // Filter users based on search term and exclude existing members
    const filteredUsers = users.filter((user) => {
        const matchesSearch = 
            user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase());
        
        // Exclude users who are already members of the group
        const isExistingMember = group?.members?.some(member => member.user_id === user.id);
        
        return matchesSearch && !isExistingMember;
    });

    const handleToggleMember = (userId: string) => {
        setSelectedMembers(prev => 
            prev.includes(userId)
                ? prev.filter(id => id !== userId)
                : [...prev, userId]
        );
    };

    const handleSelectAll = () => {
        if (selectedMembers.length === filteredUsers.length) {
            setSelectedMembers([]);
        } else {
            setSelectedMembers(filteredUsers.map(user => user.id));
        }
    };

    const handleSubmit = async () => {
        if (!group || selectedMembers.length === 0) return;

        setIsSubmitting(true);
        try {
            const membersToAdd: AddMember[] = selectedMembers.map(userId => ({
                userId,
                role: "member" // Default role, có thể customize nếu cần
            }));

            await onSubmit(group.id, membersToAdd);
            setSelectedMembers([]);
            setSearchTerm("");
            onOpenChange(false);
        } catch (error) {
            console.error("Failed to add members:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCancel = () => {
        setSelectedMembers([]);
        setSearchTerm("");
        onOpenChange(false);
    };

    if (!group) return null;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[600px] max-h-[80vh]">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <UserPlus className="h-5 w-5" />
                        Thêm thành viên vào nhóm
                    </DialogTitle>
                    <DialogDescription>
                        Thêm thành viên vào nhóm "{group.name}". Chọn một hoặc nhiều người dùng để thêm vào nhóm.
                    </DialogDescription>
                </DialogHeader>

                <div className="grid gap-4 py-4">
                    {/* Search Input */}
                    <div className="grid gap-2">
                        <Label htmlFor="search">Tìm kiếm người dùng</Label>
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                id="search"
                                placeholder="Tìm theo tên hoặc email..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                    </div>

                    {/* Members Selection */}
                    <div className="grid gap-2">
                        <div className="flex items-center justify-between">
                            <Label>Chọn thành viên</Label>
                            <div className="flex items-center gap-2">
                                <Badge variant="secondary" className="text-xs">
                                    Đã chọn: {selectedMembers.length}
                                </Badge>
                                {filteredUsers.length > 0 && (
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        onClick={handleSelectAll}
                                        className="h-auto p-1 text-xs"
                                    >
                                        {selectedMembers.length === filteredUsers.length ? "Bỏ chọn tất cả" : "Chọn tất cả"}
                                    </Button>
                                )}
                            </div>
                        </div>
                        
                        <div className="border rounded-md p-2 max-h-[300px] overflow-y-auto">
                            {filteredUsers.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
                                    <Users className="h-8 w-8 mb-2" />
                                    <p className="text-sm">
                                        {searchTerm 
                                            ? "Không tìm thấy người dùng nào phù hợp" 
                                            : "Tất cả người dùng đã là thành viên của nhóm này"
                                        }
                                    </p>
                                </div>
                            ) : (
                                <div className="space-y-2">
                                    {filteredUsers.map((user) => (
                                        <div
                                            key={user.id}
                                            className={`flex items-center gap-3 p-3 rounded-md cursor-pointer hover:bg-muted/50 transition-colors ${
                                                selectedMembers.includes(user.id)
                                                    ? "bg-muted border border-primary/20"
                                                    : "border border-transparent"
                                            }`}
                                            onClick={() => handleToggleMember(user.id)}
                                        >
                                            <Checkbox
                                                checked={selectedMembers.includes(user.id)}
                                                onChange={() => handleToggleMember(user.id)}
                                            />
                                            <Avatar className="h-10 w-10">
                                                <AvatarImage
                                                    src={user.avatar || "/placeholder.svg"}
                                                    alt={user.name}
                                                />
                                                <AvatarFallback>
                                                    {user.name.charAt(0).toUpperCase()}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium truncate">
                                                    {user.name}
                                                </p>
                                                <p className="text-xs text-muted-foreground truncate">
                                                    {user.email}
                                                </p>
                                            </div>
                                            {selectedMembers.includes(user.id) && (
                                                <Badge className="ml-2">
                                                    Đã chọn
                                                </Badge>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Selected Members Summary */}
                    {selectedMembers.length > 0 && (
                        <div className="bg-muted/30 rounded-md p-3">
                            <div className="flex items-center gap-2 mb-2">
                                <Users className="h-4 w-4" />
                                <span className="text-sm font-medium">
                                    Thành viên được chọn ({selectedMembers.length})
                                </span>
                            </div>
                            <div className="flex flex-wrap gap-1">
                                {selectedMembers.map((memberId) => {
                                    const user = users.find(u => u.id === memberId);
                                    return user ? (
                                        <Badge key={memberId} variant="secondary" className="text-xs">
                                            {user.name}
                                        </Badge>
                                    ) : null;
                                })}
                            </div>
                        </div>
                    )}
                </div>

                <DialogFooter>
                    <Button
                        variant="outline"
                        onClick={handleCancel}
                        disabled={isSubmitting}
                    >
                        Hủy
                    </Button>
                    <Button
                        onClick={handleSubmit}
                        disabled={selectedMembers.length === 0 || isSubmitting}
                    >
                        {isSubmitting ? "Đang thêm..." : `Thêm ${selectedMembers.length} thành viên`}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
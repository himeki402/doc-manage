"use client";

import { useEffect, useState } from "react";
import { PlusIcon } from "lucide-react";
import { toast } from "sonner";
import { DashboardHeader } from "@/components/common/admin/admin-dashboard-header";
import { TagsTable } from "@/components/common/admin/tag/tag-table";
import { useAdminContext } from "@/contexts/adminContext";
import { Tag } from "@/lib/types/tag";
import tagApi from "@/lib/apis/tagApi";
import { TagDialog } from "@/components/common/admin/tag/tag-dialog";

export default function TagsPage() {
    const { tags, setTags } = useAdminContext();

    const [showTagDialog, setShowTagDialog] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [editingTag, setEditingTag] = useState<Tag | null>(null);

    useEffect(() => {
        const fetchTags = async () => {
            if (tags.length === 0) {
                try {
                    setIsLoading(true);
                    const response = await tagApi.getAllTags();
                    setTags(response.data);
                } catch (error) {
                    toast.error("Failed to load tags");
                } finally {
                    setIsLoading(false);
                }
            } else {
                setIsLoading(false);
            }
        };
        fetchTags();
    }, [tags, setTags]);

    const handleAddTag = () => {
        setEditingTag(null);
        setShowTagDialog(true);
    };

    const handleEditTag = (tag: Tag) => {
        setEditingTag(tag);
        setShowTagDialog(true);
    };

    const handleDeleteTag = async (tagId: string) => {
        try {
            await tagApi.deleteTag(tagId);
            setTags(tags.filter((tag) => tag.id !== tagId));
            toast.success("Xóa tag thành công");
        } catch (error) {
            toast.error("Xóa tag thất bại");
        }
    };

    const handleSaveTag = async (tag: Tag) => {
        try {
            if (tag.id) {
                // Update existing tag
                await tagApi.updateTag(tag.id, {
                    name: tag.name,
                    description: tag.description,
                });
                setTags(
                    tags.map((t) => (t.id === tag.id ? { ...t, ...tag } : t))
                );
                toast.success("Đã chỉnh sửa tag thành công");
            } else {
                // Create new tag
                const response = await tagApi.createTag({
                    name: tag.name,
                    description: tag.description,
                });
                setTags([...tags, { ...response }]);
                toast.success("Tạo tag thành công");
            }
            setShowTagDialog(false);
            setEditingTag(null);
        } catch (error: any) {
            console.error("Failed to save tag:", error);
            toast.error(error.message || "Failed to save tag");
        }
    };
    return (
        <div className="space-y-6">
            <DashboardHeader
                title="Quản lý thẻ"
                description="Quản lý thẻ tài liệu."
                actionLabel="Thêm tag"
                actionIcon={PlusIcon}
                onAction={handleAddTag}
            />
            <TagsTable
                tags={tags}
                isLoading={false}
                onEdit={handleEditTag}
                onDelete={handleDeleteTag}
            />
            <TagDialog
                open={showTagDialog}
                onOpenChange={setShowTagDialog}
                onSave={handleSaveTag}
                tag={editingTag}
            />
        </div>
    );
}

"use client";

import { useEffect, useState } from "react";
import { PlusIcon } from "lucide-react";

import categoriesApi from "@/lib/apis/categoriesApi";
import { toast } from "sonner";
import { Category } from "@/lib/types/category";
import { DashboardHeader } from "@/components/common/admin/admin-dashboard-header";
import { CategoriesTable } from "@/components/common/admin/category/category-table";
import { CategoryDialog } from "@/components/common/admin/category/category-dialog";

export default function CategoriesPage() {
    const [showCategoryDialog, setShowCategoryDialog] = useState(false);
    const [categories, setCategories] = useState<Category[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [editingCategory, setEditingCategory] = useState<Category | null>(
        null
    );

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            setIsLoading(true);
            const response = await categoriesApi.getCategoriesforAdmin();
            setCategories(response.data);
        } catch (error: any) {
            console.error("Không thể lấy danh sách danh mục:", error);
            toast.error(error.message || "Không thể lấy danh sách danh mục");
        } finally {
            setIsLoading(false);
        }
    };

    const handleAddCategory = () => {
        setEditingCategory(null);
        setShowCategoryDialog(true);
    };

    const handleEditCategory = (category: Category) => {
        setEditingCategory(category);
        setShowCategoryDialog(true);
    };

    const handleDeleteCategory = async (categoryId: string) => {
        try {
            setIsLoading(true);
            await categoriesApi.deleteCategory(categoryId);
            setCategories(categories.filter((cat) => cat.id !== categoryId));
            toast.success("Xóa danh mục thành công");
        } catch (error: any) {
            console.error("Không thể xóa danh mục:", error);
            toast.error(error.message || "Không thể xóa danh mục");
        } finally {
            setIsLoading(false);
        }
    };

    const handleSaveCategory = async (category: Category) => {
        try {
            if (editingCategory) {
                const updatedCategory = await categoriesApi.updateCategory(editingCategory.id, category);
                setCategories(prevCategories => 
                    prevCategories.map(cat => 
                        cat.id === editingCategory.id ? updatedCategory : cat
                    )
                );
                toast.success("Cập nhật danh mục thành công");
            } else {
                const newCategory = await categoriesApi.createCategory(category);
                setCategories(prevCategories => [...prevCategories, newCategory]);
                toast.success("Thêm danh mục thành công");
            }
            setShowCategoryDialog(false);
        } catch (error: any) {
            console.error("Không thể lưu danh mục:", error);
            toast.error(error.message || "Không thể lưu danh mục");
        }
    }

    return (
        <div className="space-y-6">
            <DashboardHeader
                title="Quản lý danh mục"
                description="Quản lý danh mục tài liệu."
                actionLabel="Thêm danh mục"
                actionIcon={PlusIcon}
                onAction={handleAddCategory}
            />

            <CategoriesTable
                categories={categories}
                isLoading={isLoading}
                onEdit={handleEditCategory}
                onDelete={handleDeleteCategory}
            />

            <CategoryDialog
                open={showCategoryDialog}
                onOpenChange={setShowCategoryDialog}
                onSave={handleSaveCategory}
                category={editingCategory}
                categories={categories}
            />
        </div>
    );
}

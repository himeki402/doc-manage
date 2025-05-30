'use client'
import { Category } from "@/lib/types/category";
import { Group } from "@/lib/types/group";
import { Tag } from "@/lib/types/tag";
import { createContext, useContext, useEffect, useState, ReactNode, Dispatch, SetStateAction } from "react";
import categoriesApi from "@/lib/apis/categoriesApi";
import tagApi from "@/lib/apis/tagApi";
import { toast } from "sonner";
import groupApi from "@/lib/apis/groupApi";
import documentApi from "@/lib/apis/documentApi";
import { Document } from "@/lib/types/document";

interface DashboardContextType {
    categories: Category[];
    setCategories: Dispatch<SetStateAction<Category[]>>;
    tags: Tag[];
    setTags: Dispatch<SetStateAction<Tag[]>>;
    groups: Group[];
    setGroups: Dispatch<SetStateAction<Group[]>>;
    isLoading: boolean;
    recentUploads: Document[];
    setRecentUploads: Dispatch<SetStateAction<Document[]>>;
}

const DashboardContext = createContext<DashboardContextType | null>(null);

export function DashboardProvider({ children }: { children: ReactNode }) {
    const [categories, setCategories] = useState<Category[]>([]);
    const [tags, setTags] = useState<Tag[]>([]);
    const [groups, setGroups] = useState<Group[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [recentUploads, setRecentUploads] = useState<Document[]>([]);

    useEffect(() => {
        const fetchInitialData = async () => {
            setIsLoading(true);
            try {
                const [categoriesResponse, tagsResponse, groupsResponse, recentUploadsResponse] =
                    await Promise.all([
                        categoriesApi.getCategoriesforAdmin(),
                        tagApi.getAllTags(),
                        groupApi.getMygroups(),
                        documentApi.getMyDocuments({ page: 1, limit: 5 }),
                    ]);
                
                setCategories(categoriesResponse.data || []);
                setTags(tagsResponse.data || []);
                setGroups(groupsResponse.data || []);
                setRecentUploads(recentUploadsResponse.data || []);
            } catch (error) {
                console.error("Gặp lỗi khi tải dữ liệu ban đầu:", error);
                toast.error("Không thể tải dữ liệu ban đầu");
                
                // Set empty arrays as fallback
                setCategories([]);
                setTags([]);
                setGroups([]);
                setRecentUploads([]);
            } finally {
                setIsLoading(false);
            }
        };

        fetchInitialData();
    }, []);

    return (
        <DashboardContext.Provider
            value={{
                categories,
                setCategories,
                tags,
                setTags,
                groups,
                setGroups,
                isLoading,
                recentUploads,
                setRecentUploads,
            }}
        >
            {children}
        </DashboardContext.Provider>
    );
}

export function useDashboardContext() {
    const context = useContext(DashboardContext);
    if (!context) {
        throw new Error(
            "useDashboardContext phải được sử dụng trong DashboardProvider"
        );
    }
    return context;
}
import { Category } from "@/lib/types/category";
import { AccessType, Document } from "@/lib/types/document";
import { Group } from "@/lib/types/group";
import { Tag } from "@/lib/types/tag";
import { User } from "@/lib/types/user";
import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./authContext";
import documentApi from "@/lib/apis/documentApi";
import categoriesApi from "@/lib/apis/categoriesApi";
import userApi from "@/lib/apis/userApi";
import tagApi from "@/lib/apis/tagApi";
import { toast } from "sonner";

interface AdminContextType {
    //documents
    documents: Document[];
    setDocuments: (documents: Document[]) => void;
    filteredDocuments: Document[];
    setFilteredDocuments: (documents: Document[]) => void;
    selectedDocument: Document | null;
    setSelectedDocument: (document: Document | null) => void;

    //Users
    users: User[];
    setUsers: (users: User[]) => void;

    //Categories
    categories: Category[];
    setCategories: (categories: Category[]) => void;

    //Tags
    tags: Tag[];
    setTags: (tags: Tag[]) => void;

    // Group
    groups: Group[];
    setGroups: (groups: Group[]) => void;

    //Filters
    filters: {
        accessType: AccessType | "all";
        category: string | "all";
        tag: string | "all";
        group: string | "all";
    };
    setFilters: (filters: {
        accessType?: AccessType | "all";
        category?: string | "all";
        tag?: string | "all";
        group?: string | "all";
    }) => void;

    // Current user
    currentUser: User;
    // Pagination
    pagination: {
        pageIndex: number;
        pageSize: number;
    };
    setPagination: (pagination: {
        pageIndex?: number;
        pageSize?: number;
    }) => void;
    totalDocuments: number;
    setTotalDocuments: (total: number) => void;
    // Modals
    isDocumentModalOpen: boolean;
    setIsDocumentModalOpen: (isOpen: boolean) => void;
    isShareModalOpen: boolean;
    setIsShareModalOpen: (isOpen: boolean) => void;
    isVersionModalOpen: boolean;
    setIsVersionModalOpen: (isOpen: boolean) => void;
    isDetailsModalOpen: boolean;
    setIsDetailsModalOpen: (isOpen: boolean) => void;
    isLoading: boolean;
}

const AdminContext = createContext<AdminContextType | null>(null);

export function AdminProvider({ children }: { children: React.ReactNode }) {
    // Document state
    const [documents, setDocuments] = useState<Document[]>([]);
    const [filteredDocuments, setFilteredDocuments] = useState<Document[]>([]);
    const [selectedDocument, setSelectedDocument] = useState<Document | null>(
        null
    );
    // User state
    const [users, setUsers] = useState<User[]>([]);
    // Category state
    const [categories, setCategories] = useState<Category[]>([]);
    // Tag state
    const [tags, setTags] = useState<Tag[]>([]);
    // Group state
    const [groups, setGroups] = useState<Group[]>([]);
    // Modal state
    const [isDocumentModalOpen, setIsDocumentModalOpen] = useState(false);
    const [isShareModalOpen, setIsShareModalOpen] = useState(false);
    const [isVersionModalOpen, setIsVersionModalOpen] = useState(false);
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
    const [totalDocuments, setTotalDocuments] = useState(0);
    const [isLoading, setIsLoading] = useState(false);

    //Current user
    const { user } = useAuth();
    const currentUser = user as User;

    // Pagination state
    const [pagination, setPagination] = useState({
        pageIndex: 0,
        pageSize: 10,
    });

    // filters state
    const [filters, setFilters] = useState({
        accessType: "all" as AccessType | "all",
        category: "all" as string | "all",
        tag: "all" as string | "all",
        group: "all" as string | "all",
    });

    useEffect(() => {
        const fetchInitialData = async () => {
            setIsLoading(true);
            try {
                const documentsResponse = await documentApi.getAllDocuments({
                    page: pagination.pageIndex + 1,
                    limit: pagination.pageSize,
                    accessType: filters.accessType,
                    categoryId: filters.category,
                    tag: filters.tag,
                    group: filters.group,
                });
                setDocuments(documentsResponse.data);
                setFilteredDocuments(documentsResponse.data);
                setTotalDocuments(documentsResponse.meta.total);

                const categoriesResponse =
                    await categoriesApi.getCategoriesforAdmin();
                setCategories(categoriesResponse.data);

                const usersResponse = await userApi.getAllUsers();
                setUsers(usersResponse.data);

                const tagsResponse = await tagApi.getAlltag();
                setTags(tagsResponse.data);
            } catch (error) {
                console.error("Error fetching initial data:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchInitialData();
    }, []);

    useEffect(() => {
        const fetchFilteredDocuments = async () => {
            setIsLoading(true);
            try {
                const response = await documentApi.getAllDocuments({
                    page: pagination.pageIndex + 1,
                    limit: pagination.pageSize,
                    accessType: filters.accessType,
                    categoryId: filters.category,
                    tag: filters.tag,
                    group: filters.group,
                });
                setFilteredDocuments(response.data);
                setTotalDocuments(response.meta.total);
            } catch (error: any) {
                console.error("Lỗi khi lấy tài liệu đã lọc:", error);
                toast.error(error.message || "Không thể lấy tài liệu");
            } finally {
                setIsLoading(false);
            }
        };

        fetchFilteredDocuments();
    }, [filters, pagination]);

    const updatePagination = (newPagination: {
        pageIndex?: number;
        pageSize?: number;
    }) => {
        setPagination({ ...pagination, ...newPagination });
    };

    const updateFilters = (newFilters: {
        accessType?: AccessType | "all";
        category?: string | "all";
        tag?: string | "all";
        group?: string | "all";
    }) => {
        setFilters({ ...filters, ...newFilters });
        setPagination({ ...pagination, pageIndex: 0 });
    };

    return (
        <AdminContext.Provider
            value={{
                // Documents
                documents,
                setDocuments,
                filteredDocuments,
                setFilteredDocuments,
                selectedDocument,
                setSelectedDocument,
                totalDocuments,
                setTotalDocuments,
                isLoading,

                // Users
                users,
                setUsers,

                // Categories
                categories,
                setCategories,

                // Tags
                tags,
                setTags,

                // Groups
                groups,
                setGroups,

                // Search and filters
                filters,
                setFilters: updateFilters,

                // Pagination
                pagination,
                setPagination: updatePagination,

                // Modals
                isDocumentModalOpen,
                setIsDocumentModalOpen,
                isShareModalOpen,
                setIsShareModalOpen,
                isVersionModalOpen,
                setIsVersionModalOpen,
                isDetailsModalOpen,
                setIsDetailsModalOpen,

                // Current user
                currentUser,
            }}
        >
            {children}
        </AdminContext.Provider>
    );
}

export function useAdminContext() {
    const context = useContext(AdminContext);
    if (!context) {
        throw new Error(
            "useAdminContext phải được sử dụng trong AdminProvider"
        );
    }
    return context;
}

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

    // Modals
    isDocumentModalOpen: boolean;
    setIsDocumentModalOpen: (isOpen: boolean) => void;
    isShareModalOpen: boolean;
    setIsShareModalOpen: (isOpen: boolean) => void;
    isVersionModalOpen: boolean;
    setIsVersionModalOpen: (isOpen: boolean) => void;
    isDetailsModalOpen: boolean;
    setIsDetailsModalOpen: (isOpen: boolean) => void;
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
            try {
                const documentsResponse = await documentApi.getAllDocuments();
                setDocuments(documentsResponse.data);
                setFilteredDocuments(documentsResponse.data);

                const categoriesResponse =
                    await categoriesApi.getCategoriesforAdmin();
                setCategories(categoriesResponse.data);

                const usersResponse = await userApi.getAllUsers();
                setUsers(usersResponse.data);
            } catch (error) {
                console.error("Error fetching initial data:", error);
            }
        };

        fetchInitialData();
    }, []);

    useEffect(() => {
        const applyFilters = () => {
            let result = [...documents];

            if (filters.accessType !== "all") {
                result = result.filter(
                    (doc) => doc.accessType === filters.accessType
                );
            }

            if (filters.category !== "all") {
                result = result.filter(
                    (doc) => doc.categoryName === filters.category
                );
            }

            if (filters.tag !== "all") {
                result = result.filter((doc) =>
                    doc.tags?.includes(filters.tag)
                );
            }

            if (filters.group !== "all") {
                result = result.filter((doc) => doc.group_id === filters.group);
            }

            setFilteredDocuments(result);
        };

        applyFilters();
    }, [documents, filters]);
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

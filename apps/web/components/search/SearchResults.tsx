"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Document } from "@/lib/types/document";
import { SearchFilters } from "./SearchFilters";
import { DocumentCard } from "./DocumentCard";
import { DocumentListItem } from "./DocumentListItem";
import { Button } from "@/components/ui/button";
import { Grid, List } from "lucide-react";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import documentApi from "@/lib/apis/documentApi";
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";

interface SearchResultsProps {
    initialResults?: {
        documents: Document[];
        total: number;
        categories?: Category[];
    };
}

interface Category {
    id: string;
    name: string;
}

type ViewMode = "grid" | "list";

export function SearchResults({ initialResults }: SearchResultsProps) {
    const searchParams = useSearchParams();
    const router = useRouter();

    const validateSortOrder = (
        value: string | null
    ): "DESC" | "ASC" | undefined => {
        if (value === "ASC" || value === "DESC") {
            return value;
        }
        return "DESC";
    };

    const [viewMode, setViewMode] = useState<ViewMode>("grid");
    const [results, setResults] = useState<Document[]>(
        initialResults?.documents || []
    );
    const [totalResults, setTotalResults] = useState(
        initialResults?.total || 0
    );
    const [availableCategories, setAvailableCategories] = useState<Category[]>(
        () => initialResults?.categories ?? []
    );
    const [isLoading, setIsLoading] = useState(false);
    
    // Get current page from URL params
    const currentPageParam = searchParams.get("page");
    const [currentPage, setCurrentPage] = useState(
        currentPageParam ? parseInt(currentPageParam) : 1
    );
    
    const itemsPerPage = 12;

    const fetchResults = async (page?: number) => {
        setIsLoading(true);
        try {
            const search = searchParams.get("q") || searchParams.get("query") || "";
            const category = searchParams.get("category") || searchParams.get("categoryId") || "";
            const sortBy = searchParams.get("sortBy") || "relevance";
            const sortOrder = validateSortOrder(searchParams.get("sortOrder"));
            const pageToFetch = page || currentPage;

            const response = await documentApi.FTSDocument({
                search,
                categoryId: category,
                sortBy,
                sortOrder,
                page: pageToFetch,
                limit: itemsPerPage,
            });

            setResults(response.data);
            setTotalResults(response.meta.total);
        } catch (error) {
            console.error("Error fetching search results:", error);
            setResults([]);
            setTotalResults(0);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        const pageParam = searchParams.get("page");
        const newPage = pageParam ? parseInt(pageParam) : 1;
        setCurrentPage(newPage);
    }, [searchParams]);

    useEffect(() => {
        if (initialResults && currentPage === 1 && !searchParams.get("category") && !searchParams.get("sortBy")) {
            return;
        }
        fetchResults(currentPage);
    }, [searchParams]);

    const handlePageChange = (page: number) => {
        const params = new URLSearchParams(searchParams);
        params.set("page", page.toString());
        router.push(`/search?${params.toString()}`);
        
        // Scroll to top when page changes
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const renderSkeletons = () => {
        return Array.from({ length: 8 }).map((_, index) => (
            <div key={index} className="w-full">
                {viewMode === "grid" ? (
                    <div className="space-y-3">
                        <Skeleton className="w-full h-48" />
                        <Skeleton className="h-4 w-3/4" />
                        <Skeleton className="h-4 w-1/2" />
                    </div>
                ) : (
                    <div className="flex gap-4 p-4">
                        <Skeleton className="w-24 h-24 flex-shrink-0" />
                        <div className="flex-1 space-y-2">
                            <Skeleton className="h-4 w-3/4" />
                            <Skeleton className="h-4 w-1/2" />
                            <Skeleton className="h-4 w-1/4" />
                        </div>
                    </div>
                )}
            </div>
        ));
    };

    const totalPages = Math.ceil(totalResults / itemsPerPage);
    const searchQuery = searchParams.get("q") || searchParams.get("query") || "";

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex flex-col lg:flex-row gap-8">
                {/* Filters Sidebar */}
                <div className="w-full lg:w-64 flex-shrink-0">
                    <SearchFilters availableCategories={availableCategories} />
                </div>

                {/* Results Section */}
                <div className="flex-1">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h1 className="text-2xl font-bold mb-2">
                                Kết quả tìm kiếm
                                {searchQuery && (
                                    <span className="text-lg font-normal text-muted-foreground ml-2">
                                        cho "{searchQuery}"
                                    </span>
                                )}
                            </h1>
                            <p className="text-muted-foreground">
                                {isLoading ? (
                                    "Đang tìm kiếm..."
                                ) : (
                                    `Tìm thấy ${totalResults.toLocaleString()} tài liệu`
                                )}
                            </p>
                        </div>
                        <div className="flex items-center gap-2">
                            <Button
                                variant={viewMode === "grid" ? "default" : "outline"}
                                size="icon"
                                onClick={() => setViewMode("grid")}
                                disabled={isLoading}
                            >
                                <Grid className="h-4 w-4" />
                            </Button>
                            <Button
                                variant={viewMode === "list" ? "default" : "outline"}
                                size="icon"
                                onClick={() => setViewMode("list")}
                                disabled={isLoading}
                            >
                                <List className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>

                    {/* Results Grid/List */}
                    {isLoading ? (
                        <div
                            className={cn(
                                "gap-6",
                                viewMode === "grid"
                                    ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
                                    : "flex flex-col"
                            )}
                        >
                            {renderSkeletons()}
                        </div>
                    ) : results.length > 0 ? (
                        <>
                            <div
                                className={cn(
                                    "gap-6",
                                    viewMode === "grid"
                                        ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
                                        : "flex flex-col"
                                )}
                            >
                                {results.map((document) =>
                                    viewMode === "grid" ? (
                                        <DocumentCard
                                            key={document.id}
                                            document={document}
                                        />
                                    ) : (
                                        <DocumentListItem
                                            key={document.id}
                                            document={document}
                                        />
                                    )
                                )}
                            </div>
                            
                            {/* Pagination */}
                            {totalPages > 1 && (
                                <div className="mt-8">
                                    <Pagination>
                                        <PaginationContent>
                                            <PaginationItem>
                                                <PaginationPrevious
                                                    onClick={() => handlePageChange(currentPage - 1)}
                                                    className={
                                                        currentPage <= 1
                                                            ? "pointer-events-none opacity-50"
                                                            : "cursor-pointer"
                                                    }
                                                />
                                            </PaginationItem>

                                            {/* Render page numbers */}
                                            {Array.from({ length: totalPages }, (_, i) => i + 1)
                                                .filter(page => {
                                                    // Show current page, first page, last page, and 2 pages around current
                                                    return (
                                                        page === 1 ||
                                                        page === totalPages ||
                                                        Math.abs(page - currentPage) <= 2
                                                    );
                                                })
                                                .map((page, index, array) => {
                                                    // Add ellipsis if there's a gap
                                                    const prevPage = array[index - 1];
                                                    const showEllipsis = prevPage && page - prevPage > 1;
                                                    
                                                    return (
                                                        <div key={page} className="flex items-center">
                                                            {showEllipsis && (
                                                                <PaginationItem>
                                                                    <span className="px-3 py-2">...</span>
                                                                </PaginationItem>
                                                            )}
                                                            <PaginationItem>
                                                                <PaginationLink
                                                                    onClick={() => handlePageChange(page)}
                                                                    isActive={page === currentPage}
                                                                    className="cursor-pointer"
                                                                >
                                                                    {page}
                                                                </PaginationLink>
                                                            </PaginationItem>
                                                        </div>
                                                    );
                                                })}

                                            <PaginationItem>
                                                <PaginationNext
                                                    onClick={() => handlePageChange(currentPage + 1)}
                                                    className={
                                                        currentPage >= totalPages
                                                            ? "pointer-events-none opacity-50"
                                                            : "cursor-pointer"
                                                    }
                                                />
                                            </PaginationItem>
                                        </PaginationContent>
                                    </Pagination>
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="text-center py-12">
                            <div className="space-y-3">
                                <p className="text-lg text-muted-foreground">
                                    Không tìm thấy kết quả phù hợp
                                </p>
                                {searchQuery && (
                                    <p className="text-sm text-muted-foreground">
                                        Thử tìm kiếm với từ khóa khác hoặc điều chỉnh bộ lọc
                                    </p>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
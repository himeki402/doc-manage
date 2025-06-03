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
} from "../ui/pagination";

interface SearchResultsProps {
    initialResults?: {
        documents: Document[];
        total: number;
    };
}

type ViewMode = "grid" | "list";

export function SearchResults({ initialResults }: SearchResultsProps) {
    const searchParams = useSearchParams();
    const router = useRouter();

    // Helper function để validate sort order
    const validateSortOrder = (
        value: string | null
    ): "DESC" | "ASC" | undefined => {
        if (value === "ASC" || value === "DESC") {
            return value;
        }
        return "DESC"; // default value
    };
    const [viewMode, setViewMode] = useState<ViewMode>("grid");
    const [results, setResults] = useState<Document[]>(
        initialResults?.documents || []
    );
    const [totalResults, setTotalResults] = useState(
        initialResults?.total || 0
    );
    const [isLoading, setIsLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 12;

    const fetchResults = async () => {
        setIsLoading(true);
        try {
            const search = searchParams.get("q") || "";
            const category = searchParams.get("category") || "";
            const sortBy = searchParams.get("sortBy") || "relevance";
            const sortOrder = validateSortOrder(searchParams.get("sortOrder"));

            const response = await documentApi.FTSDocument({
                search,
                categoryId: category,
                sortBy,
                sortOrder,
                page: currentPage,
                limit: itemsPerPage,
            });

            setResults(response.data);
            setTotalResults(response.meta.total);
        } catch (error) {
            console.error("Error fetching search results:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchResults();
    }, [searchParams, currentPage]);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        const params = new URLSearchParams(searchParams);
        params.set("page", page.toString());
        router.push(`/search?${params.toString()}`);
    };

    const renderSkeletons = () => {
        return Array.from({ length: itemsPerPage }).map((_, index) => (
            <div
                key={index}
                className={viewMode === "grid" ? "w-full" : "w-full"}
            >
                <Skeleton className="w-full h-[300px]" />
            </div>
        ));
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex flex-col lg:flex-row gap-8">
                {/* Filters Sidebar */}
                <div className="w-full lg:w-64 flex-shrink-0">
                    <SearchFilters />
                </div>

                {/* Results Section */}
                <div className="flex-1">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h1 className="text-2xl font-bold mb-2">
                                Kết quả tìm kiếm
                            </h1>
                            <p className="text-muted-foreground">
                                Tìm thấy {totalResults} tài liệu
                            </p>
                        </div>
                        <div className="flex items-center gap-2">
                            <Button
                                variant={
                                    viewMode === "grid" ? "default" : "outline"
                                }
                                size="icon"
                                onClick={() => setViewMode("grid")}
                            >
                                <Grid className="h-4 w-4" />
                            </Button>
                            <Button
                                variant={
                                    viewMode === "list" ? "default" : "outline"
                                }
                                size="icon"
                                onClick={() => setViewMode("list")}
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
                            <div className="mt-8">
                                <Pagination>
                                    <PaginationContent>
                                        <PaginationItem>
                                            <PaginationPrevious
                                                onClick={() =>
                                                    handlePageChange(
                                                        currentPage - 1
                                                    )
                                                }
                                                className={
                                                    currentPage <= 1
                                                        ? "pointer-events-none opacity-50"
                                                        : ""
                                                }
                                            />
                                        </PaginationItem>

                                        {/* Render page numbers */}
                                        {Array.from(
                                            {
                                                length: Math.ceil(
                                                    totalResults / itemsPerPage
                                                ),
                                            },
                                            (_, i) => i + 1
                                        )
                                            .slice(
                                                Math.max(0, currentPage - 3),
                                                currentPage + 2
                                            )
                                            .map((page) => (
                                                <PaginationItem key={page}>
                                                    <PaginationLink
                                                        onClick={() =>
                                                            handlePageChange(
                                                                page
                                                            )
                                                        }
                                                        isActive={
                                                            page === currentPage
                                                        }
                                                    >
                                                        {page}
                                                    </PaginationLink>
                                                </PaginationItem>
                                            ))}

                                        <PaginationItem>
                                            <PaginationNext
                                                onClick={() =>
                                                    handlePageChange(
                                                        currentPage + 1
                                                    )
                                                }
                                                className={
                                                    currentPage >=
                                                    Math.ceil(
                                                        totalResults /
                                                            itemsPerPage
                                                    )
                                                        ? "pointer-events-none opacity-50"
                                                        : ""
                                                }
                                            />
                                        </PaginationItem>
                                    </PaginationContent>
                                </Pagination>
                            </div>
                        </>
                    ) : (
                        <div className="text-center py-12">
                            <p className="text-lg text-muted-foreground">
                                Không tìm thấy kết quả phù hợp
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

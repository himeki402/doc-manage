'use client'
import { useSearchParams } from "next/navigation";
import React from "react";
import { Document, GetDocumentsResponse } from "@/lib/types/document";
import Image from "next/image";
import DocumentListCard from "./DocumentListCard";

interface SearchContentProps {
    initialResults: Document[];
    initialTotal: number;
    query: string;
    initialPage: number;
    initialFilters: Record<string, string>;
    fetchSearchResults: (
        query: string,
        page: number,
        filters: Record<string, string>
    ) => Promise<GetDocumentsResponse>;
}

const SearchContent: React.FC<SearchContentProps> = ({
    initialResults,
    initialTotal,
    query,
    initialPage,
    initialFilters,
    fetchSearchResults,
}) => {
    const searchParams = useSearchParams();
    const pageFromUrl = parseInt(searchParams.get("page") || "1");

    const [filters, setFilters] =
        React.useState<Record<string, string>>(initialFilters);
    const [viewMode, setViewMode] = React.useState<"list" | "grid">("list");
    const [currentPage, setCurrentPage] = React.useState<number>(initialPage);
    const [searchResults, setSearchResults] =
        React.useState<Document[]>(initialResults);
    const [totalResults, setTotalResults] =
        React.useState<number>(initialTotal);

    React.useEffect(() => {
        setCurrentPage(pageFromUrl);
    }, [pageFromUrl]);

    const FilterBar: React.FC<{
        onFilterChange: (filters: Record<string, string>) => void;
    }> = ({ onFilterChange }) => {
        const [categoryId, setCategoryId] = React.useState<string>(
            initialFilters.categoryId || ""
        );
        const [tag, setTag] = React.useState<string>(initialFilters.tag || "");

        const handleClearAll = () => {
            setCategoryId("");
            setTag("");
            onFilterChange({});
        };

        const handleApplyFilters = () => {
            const filters = {
                categoryId,
                tag,
            };
            onFilterChange(filters);
        };

        return (
            <div className="flex flex-wrap gap-4 mb-4">
                <select
                    className="p-2 border rounded"
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                >
                    <option value="">Category</option>
                    <option value="science">Science</option>
                    <option value="education">Education</option>
                </select>
                <select
                    className="p-2 border rounded"
                    value={tag}
                    onChange={(e) => setTag(e.target.value)}
                >
                    <option value="">Tag</option>
                    <option value="tag1">Tag 1</option>
                    <option value="tag2">Tag 2</option>
                </select>
                <button
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    onClick={handleApplyFilters}
                >
                    Apply
                </button>
                <button
                    className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                    onClick={handleClearAll}
                >
                    Clear all
                </button>
            </div>
        );
    };

    const ResultCount: React.FC<{ total: number; query: string }> = ({
        total,
        query,
    }) => {
        return (
            <p className="mb-4 text-gray-700">
                {total} results for '{query}'
            </p>
        );
    };

    const ViewToggle: React.FC<{
        viewMode: "list" | "grid";
        onToggle: (mode: "list" | "grid") => void;
    }> = ({ viewMode, onToggle }) => {
        return (
            <div className="flex space-x-2 mb-4">
                <button
                    className={`px-4 py-2 rounded ${viewMode === "list" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
                    onClick={() => onToggle("list")}
                >
                    List
                </button>
                <button
                    className={`px-4 py-2 rounded ${viewMode === "grid" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
                    onClick={() => onToggle("grid")}
                >
                    Grid
                </button>
            </div>
        );
    };

    const ResultGrid: React.FC<{
        results: Document[];
        onResultClick: (id: string) => void;
    }> = ({ results, onResultClick }) => {
        return (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {results.map((result) => (
                    <div
                        key={result.id}
                        className="p-4 border rounded hover:bg-gray-50"
                    >
                        <Image
                            src={result.thumbnailUrl || "/placeholder.jpg"}
                            alt="Thumbnail"
                            className="w-full h-32 object-cover mb-2"
                        />
                        <h3 className="font-bold text-lg">{result.title}</h3>
                        <p className="text-sm text-gray-600">
                            {result.description?.substring(0, 100)}...
                        </p>
                        <button
                            className="bg-blue-500 text-white px-4 py-2 mt-2 rounded hover:bg-blue-600"
                            onClick={() => onResultClick(result.id)}
                        >
                            View/Download
                        </button>
                    </div>
                ))}
            </div>
        );
    };

    const Pagination: React.FC<{
        currentPage: number;
        totalPages: number;
        onPageChange: (page: number) => void;
    }> = ({ currentPage, totalPages, onPageChange }) => {
        return (
            <div className="flex justify-center space-x-2 mt-6">
                <button
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
                >
                    Previous
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1)
                    .slice(0, 5)
                    .map((page) => (
                        <button
                            key={page}
                            onClick={() => onPageChange(page)}
                            className={`px-4 py-2 rounded ${currentPage === page ? "bg-blue-500 text-white" : "bg-gray-200"}`}
                        >
                            {page}
                        </button>
                    ))}
                <button
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
                >
                    Next
                </button>
            </div>
        );
    };

    const handleFilterChange = (newFilters: Record<string, string>) => {
        setFilters(newFilters);
        setCurrentPage(1);
        const queryParams = new URLSearchParams({
            q: query,
            page: "1",
            ...newFilters,
        });
        window.history.pushState({}, "", `/search?${queryParams.toString()}`);
        fetchSearchResults(query, 1, newFilters).then((data) => {
            setSearchResults(data.data);
            setTotalResults(data.meta.total);
        });
    };

    const handleViewToggle = (mode: "list" | "grid") => {
        setViewMode(mode);
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        const queryParams = new URLSearchParams({
            q: query,
            page: page.toString(),
            ...filters,
        });
        window.history.pushState({}, "", `/search?${queryParams.toString()}`);
        fetchSearchResults(query, page, filters).then((data) => {
            setSearchResults(data.data);
            setTotalResults(data.meta.total);
        });
    };

    const handleResultClick = (id: string) => {
        console.log(`Result clicked: ${id}`);
    };

    React.useEffect(() => {
        if (query) {
            fetchSearchResults(query, currentPage, filters).then((data) => {
                setSearchResults(data.data);
                setTotalResults(data.meta.total);
            });
        }
    }, [query, currentPage, filters, fetchSearchResults]);

    return (
        <div className="flex flex-col min-h-screen">
            <div className="container mx-auto items-center">
                <section className="py-6 px-9">
                    {query && (
                        <>
                            <FilterBar onFilterChange={handleFilterChange} />
                            <ResultCount total={totalResults} query={query} />
                            <ViewToggle
                                viewMode={viewMode}
                                onToggle={handleViewToggle}
                            />
                            {viewMode === "list" ? (
                                <div className="space-y-4">
                                    {searchResults.map((result) => {
                                        // Bundle props into a single `document` object
                                        const document: DocumentListCard = {
                                            key: result.id,
                                            title: result.title,
                                            description:
                                                result.description || "",
                                            thumbnailUrl:
                                                result.thumbnailUrl ||
                                                "/placeholder.jpg",
                                            rating: `${result.rating} (${result.ratingCount})`,
                                            view: result.view.toString(),
                                            pageCount: result.pageCount.toString(), // 
                                            createdByName: new Date(
                                                result.createdByName
                                            ).toLocaleDateString(),
                                
                                        };

                                        return (
                                            <DocumentListCard
                                                key={result.id}
                                                document={document}
                                            />
                                        );
                                    })}
                                </div>
                            ) : (
                                <ResultGrid
                                    results={searchResults}
                                    onResultClick={handleResultClick}
                                />
                            )}
                            <Pagination
                                currentPage={currentPage}
                                totalPages={Math.ceil(totalResults / 10)}
                                onPageChange={handlePageChange}
                            />
                        </>
                    )}
                </section>
            </div>
        </div>
    );
};

export default SearchContent;

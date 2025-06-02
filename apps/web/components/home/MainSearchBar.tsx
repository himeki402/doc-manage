"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, FileText, Folder, User } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import documentApi from "@/lib/apis/documentApi";
import Image from "next/image";

interface SearchSuggestion {
    id: string;
    title: string;
    description: string;
    categoryName?: string;
    createdByName?: string;
    thumbnailUrl?: string;
    accessType: string;
    relevanceScore?: number;
}

export function SearchBar() {
    const [searchQuery, setSearchQuery] = useState("");
    const [suggestions, setSuggestions] = useState<string[]>([]);
    const [documents, setDocuments] = useState<SearchSuggestion[]>([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const searchRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const fetchSuggestions = async () => {
            if (searchQuery.length >= 2) {
                setIsLoading(true);
                try {
                    const response = await documentApi.getFTSSearchSuggestions(
                        searchQuery,
                        4
                    );

                    if (
                        response &&
                        response.suggestions &&
                        response.documents
                    ) {
                        // Sort documents by relevance score if available
                        const sortedDocuments = response.documents
                            .sort((a, b) => {
                                if (a.relevanceScore && b.relevanceScore) {
                                    return b.relevanceScore - a.relevanceScore;
                                }
                                return 0;
                            })
                            .slice(0, 4);

                        setSuggestions(response.suggestions.slice(0, 4));
                        setDocuments(sortedDocuments);
                        setShowSuggestions(true);
                    } else {
                        setSuggestions([]);
                        setDocuments([]);
                    }
                } catch (error) {
                    setSuggestions([]);
                    setDocuments([]);
                } finally {
                    setIsLoading(false);
                }
            } else {
                setSuggestions([]);
                setDocuments([]);
                setShowSuggestions(false);
            }
        };

        const timeoutId = setTimeout(fetchSuggestions, 300);
        return () => clearTimeout(timeoutId);
    }, [searchQuery]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                searchRef.current &&
                !searchRef.current.contains(event.target as Node)
            ) {
                setShowSuggestions(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleSearch = () => {
        if (searchQuery.trim()) {
            router.push(`/search?query=${encodeURIComponent(searchQuery)}`);
            setShowSuggestions(false);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            handleSearch();
        }
    };

    const handleSuggestionClick = (suggestion: string) => {
        setSearchQuery(suggestion);
        setShowSuggestions(false);
        router.push(`/search?query=${encodeURIComponent(suggestion)}`);
    };

    const handleDocumentClick = (document: SearchSuggestion) => {
        router.push(`/doc/${document.id}`);
        setShowSuggestions(false);
    };

    return (
        <section className="py-12 px-4 bg-secondary">
            <div className="container mx-auto max-w-3xl">
                <div className="relative" ref={searchRef}>
                    <Input
                        type="search"
                        placeholder="Tìm kiếm tài liệu, văn bản..."
                        className="w-full h-14 pl-12 pr-4 rounded-md text-lg shadow-md"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyDown={handleKeyPress}
                        onFocus={() =>
                            searchQuery.length >= 2 && setShowSuggestions(true)
                        }
                    />
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                    <Button
                        className="absolute right-1 top-1/2 -translate-y-1/2 h-12 px-6 bg-orange-600 hover:bg-orange-700"
                        onClick={handleSearch}
                    >
                        Tìm kiếm
                    </Button>

                    {showSuggestions && (
                        <div className="absolute w-full mt-1 bg-white rounded-md shadow-lg z-50 max-h-[500px] overflow-y-auto">
                            {isLoading ? (
                                <div className="px-4 py-2 text-gray-500">
                                    Đang tải...
                                </div>
                            ) : (
                                <>
                                    {suggestions.length > 0 && (
                                        <div className="border-b">
                                            <div className="px-4 py-2 text-sm font-medium text-gray-500 bg-gray-50">
                                                Đề xuất tìm kiếm
                                            </div>
                                            {suggestions.map(
                                                (suggestion, index) => (
                                                    <div
                                                        key={index}
                                                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center gap-2"
                                                        onClick={() =>
                                                            handleSuggestionClick(
                                                                suggestion
                                                            )
                                                        }
                                                    >
                                                        <Search className="h-4 w-4 text-gray-400" />
                                                        <span>
                                                            {suggestion}
                                                        </span>
                                                    </div>
                                                )
                                            )}
                                        </div>
                                    )}

                                    {documents.length > 0 && (
                                        <div>
                                            <div className="px-4 py-2 text-sm font-medium text-gray-500 bg-gray-50">
                                                Tài liệu phù hợp
                                            </div>
                                            {documents.map((doc) => (
                                                <div
                                                    key={doc.id}
                                                    className="px-4 py-3 hover:bg-gray-100 cursor-pointer border-b last:border-b-0"
                                                    onClick={() =>
                                                        handleDocumentClick(doc)
                                                    }
                                                >
                                                    <div className="flex gap-3">
                                                        {doc.thumbnailUrl ? (
                                                            <div className="relative w-12 h-12 flex-shrink-0">
                                                                <Image
                                                                    src={
                                                                        doc.thumbnailUrl
                                                                    }
                                                                    alt={
                                                                        doc.title
                                                                    }
                                                                    fill
                                                                    className="object-cover rounded"
                                                                />
                                                            </div>
                                                        ) : (
                                                            <div className="w-12 h-12 bg-gray-100 rounded flex items-center justify-center flex-shrink-0">
                                                                <FileText className="h-6 w-6 text-gray-400" />
                                                            </div>
                                                        )}
                                                        <div className="flex-1 min-w-0">
                                                            <h4 className="text-sm font-medium text-gray-900 truncate">
                                                                {doc.title}
                                                            </h4>
                                                            <p className="text-sm text-gray-500 truncate">
                                                                {
                                                                    doc.description
                                                                }
                                                            </p>
                                                            <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
                                                                {doc.categoryName && (
                                                                    <div className="flex items-center gap-1">
                                                                        <Folder className="h-3 w-3" />
                                                                        <span>
                                                                            {
                                                                                doc.categoryName
                                                                            }
                                                                        </span>
                                                                    </div>
                                                                )}
                                                                {doc.createdByName && (
                                                                    <div className="flex items-center gap-1">
                                                                        <User className="h-3 w-3" />
                                                                        <span>
                                                                            {
                                                                                doc.createdByName
                                                                            }
                                                                        </span>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {suggestions.length === 0 &&
                                        documents.length === 0 && (
                                            <div className="px-4 py-2 text-gray-500">
                                                Không tìm thấy kết quả
                                            </div>
                                        )}
                                </>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}

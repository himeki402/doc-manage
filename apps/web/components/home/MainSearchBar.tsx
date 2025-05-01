"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export function SearchBar() {
    const [searchQuery, setSearchQuery] = useState("");
    const router = useRouter();

    const handleSearch = () => {
        if (searchQuery.trim()) {
            router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            handleSearch();
        }
    };

    return (
        <section className="py-12 px-4 bg-slate-100">
            <div className="container mx-auto max-w-3xl">
                <div className="relative">
                    <Input
                        type="search"
                        placeholder="Tìm kiếm tài liệu, văn bản..."
                        className="w-full h-14 pl-12 pr-4 rounded-md text-lg shadow-md"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyDown={handleKeyPress}
                    />
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                    <Button
                        className="absolute right-1 top-1/2 -translate-y-1/2 h-12 px-6 bg-orange-600 hover:bg-orange-700"
                        onClick={handleSearch}
                    >
                        Tìm kiếm
                    </Button>
                </div>
            </div>
        </section>
    );
}
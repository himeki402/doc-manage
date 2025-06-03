"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { Category } from "@/lib/types/category";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import documentApi from "@/lib/apis/documentApi";

export function SearchFilters() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [categories, setCategories] = useState<Category[]>([]);
    const [selectedCategory, setSelectedCategory] = useState(
        searchParams.get("category") || ""
    );
    const [selectedSortBy, setSelectedSortBy] = useState(
        searchParams.get("sortBy") || "relevance"
    );
    const [selectedSortOrder, setSelectedSortOrder] = useState(
        searchParams.get("sortOrder") || "desc"
    );

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const query = searchParams.get("q") || "";
                const response = await documentApi.getSearchCategories(query);
                setCategories(response);
            } catch (error) {
                console.error("Error fetching categories:", error);
            }
        };
        fetchCategories();
    }, [searchParams]);

    const applyFilters = () => {
        const params = new URLSearchParams(searchParams);

        if (selectedCategory) {
            params.set("category", selectedCategory);
        } else {
            params.delete("category");
        }

        params.set("sortBy", selectedSortBy);
        params.set("sortOrder", selectedSortOrder);
        params.set("page", "1"); // Reset to first page when filters change

        router.push(`/search?${params.toString()}`);
    };

    const clearFilters = () => {
        const params = new URLSearchParams(searchParams);
        params.delete("category");
        params.set("sortBy", "relevance");
        params.set("sortOrder", "desc");
        params.set("page", "1");

        setSelectedCategory("");
        setSelectedSortBy("relevance");
        setSelectedSortOrder("desc");

        router.push(`/search?${params.toString()}`);
    };

    return (
        <div className="space-y-4">
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">Bộ lọc tìm kiếm</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    {/* Search */}
                    <div className="space-y-2">
                        <Label>Tìm kiếm</Label>
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input placeholder="Tìm kiếm..." className="pl-9" />
                        </div>
                    </div>

                    {/* Category Filter */}
                    <div className="space-y-2">
                        <Label>Danh mục</Label>
                        <Select
                            value={selectedCategory}
                            onValueChange={setSelectedCategory}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Tất cả danh mục" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="">
                                    Tất cả danh mục
                                </SelectItem>
                                {categories.map((category) => (
                                    <SelectItem
                                        key={category.id}
                                        value={category.id}
                                    >
                                        {category.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Sort Options */}
                    <div className="space-y-2">
                        <Label>Sắp xếp theo</Label>
                        <Select
                            value={selectedSortBy}
                            onValueChange={setSelectedSortBy}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Chọn tiêu chí sắp xếp" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="relevance">
                                    Độ liên quan
                                </SelectItem>
                                <SelectItem value="createdAt">
                                    Ngày tạo
                                </SelectItem>
                                <SelectItem value="title">
                                    Tên tài liệu
                                </SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label>Thứ tự</Label>
                        <RadioGroup
                            value={selectedSortOrder}
                            onValueChange={setSelectedSortOrder}
                        >
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="desc" id="desc" />
                                <Label htmlFor="desc">Giảm dần</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="asc" id="asc" />
                                <Label htmlFor="asc">Tăng dần</Label>
                            </div>
                        </RadioGroup>
                    </div>

                    <div className="flex gap-2">
                        <Button className="flex-1" onClick={applyFilters}>
                            Áp dụng
                        </Button>
                        <Button
                            variant="outline"
                            className="flex-1"
                            onClick={clearFilters}
                        >
                            Xóa bộ lọc
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

// components/home/CategoryNavigation.tsx
import { Suspense } from "react";
import { Category } from "@/lib/types/category";
import categoriesApi from "@/lib/apis/categoriesApi";
import { Loader2 } from "lucide-react";
import { NavigationMenuClient } from "./NavigationMenuClient";

async function getCategories(): Promise<Category[]> {
    try {
        const data = await categoriesApi.getCategories();
        return data;
    } catch (error) {
        console.error("Failed to load categories:", error);
        return [];
    }
}

export async function CategoryNavigation() {
    const categories = await getCategories();

    return (
        <Suspense
            fallback={
                <div className="flex items-center justify-center h-10">
                    <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                </div>
            }
        >
            <NavigationMenuClient categories={categories} />
        </Suspense>
    );
}
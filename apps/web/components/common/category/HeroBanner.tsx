import { Input } from "@/components/ui/input";
import { ChevronLeft, Search } from "lucide-react";
import Link from "next/link";

type HeroBannerCategoryProps = {
    id: string;
    name: string;
    description?: string;
    documentCount: number;
};

export function HeroBannerCategory(category: HeroBannerCategoryProps) {
    return (
        <section className="bg-slate-900 text-white py-16 px-4">
            <div className="container mx-auto max-w-7xl">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <Link
                            href="/"
                            className="text-slate-300 hover:text-white flex items-center mb-2"
                        >
                            <ChevronLeft className="h-4 w-4 mr-1" /> Trang chủ
                        </Link>
                        <h1 className="text-2xl md:text-3xl font-bold">
                            {category.name}
                        </h1>
                        <p className="text-slate-300 mt-2 max-w-3xl">
                            {category.description}
                        </p>
                    </div>

                    <div className="w-full md:w-auto">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                            <Input
                                type="search"
                                placeholder="Tìm kiếm trong danh mục này..."
                                className="w-full md:w-64 pl-10 bg-slate-800 border-slate-700 text-white placeholder:text-slate-400"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

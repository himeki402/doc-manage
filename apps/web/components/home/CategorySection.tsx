// components/home/CategorySection.tsx
import { FileText, ChevronRight } from "lucide-react";
import Link from "next/link";
import { DocumentCard } from "../common/layout/document/DocumentCard";


type DocumentItem = {
    id: string;
    title: string;
    thumbnail: any;
    created_at: string;
    createdByName: string;
    view: number;
    rating: number;
    ratingCount: number;
    thumbnailUrl: string;
    mimeType: string;
};

type Category = {
    id: string;
    name: string;
    iconColor: string;
    documents: DocumentItem[];
};

export function CategorySection({ category }: { category: Category }) {
    return (
        <div className="mb-16">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div
                        className={`w-10 h-10 rounded-full bg-${category.iconColor}-100 flex items-center justify-center`}
                    >
                        <FileText
                            className={`h-5 w-5 text-${category.iconColor}-600`}
                        />
                    </div>
                    <h3 className="text-xl font-bold">{category.name}</h3>
                </div>
                <Link
                    href={`/category/${category.id}`}
                    className="text-sm font-medium text-blue-600 hover:text-blue-800 flex items-center"
                >
                    Xem tất cả <ChevronRight className="h-4 w-4 ml-1" />
                </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {category.documents.map((doc) => (
                    <DocumentCard key={doc.id} document={doc} />
                ))}
            </div>
        </div>
    );
}
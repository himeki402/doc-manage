import { DocumentGrid } from "@/components/common/category/DocumentGrid";
import { HeroBannerCategory } from "@/components/common/category/HeroBanner";
import categoriesApi from "@/lib/apis/categoriesApi";
import documentApi, { DocumentQueryParams } from "@/lib/apis/documentApi";
import { Category } from "@/lib/types/category";
import { Document } from "@/lib/types/document";

async function getDocumentByCategory(slug: string): Promise<Document[]> {
    try {
        const response = await documentApi.getDocumentByCategory({
            slug: slug,
            page: 1,
            limit: 10,
        } as DocumentQueryParams);
        return response.data;
    } catch (error) {
        console.error("Không thể lấy danh sách tài liệu:", error);
        return [];
    }
}

async function getCategoryBySlug(slug: string): Promise<Category> {
    try {
        const response = await categoriesApi.getCategoryBySlug(slug);

        const categoryData = response;
        const category: Category = {
            id: categoryData.id,
            name: categoryData.name,
            description: categoryData.description,
            documentCount: categoryData.documentCount || 0,
        };
        return category;
    } catch (error) {
        console.error("Không thể lấy danh mục:", error);
        return {
            id: "",
            name: "Unknown",
            description: "No description available",
            documentCount: 0,
        };
    }
}

export default async function Page({ params }: { params: { slug: string } }) {
    const resolvedParams = await params;
    const slug = resolvedParams.slug;

    const documents = await getDocumentByCategory(slug);
    const category = await getCategoryBySlug(slug);

    return (
        <div className="flex flex-col gap-4">
            <HeroBannerCategory
                id={category.id}
                name={category.name}
                description={category.description}
                documentCount={category.documentCount}
            />
            <section className="py-12">
                <div className="container mx-auto max-w-7xl">
                    <DocumentGrid
                        title={category.name}
                        categorySlug="Sach-giao-trinh"
                        documents={documents}
                        // onBookmark={handleBookmark}
                    />
                </div>
            </section>
        </div>
    );
}

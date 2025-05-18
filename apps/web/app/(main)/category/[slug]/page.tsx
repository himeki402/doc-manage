import { DocumentGrid } from "@/components/common/category/DocumentGrid";
import { HeroBannerCategory } from "@/components/common/layout/HeroBanner";
import categoriesApi from "@/lib/apis/categoriesApi";
import documentApi, { DocumentQueryParams } from "@/lib/apis/documentApi";
import { Category } from "@/lib/types/category";
import { Document } from "@/lib/types/document";
import { notFound } from "next/navigation";

async function getDocumentByCategory(slug: string): Promise<Document[]> {
    try {
        const response = await documentApi.getDocumentByCategory({
            slug,
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
        if (!response) {
            throw new Error("Category not found");
        }
        return {
            id: response.id,
            name: response.name,
            description: response.description,
            documentCount: response.documentCount || 0,
        };
    } catch (error) {
        console.error("Không thể lấy danh mục:", error);
        throw error;
    }
}

export default async function Page({ params }: { params: { slug: string } }) {
    const { slug } = params;

    if (!slug) {
        notFound();
    }

    try {
        const [documents, category] = await Promise.all([
            getDocumentByCategory(slug),
            getCategoryBySlug(slug),
        ]);

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
                            categorySlug={slug}
                            documents={documents}
                        />
                        {documents.length === 0 && (
                            <div className="text-center py-8">
                                Không tìm thấy tài liệu trong danh mục này.
                            </div>
                        )}
                    </div>
                </section>
            </div>
        );
    } catch (error) {
        return (
            <div className="text-center py-8">
                Đã xảy ra lỗi khi tải danh mục. Vui lòng thử lại sau.
            </div>
        );
    }
}

export const revalidate = 3600;

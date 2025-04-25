import documentApi from "@/lib/apis/documentApi";
import { Category, Document } from "@/lib/types/document";

async function getCategoryBySlug(slug: string): Promise<Category | null> {
    try {
        const response = await documentApi.getCategories();
        const categories = response.data;
        return categories.find(category => category.slug === slug) || null;
    } catch (error) {
        console.error("Không thể lấy thông tin danh mục:", error);
        return null;
    }
}

async function getDocumentByCategory(categoryId: string): Promise<Document[]> {
    try {
        const response = await documentApi.getDocumentByCategory({
            page: 1,
            limit: 10,
            categoryId: categoryId,
        });
        return response.data;
    } catch (error) {
        console.error("Không thể lấy danh sách tài liệu:", error);
        return [];
    }
}

export default async function Page({ params }: { params: { slug: string } }) {
    const category = await getCategoryBySlug(params.slug);
    const documents = await getDocumentByCategory(category.id);
    return (
        <div className="flex flex-col gap-4">
            {documents.map((document) => (
                <div key={document.id} className="p-4 border rounded-md shadow-sm">
                    <h2 className="text-xl font-bold">{document.title}</h2>
                    <p>{document.description}</p>
                </div>
            ))}
        </div>
    );
}
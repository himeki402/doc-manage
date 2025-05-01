import documentApi, { DocumentQueryParams } from "@/lib/apis/documentApi";
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

export default async function Page({ params }: { params: { slug: string } }) {
    const documents = await getDocumentByCategory(params.slug);
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
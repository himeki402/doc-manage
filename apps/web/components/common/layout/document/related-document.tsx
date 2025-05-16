import documentApi, { DocumentQueryParams } from "@/lib/apis/documentApi";
import { Document } from "@/lib/types/document";
import { useEffect, useState } from "react";

interface DocumentRelatedProps {
    documentCatId?: string;
}

export function DocumentRelated({ documentCatId }: DocumentRelatedProps) {
    const [relatedDocuments, setRelatedDocuments] = useState<Document[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchRelatedDocuments = async () => {
            if (!documentCatId) {
                setRelatedDocuments([]);
                setLoading(false);
                return;
            }

            setLoading(true);
            setError(null);

            try {
                const response = await documentApi.getPublicDocuments({
                    categoryId: documentCatId,
                    page: 1,
                    limit: 10,
                } as DocumentQueryParams);
                setRelatedDocuments(response.data || []);
            } catch (error) {
                console.error("Không thể lấy danh sách tài liệu:", error);
                setError("Không thể tải danh sách tài liệu. Vui lòng thử lại.");
                setRelatedDocuments([]);
            } finally {
                setLoading(false);
            }
        };

        fetchRelatedDocuments();
    }, [documentCatId]);

    if (loading) {
        return <div>Đang tải danh sách tài liệu...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <>
            <h2 className="text-lg font-semibold mb-4">Tài liệu liên quan</h2>
            <div className="space-y-4">
                {relatedDocuments.length > 0 ? (
                    relatedDocuments.map((doc) => (
                        <div
                            key={doc.id}
                            className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
                        >
                            <a
                                href={`/doc/${doc.id}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:underline"
                            >
                                {doc.title}
                            </a>
                        </div>
                    ))
                ) : (
                    <div>Không có tài liệu liên quan.</div>
                )}
            </div>
        </>
    );
}

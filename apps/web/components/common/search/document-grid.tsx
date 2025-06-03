import { DocumentCard } from "../layout/document/DocumentCard";

type DocumentGridProps = {
    documents: Array<{
        id: string;
        title: string;
        thumbnailUrl?: string;
        created_at: string;
        createdByName: string;
        likeCount: number;
        slug: string;
        view: number;
        rating: number;
        ratingCount: number;
        mimeType: string;
    }>;
};

export function DocumentGrid({
    documents,
}: DocumentGridProps) {
    return (
        <div className="mb-16">
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
                {documents.map((doc) => (
                    <DocumentCard key={doc.id} document={doc} />
                ))}
            </div>
        </div>
    );
}

import { DocumentCard } from "../layout/document/DocumentCard";

type DocumentGridProps = {
    title: string;
    categorySlug: string;
    documents: Array<{
        id: string;
        title: string;
        thumbnailUrl?: string;
        created_at: string;
        createdByName: string;
        slug: string;
        view: number;
        rating: number;
        ratingCount: number;
        mimeType: string;
    }>;
    //   onBookmark?: (id: string) => void;
};

export function DocumentGrid({
    title,
    documents,
    //   onBookmark,
}: DocumentGridProps) {
    return (
        <div className="mb-16">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <h3 className="text-2xl font-bold">Khám phá về {title}</h3>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
                {documents.map((doc) => (
                    <DocumentCard key={doc.id} document={doc} />
                ))}
            </div>
        </div>
    );
}

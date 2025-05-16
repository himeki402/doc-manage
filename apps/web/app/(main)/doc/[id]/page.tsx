import { DocumentViewer } from "@/components/common/layout/document/document-viewer";
import documentApi from "@/lib/apis/documentApi";
import { Document } from "@/lib/types/document";

async function getDocument(id: string): Promise<Document> {
    try {
        const document = await documentApi.getDocumentById(id);
        return document;
    } catch (error) {
        console.error("Error fetching document:", error);
        throw error;
    }
}

interface DocumentDetailPageProps {
    params: Promise<{ id: string }>;
}

export default async function DocumentDetailPage({
    params,
}: DocumentDetailPageProps) {
    const { id } = await params;
    const document = await getDocument(id);
    return <DocumentViewer document={document} />;
}

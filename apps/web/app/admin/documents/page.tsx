"use client";
import { DocumentsTable } from "@/components/common/admin/documentAdmin/DocumentTable";
import { UploadDocumentDialog } from "@/components/common/admin/documentAdmin/DocumentUploadDialog";
import { useAdminContext } from "@/contexts/adminContext";
import { DocumentsHeader } from "@/components/common/admin/documentAdmin/document-header";
import { DocumentsFilters } from "@/components/common/admin/documentAdmin/document-filters";

export default function DocumentsAdminPage() {
    const {
        selectedDocument,
        isDocumentModalOpen,
        setIsDocumentModalOpen,
        isShareModalOpen,
        setIsShareModalOpen,
        isVersionModalOpen,
        setIsVersionModalOpen,
        isDetailsModalOpen,
        setIsDetailsModalOpen,
    } = useAdminContext();

    return (
        <div className="flex flex-col h-full">
            <DocumentsHeader
                onCreateDocument={() => setIsDocumentModalOpen(true)}
            />
            <div className="p-4 md:p-6 flex flex-col gap-6 overflow-auto">
                <DocumentsFilters />
                <DocumentsTable />
            </div>

            <UploadDocumentDialog
                open={isDocumentModalOpen}
                onOpenChange={setIsDocumentModalOpen}
            />

            {selectedDocument && (
                <>
                    <ShareDocumentDialog
                        open={isShareModalOpen}
                        onOpenChange={setIsShareModalOpen}
                        document={selectedDocument}
                    />

                    <DocumentVersionDialog
                        open={isVersionModalOpen}
                        onOpenChange={setIsVersionModalOpen}
                        document={selectedDocument}
                    />

                    <DocumentDetailsDialog
                        open={isDetailsModalOpen}
                        onOpenChange={setIsDetailsModalOpen}
                        document={selectedDocument}
                    />
                </>
            )}
        </div>
    );
}

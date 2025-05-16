import { ChevronRight, FileText } from "lucide-react";
import Link from "next/link";
import { DocumentCard } from "../common/layout/document/DocumentCard";


type DocumentGridProps = {
  title: string;
  categorySlug: string ;
  icon?: React.ReactNode;
  iconBgColor?: string;
  iconColor?: string;
  documents: Array<{
    id: string;
    title: string;
    thumbnailUrl?: string;
    created_at: string;
    createdByName: string;
    view: number;
    slug: string;
    rating: number;
    ratingCount: number;
    mimeType: string;
  }>;
//   onBookmark?: (id: string) => void;
};

export function DocumentGrid({
  title,
  categorySlug,
  icon,
  iconBgColor = "bg-green-100",
  iconColor = "text-green-600",
  documents,
//   onBookmark,
}: DocumentGridProps) {
  return (
    <div className="mb-16">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-full ${iconBgColor} flex items-center justify-center`}>
            {icon || <FileText className={`h-5 w-5 ${iconColor}`} />}
          </div>
          <h3 className="text-xl font-bold">{title}</h3>
        </div>
        <Link
          href={`/category/${categorySlug}`}
          className="text-sm font-medium text-blue-600 hover:text-blue-800 flex items-center"
        >
          Xem tất cả <ChevronRight className="h-4 w-4 ml-1" />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-6">
        {documents.map((doc) => (
          <DocumentCard
            key={doc.id}
            document={doc}
          />
        ))}
      </div>
    </div>
  );
}
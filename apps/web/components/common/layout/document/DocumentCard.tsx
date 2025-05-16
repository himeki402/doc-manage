import { Card, CardContent, CardFooter } from "@/components/ui/card";
import Image from "next/image";
import { BookOpen, Star, ThumbsUp } from "lucide-react";
import { formatDateToDDMMMM } from "@/lib/utils";
import SGTthumbnail from "@/public/GiaoTrinh_thumbnail.jpg";
import Link from "next/link";

type DocumentItem = {
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
};

export function DocumentCard({ document }: { document: DocumentItem }) {
    return (
        <Link href={`/doc/${document.id}`} className="block">
            <Card className="h-[400px] overflow-hidden group hover:shadow-md hover:border-slate-400 transition-shadow cursor-pointer">
                <div className="relative flex justify-center">
                    <div className="absolute top-2 right-2 bg-blue-600 text-white px-2 py-1 text-xs font-medium rounded">
                        {document.mimeType === "application/pdf"
                            ? "PDF"
                            : "DOCUMENT"}
                    </div>
                    <div className="absolute top-2 left-2 bg-orange-600 text-white px-3 py-1 text-sm font-medium z-10">
                        {formatDateToDDMMMM(document.created_at)}
                    </div>
                    <Image
                        src={document.thumbnailUrl || SGTthumbnail}
                        alt={document.title}
                        width={300}
                        height={400}
                        className="w-full h-60 object-contain py-2"
                    />
                </div>
                <CardContent className="p-4">
                    <h4 className="font-bold mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
                        {document.title}
                    </h4>
                    <p className="text-sm text-slate-600 mb-2">
                        Added by {document.createdByName}
                    </p>
                    <div className="flex items-center text-sm text-slate-600">
                        <ThumbsUp className="h-4 w-4 mr-1" />
                        <span>
                            {document.rating.toFixed(0)} ({document.ratingCount}{" "}
                            đánh giá)
                        </span>
                    </div>
                </CardContent>
                <CardFooter className="p-4 pt-0">
                    <div className="flex items-center text-sm text-slate-500">
                        <BookOpen className="h-4 w-4 mr-1" />
                        <span>{document.view} lượt xem</span>
                    </div>
                </CardFooter>
            </Card>
        </Link>
    );
}

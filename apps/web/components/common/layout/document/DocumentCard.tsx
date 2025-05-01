// components/home/DocumentCard.tsx
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import Image from "next/image";
import { BookOpen, Star } from "lucide-react";
import { formatDateToDDMMMM } from "@/lib/utils";
import pdfthumbnail from "@/public/pdfThumb.png";
import SGTthumbnail from "@/public/GiaoTrinh_thumbnail.jpg";

type DocumentItem = {
    id: string;
    title: string;
    thumbnailUrl?: string;
    created_at: string;
    createdByName: string;
    view: number;
    rating: number;
    ratingCount: number;
    mimeType: string;
};

export function DocumentCard({ document }: { document: DocumentItem }) {
    return (
        <Card className="overflow-hidden group hover:shadow-md transition-shadow cursor-pointer">
            <div className="relative">
                <div className="absolute top-2 right-2 bg-blue-600 text-white px-2 py-1 text-xs font-medium rounded">
                    {document.mimeType === "application/pdf" ? "PDF" : "DOCUMENT"}
                </div>
                <div className="absolute top-2 left-2 bg-orange-600 text-white px-3 py-1 text-sm font-medium z-10">
                    {formatDateToDDMMMM(document.created_at)}
                </div>
                <Image
                    src={document.thumbnailUrl || SGTthumbnail }
                    alt={document.title}
                    width={400}
                    height={200}
                    className="w-full h-48 object-cover"
                />
            </div>
            <CardContent className="p-4">
                {/* Tiêu đề (giới hạn 2 dòng) */}
                <h4 className="font-bold mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
                    {document.title}
                </h4>
                {/* Thông tin người đăng */}
                <p className="text-sm text-slate-600 mb-2">
                    Added by {document.createdByName}
                </p>
                {/* Đánh giá */}
                <div className="flex items-center text-sm text-slate-600">
                    <Star className="h-4 w-4 text-yellow-400 mr-1" />
                    <span>
                        {document.rating.toFixed(0)} ({document.ratingCount}{" "}
                        đánh giá)
                    </span>
                </div>
            </CardContent>
            <CardFooter className="p-4 pt-0">
                <div className="flex items-center text-sm text-slate-500">
                    <BookOpen className="h-4 w-4 mr-1" />
                    <span>{document.view} lượt xem</span> {/* Có thể thay bằng dữ liệu thực */}
                </div>
            </CardFooter>
        </Card>
    );
}
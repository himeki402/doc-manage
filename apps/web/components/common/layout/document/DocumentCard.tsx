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
    fileUrl?: string; // Đảm bảo type DocumentItem có field fileUrl
    created_at: string;
    createdByName: string;
    likeCount: number;
    slug: string;
    view: number;
    rating: number;
    ratingCount: number;
    mimeType: string;
};

export function DocumentCard({ document }: { document: DocumentItem }) {
    const getFileTypeBadge = (mimeType: string) => {
        switch (true) {
            case mimeType === "application/pdf":
                return "PDF";
            case mimeType === "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
                return "Word";
            case mimeType.startsWith("image/"):
                return "Image";
            case mimeType.startsWith("video/"):
                return "Video";
            default:
                return "File";
        }
    };

    const fileType = getFileTypeBadge(document.mimeType);

    // Xác định nguồn hình ảnh
    const imageSrc = document.mimeType.startsWith("image/")
        ? document.fileUrl || SGTthumbnail
        : document.thumbnailUrl || SGTthumbnail;

    return (
        <Link href={`/doc/${document.id}`} className="block">
            <Card className="h-[400px] overflow-hidden group hover:shadow-md hover:border-slate-400 transition-shadow cursor-pointer">
                <div className="relative flex justify-center">
                    <div
                        className={`absolute top-2 right-2 px-2 py-1 text-xs font-medium rounded ${
                            fileType === "PDF"
                                ? "bg-red-600"
                                : fileType === "Word"
                                ? "bg-blue-600"
                                : fileType === "Image"
                                ? "bg-green-600"
                                : fileType === "Video"
                                ? "bg-purple-600"
                                : "bg-gray-600"
                        } text-white`}
                    >
                        {fileType}
                    </div>
                    <div className="absolute top-2 left-2 bg-orange-600 text-white px-3 py-1 text-sm font-medium z-10">
                        {formatDateToDDMMMM(document.created_at)}
                    </div>
                    <Image
                        src={imageSrc}
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
                    <p className="text-sm text-slate-600 mb-2 line-clamp-1">
                        Tải lên bởi {document.createdByName}
                    </p>
                    {document.ratingCount > 0 ? (
                        <div className="flex items-center text-sm text-slate-600">
                            <ThumbsUp className="h-4 w-4 mr-1" />
                            <span>
                                {`${((document.likeCount / document.ratingCount) * 100).toFixed(0)}%`}{" "}
                                ({document.ratingCount} đánh giá)
                            </span>
                        </div>
                    ) : (
                        <div className="flex items-center text-sm text-slate-600">
                            <ThumbsUp className="h-4 w-4 mr-1" />
                            <p> 0 đánh giá</p>
                        </div>
                    )}
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
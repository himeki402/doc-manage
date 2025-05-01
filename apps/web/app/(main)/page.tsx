import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { BookOpen, ChevronRight, FileText } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import thumbnailSTK from "@/public/SachTK_thumb.jpg";
import thumbnailNN from "@/public/ngoaingu_thumb.png";
import documentApi from "@/lib/apis/documentApi";
import { Document } from "@/lib/types/document";
import { CategoryNavigation } from "@/components/home/CategoryNavigation";
import { HeroSection } from "@/components/home/HeroSection";
import { SearchBar } from "@/components/home/MainSearchBar";
import { DocumentGrid } from "@/components/home/DocumentGrid";

async function getPublicDocuments(): Promise<Document[]> {
    try {
        const response = await documentApi.getPublicDocuments({
            page: 1,
            limit: 10,
        });
        return response.data;
    } catch (error) {
        console.error("Không thể lấy danh sách tài liệu:", error);
        return [];
    }
}

async function getSGTDocuments(): Promise<Document[]> {
    try {
        const response = await documentApi.getDocumentByCategory({
            page: 1,
            limit: 10,
            slug: "Sach-giao-trinh",
        });
        return response.data;
    } catch (error) {
        console.error(
            "Không thể lấy danh sách tài liệu sách giáo trình:",
            error
        );
        return [];
    }
}

async function getNNDocuments(): Promise<Document[]> {
    try {
        const response = await documentApi.getDocumentByCategory({
            page: 1,
            limit: 10,
            slug: "Ngoai-ngu",
        });
        return response.data;
    } catch (error) {
        console.error(
            "Không thể lấy danh sách tài liệu ngoại ngữ",
            error
        );
        return [];
    }
}

export default async function HomePage() {
    const documents = await getPublicDocuments();
    const NNDocument = await getNNDocuments();
    const SGTDocument = await getSGTDocuments();
    return (
        <div className="flex flex-col min-h-screen">
            <HeroSection />
            <section className=" py-2 bg-slate-100">
                <div className="container mx-auto items-center">
                    <CategoryNavigation />
                </div>
            </section>
            <SearchBar />
            <section className="py-12">
                <div className="container mx-auto max-w-7xl">
                    <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">
                        DANH MỤC TÀI LIỆU MIỄN PHÍ
                    </h2>

                    {/* Category 1: Textbooks */}
                    <DocumentGrid
                        title="Sách giáo trình"
                        categorySlug="Sach-giao-trinh"
                        iconBgColor="bg-green-100"
                        iconColor="text-green-600"
                        documents={SGTDocument}
                        // onBookmark={handleBookmark}
                    />
                    {/* Category 2 */}
                    <div className="mb-16">
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                                    <FileText className="h-5 w-5 text-red-600" />
                                </div>
                                <h3 className="text-xl font-bold">
                                    SÁCH THAM KHẢO
                                </h3>
                            </div>
                            <Link
                                href="/category/1"
                                className="text-sm font-medium text-blue-600 hover:text-blue-800 flex items-center"
                            >
                                Xem tất cả{" "}
                                <ChevronRight className="h-4 w-4 ml-1" />
                            </Link>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {[
                                {
                                    title: "Đề thi thử đánh giá tư duy TSA 2025 có đáp án chi tiết",
                                    date: "15 Apr",
                                    image: thumbnailSTK,
                                    excerpt:
                                        "Bộ đề thi thử đánh giá tư duy TSA 2025 được biên soạn bám sát cấu trúc đề thi chính thức của trường ĐH Bách Khoa...",
                                },
                                {
                                    title: "Phân tích cấu trúc đề thi TSA 2025 và phương pháp làm bài",
                                    date: "08 Apr",
                                    image: thumbnailSTK,
                                    excerpt:
                                        "Bài viết phân tích chi tiết cấu trúc đề thi đánh giá tư duy TSA 2025 và chia sẻ phương pháp làm bài hiệu quả...",
                                },
                                {
                                    title: "Tài liệu ôn tập TSA 2025 phần tư duy định lượng",
                                    date: "02 Apr",
                                    image: thumbnailSTK,
                                    excerpt:
                                        "Tổng hợp tài liệu ôn tập phần tư duy định lượng trong kỳ thi đánh giá tư duy TSA 2025 với nhiều bài tập mẫu...",
                                },
                                {
                                    title: "Kinh nghiệm đạt điểm cao TSA từ các thí sinh khóa trước",
                                    date: "25 Mar",
                                    image: thumbnailSTK,
                                    excerpt:
                                        "Tổng hợp chia sẻ kinh nghiệm từ các thí sinh đạt điểm cao trong kỳ thi đánh giá tư duy TSA các năm trước...",
                                },
                            ].map((doc, index) => (
                                <Card
                                    key={index}
                                    className="overflow-hidden group hover:shadow-md transition-shadow"
                                >
                                    <div className="relative">
                                        <div className="absolute top-0 left-0 bg-orange-600 text-white px-3 py-1 text-sm font-medium z-10">
                                            {doc.date}
                                        </div>
                                        <Image
                                            src={
                                                doc.image || "/placeholder.svg"
                                            }
                                            alt={doc.title}
                                            width={400}
                                            height={200}
                                            className="w-full h-48 object-cover"
                                        />
                                    </div>
                                    <CardContent className="p-4">
                                        <h4 className="font-bold mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
                                            {doc.title}
                                        </h4>
                                        <p className="text-sm text-slate-600 line-clamp-3">
                                            {doc.excerpt}
                                        </p>
                                    </CardContent>
                                    <CardFooter className="p-4 pt-0">
                                        <div className="flex items-center text-sm text-slate-500">
                                            <BookOpen className="h-4 w-4 mr-1" />
                                            <span>
                                                {980 + index * 125} lượt xem
                                            </span>
                                        </div>
                                    </CardFooter>
                                </Card>
                            ))}
                        </div>
                    </div>

                    {/* Category Tài liệu ngoại ngữ */}
                    <DocumentGrid
                        title="Tài liệu ngoại ngữ"
                        categorySlug="Ngoai-ngu"
                        iconBgColor="bg-green-100"
                        iconColor="text-green-600"
                        documents={NNDocument}
                        // onBookmark={handleBookmark}
                    />
                </div>
            </section>
        </div>
    );
}

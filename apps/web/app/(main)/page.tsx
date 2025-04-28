import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { BookOpen, ChevronRight, FileText, Search } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import thumbnailGT from "@/public/GiaoTrinh_thumbnail.jpg";
import thumbnailSTK from "@/public/SachTK_thumb.jpg";
import thumbnailNN from "@/public/ngoaingu_thumb.png";
import documentApi from "@/lib/apis/documentApi";
import { Category, Document } from "@/lib/types/document";
import { formatDateToDDMMMM } from "@/lib/utils";
import categoriesApi from "@/lib/apis/categoriesApi";

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
async function getCategories(): Promise<Category[]> {
    try {
        const response = await categoriesApi.getCategories();

        return response.data;
    } catch (error) {
        console.error("Không thể lấy danh sách danh mục:", error);
        return [];
    }
}

export default async function HomePage() {
    const documents = await getPublicDocuments();
    const categories = await getCategories();
    return (
        <div className="flex flex-col min-h-screen">
            <section className="bg-slate-900 text-white py-16 px-4 text-center">
                <div className="container mx-auto max-w-4xl">
                    <h1 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">
                        TÀI LIỆU KMA
                    </h1>
                    <p className="text-lg md:text-xl text-slate-300 mb-8 leading-relaxed">
                        Nền tảng chia sẻ, quản lý tài liệu học tập và nghiên cứu
                        miễn phí.
                    </p>
                </div>
            </section>

            {/* Category Navigation */}
            <section className="bg-white border-b py-4">
                <div className="container mx-auto">
                    <div className="flex flex-wrap justify-center gap-2 md:gap-6">
                        <Link
                            href="/"
                            className="px-3 py-2 text-sm font-medium text-blue-600 border-b-2 border-blue-600"
                        >
                            TẤT CẢ
                        </Link>

                        {categories && categories.length > 0
                            ? categories.map((category) => (
                                  <Link
                                      key={category.id}
                                      href={`/category/${category.slug}`}
                                      className="px-3 py-2 text-sm font-medium text-slate-700 transition-colors hover:text-blue-600"
                                  >
                                      {category.name}
                                  </Link>
                              ))
                            : [
                                  "SÁCH GIÁO TRÌNH",
                                  "SÁCH THAM KHẢO",
                                  "LUẬN ÁN LUẬN VĂN",
                                  "SÁCH PHÁP LUẬT",
                                  "NGOẠI NGỮ",
                                  "AN TOÀN THÔNG TIN",
                                  "TIN TỨC",
                              ].map((name, index) => (
                                  <Link
                                      key={index}
                                      href={`/category/${index}`}
                                      className="px-3 py-2 text-sm font-medium transition-colors hover:text-blue-600"
                                  >
                                      {name}
                                  </Link>
                              ))}
                    </div>
                </div>
            </section>

            {/* Main Search Bar */}
            <section className="py-12 px-4 bg-slate-100">
                <div className="container mx-auto max-w-3xl">
                    <div className="relative">
                        <Input
                            type="search"
                            placeholder="Tìm kiếm tài liệu, văn bản..."
                            className="w-full h-14 pl-12 pr-4 rounded-md text-lg shadow-md"
                        />
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                        <Button className="absolute right-1 top-1/2 -translate-y-1/2 h-12 px-6 bg-orange-600 hover:bg-orange-700">
                            Tìm kiếm
                        </Button>
                    </div>
                </div>
            </section>

            {/* Documents by Category */}
            <section className="py-12 px-4">
                <div className="container mx-auto">
                    <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">
                        DANH MỤC TÀI LIỆU MIỄN PHÍ
                    </h2>

                    {/* Category 1 */}
                    <div className="mb-16">
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                                    <FileText className="h-5 w-5 text-green-600" />
                                </div>
                                <h3 className="text-xl font-bold">
                                    SÁCH GIÁO TRÌNH
                                </h3>
                            </div>
                            <Link
                                href="/category/0"
                                className="text-sm font-medium text-blue-600 hover:text-blue-800 flex items-center"
                            >
                                Xem tất cả{" "}
                                <ChevronRight className="h-4 w-4 ml-1" />
                            </Link>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {[
                                {
                                    title: documents[0]?.title || "Tài liệu 1",
                                    date: formatDateToDDMMMM(
                                        documents[0]?.created_at ?? "1970-01-01"
                                    ),
                                    image: thumbnailGT,
                                    excerpt:
                                        "Bài viết tổng hợp các review về đề thi đánh giá năng lực HSA đợt 3 của học sinh, giáo viên và các chuyên gia...",
                                },
                                {
                                    title: documents[1]?.title || "Tài liệu 1",
                                    date: formatDateToDDMMMM(
                                        documents[1]?.created_at ?? "1970-01-01"
                                    ),
                                    image: thumbnailGT,
                                    excerpt:
                                        "Bài viết tổng hợp các review về đề thi đánh giá năng lực HSA đợt 3 của học sinh, giáo viên và các chuyên gia...",
                                },
                                {
                                    title: "Bài tập Vật lý đại cương.Tập 2,Điện - Dao động - Sóng /Lương Duyên Bình, Nguyễn Hữu Hồ, Lê Văn Nghĩa, Nguyễn Quang Sính (200) (Lượt lưu thông:47)  (0) (Lượt truy cập:0)Vật lý đại cương.Tập 3,Quang học - Vật lý nguyên tử và hạt nhân :Dùng cho các trường Đại học khối Kỹ thuất công nghiệp",
                                    date: formatDateToDDMMMM(
                                        documents[3]?.created_at ?? "1970-01-01"
                                    ),
                                    image: thumbnailGT,
                                    excerpt:
                                        "Bài viết tổng hợp các review, nhận xét của các thí sinh sau khi tham gia kỳ thi đánh giá năng lực HSA đợt 2...",
                                },
                                {
                                    title: "Bài tập toán cao cấp.Tập 2,Phép tính giải tích một biến số",
                                    date: "23 Mar",
                                    image: thumbnailGT,
                                    excerpt:
                                        "Tài liệu ôn thi chia sẻ cho các bạn thí sinh bộ tài liệu bổ trợ môn toán học cho kỳ thi đánh giá năng lực HSA...",
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
                                                {1200 + index * 145} lượt xem
                                            </span>
                                        </div>
                                    </CardFooter>
                                </Card>
                            ))}
                        </div>
                    </div>

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

                    {/* Category 3 */}
                    <div className="mb-16">
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                                    <FileText className="h-5 w-5 text-blue-600" />
                                </div>
                                <h3 className="text-xl font-bold">NGOẠI NGỮ</h3>
                            </div>
                            <Link
                                href="/category/2"
                                className="text-sm font-medium text-blue-600 hover:text-blue-800 flex items-center"
                            >
                                Xem tất cả{" "}
                                <ChevronRight className="h-4 w-4 ml-1" />
                            </Link>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {[
                                {
                                    title: "Đề thi mẫu V-ACT 2025 kèm hướng dẫn giải chi tiết",
                                    date: "17 Apr",
                                    image: thumbnailNN,
                                    excerpt:
                                        "Bộ đề thi mẫu V-ACT 2025 được biên soạn theo cấu trúc mới nhất của kỳ thi đánh giá năng lực ĐHQG TPHCM...",
                                },
                                {
                                    title: "Phân tích sự khác biệt giữa V-ACT và HSA trong cấu trúc đề thi",
                                    date: "10 Apr",
                                    image: thumbnailNN,
                                    excerpt:
                                        "Bài viết phân tích chi tiết sự khác biệt giữa hai kỳ thi đánh giá năng lực V-ACT và HSA để thí sinh có chiến lược ôn tập phù hợp...",
                                },
                                {
                                    title: "Tài liệu ôn tập V-ACT 2025 phần tiếng Anh",
                                    date: "05 Apr",
                                    image: thumbnailNN,
                                    excerpt:
                                        "Tổng hợp tài liệu ôn tập phần tiếng Anh trong kỳ thi đánh giá năng lực V-ACT 2025 với nhiều dạng bài tập và đề mẫu...",
                                },
                                {
                                    title: "Lộ trình ôn thi V-ACT hiệu quả trong 3 tháng",
                                    date: "28 Mar",
                                    image: thumbnailNN,
                                    excerpt:
                                        "Chia sẻ lộ trình ôn thi V-ACT hiệu quả trong 3 tháng cuối cùng, giúp thí sinh tối ưu hóa thời gian và đạt kết quả cao...",
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
                                                {1050 + index * 135} lượt xem
                                            </span>
                                        </div>
                                    </CardFooter>
                                </Card>
                            ))}
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}

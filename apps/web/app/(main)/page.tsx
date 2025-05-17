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
            slug: "Tai-lieu-ngoai-ngu",
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

async function getTLTKDocuments(): Promise<Document[]> {
    try {
        const response = await documentApi.getDocumentByCategory({
            page: 1,
            limit: 10,
            slug: "Tai-lieu-tham-khao",
        });
        return response.data;
    } catch (error) {
        console.error(
            "Không thể lấy danh sách tài liệu",
            error
        );
        return [];
    }
}

async function getTLCNDocuments(): Promise<Document[]> {
    try {
        const response = await documentApi.getDocumentByCategory({
            page: 1,
            limit: 10,
            slug: "tai-lieu-chuyen-nganh",
        });
        return response.data;
    } catch (error) {
        console.error(
            "Không thể lấy danh sách tài liệu",
            error
        );
        return [];
    }
}

export default async function HomePage() {
    const TLCNDocument = await getTLCNDocuments();
    const NNDocument = await getNNDocuments();
    const SGTDocument = await getSGTDocuments();
    const TLTKDocument = await getTLTKDocuments();
    return (
        <div className="flex flex-col min-h-screen">
            <section className=" py-2">
                <div className="container mx-auto items-center">
                    <CategoryNavigation />
                </div>
            </section>
            <HeroSection />
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
                    <DocumentGrid
                        title="Tài liệu tham khảo"
                        categorySlug="Tai-lieu-tham-khao"
                        iconBgColor="bg-orange-100"
                        iconColor="text-green-600"
                        documents={TLTKDocument}
                        // onBookmark={handleBookmark}
                    />       
                    {/* Category Tài liệu chuyên ngành */}
                    <DocumentGrid
                        title="Tài liệu Chuyên ngành"
                        categorySlug="tai-lieu-chuyen-nganh"
                        iconBgColor="bg-blue-100"
                        iconColor="text-green-600"
                        documents={TLCNDocument}
                        // onBookmark={handleBookmark}
                    />       
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

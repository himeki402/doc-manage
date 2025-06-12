import documentApi from "@/lib/apis/documentApi";
import { Document } from "@/lib/types/document";
import { CategoryNavigation } from "@/components/home/CategoryNavigation";
import { HeroSection } from "@/components/home/HeroSection";
import { SearchBar } from "@/components/home/MainSearchBar";
import { DocumentGrid } from "@/components/home/DocumentGrid";

interface Category {
    title: string;
    slug: string;
    iconBgColor: string;
    iconColor: string;
}

const categories: Category[] = [
    {
        title: "Sách giáo trình",
        slug: "Sach-giao-trinh",
        iconBgColor: "bg-green-100",
        iconColor: "text-green-600"
    },
    {
        title: "Tài liệu tham khảo",
        slug: "Tai-lieu-tham-khao",
        iconBgColor: "bg-orange-100",
        iconColor: "text-green-600"
    },
    {
        title: "Tài liệu Chuyên ngành",
        slug: "tai-lieu-chuyen-nganh",
        iconBgColor: "bg-blue-100",
        iconColor: "text-green-600"
    },
    {
        title: "Tài liệu ngoại ngữ",
        slug: "Tai-lieu-ngoai-ngu",
        iconBgColor: "bg-green-100",
        iconColor: "text-green-600"
    }
];

// Hàm generic để lấy documents theo category
async function getDocumentsByCategory(slug: string): Promise<Document[]> {
    try {
        const response = await documentApi.getDocumentByCategory({
            page: 1,
            limit: 6,
            slug: slug,
        });
        return response.data;
    } catch (error) {
        console.error(
            `Không thể lấy danh sách tài liệu cho category ${slug}:`,
            error
        );
        return [];
    }
}

// Hàm lấy tất cả documents cho các categories
async function getAllCategoryDocuments(): Promise<{ [key: string]: Document[] }> {
    const documentsPromises = categories.map(async (category) => {
        const documents = await getDocumentsByCategory(category.slug);
        return { [category.slug]: documents };
    });

    const documentsArrays = await Promise.all(documentsPromises);

    return documentsArrays.reduce((acc, curr) => ({ ...acc, ...curr }), {});
}

export default async function HomePage() {
    const allDocuments = await getAllCategoryDocuments();

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
                <div className="container mx-auto px-8 max-w-7xl">
                    <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">
                        DANH MỤC TÀI LIỆU MIỄN PHÍ
                    </h2>

                    {categories.map((category, index) => (
                        <DocumentGrid
                            key={category.slug}
                            title={category.title}
                            categorySlug={category.slug}
                            iconBgColor={category.iconBgColor}
                            iconColor={category.iconColor}
                            documents={allDocuments[category.slug] || []}
                            // onBookmark={handleBookmark}
                        />
                    ))}
                </div>
            </section>
        </div>
    );
}
import { Footer } from "@/components/common/layout/footer";
import { Header } from "@/components/common/layout/header";

export default function MainLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <>
            <main className="min-h-screen">
                <Header showSearch={false} />
                {children}
                <Footer />
            </main>
        </>
    );
}

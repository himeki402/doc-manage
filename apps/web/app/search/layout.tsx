import { Footer } from "@/components/common/layout/footer";
import { Header } from "@/components/common/layout/header";

export default function MainLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex flex-col">
            <Header showSearch={true} />
            <main className="flex-1">{children}</main>
            <Footer />
        </div>
    );
}

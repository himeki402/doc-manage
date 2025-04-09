import { Header } from "@/components/common/layout/header";
import { SidebarNav } from "@/components/common/layout/sidebar-nav";
import { Footer } from "@/components/common/layout/footer";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex h-svh">
            <div className="flex-1 flex flex-col">
                <Header />
                <SidebarNav />
                <main className="flex-1 overflow-auto">{children}</main>
                <Footer />
            </div>
        </div>
    );
}

import { Header } from "@/components/common/layout/header";
import { Footer } from "@/components/common/layout/footer";
import { DashboardProvider } from "@/contexts/dashboardContext";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <>
            <main className="min-h-screen">
                <Header showSearch={false} />
                <DashboardProvider>
                    {children}
                </DashboardProvider>
                <Footer />
            </main>
        </>
    );
}

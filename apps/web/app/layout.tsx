import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@repo/ui/globals.css";
import { Toaster } from "sonner";
import { ThemeProvider } from "@/components/themes/theme-provider";
import { AuthProvider } from "@/contexts/authContext";
import { getUserData } from "@/lib/actions/auth/currentUser";

const inter = Inter({
    subsets: ["latin", "vietnamese"],
    display: "swap",
    variable: "--font-inter",
    preload: true,
    fallback: ["system-ui", "Arial", "sans-serif"],
});

export const metadata: Metadata = {
    title: "Tài liệu KMA",
    description: "Tài liệu KMA",
};

export default async function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const userData = await getUserData();
    
    return (
        <html lang="en" suppressHydrationWarning>
            <body className={`${inter.variable} font-sans antialiased`}>
                <ThemeProvider>
                    <div className="flex h-svh">
                        <div className="flex-1 flex flex-col">
                            <AuthProvider initialUser={userData}>{children}</AuthProvider>
                        </div>
                    </div>
                    <Toaster position="top-right" expand closeButton />
                </ThemeProvider>
            </body>
        </html>
    );
}

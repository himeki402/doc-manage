"use client";

import { AdminHeader } from "@/components/common/admin/admin-header";
import { AdminSidebar } from "@/components/common/admin/admin-sidebar";
import { AdminProvider } from "@/contexts/adminContext";
import type { ReactNode } from "react";

export default function AdminLayout({ children }: { children: ReactNode }) {
    return (
        <AdminProvider>
            <div className="flex h-screen bg-background">
                <AdminSidebar />
                <div className="flex flex-1 flex-col">
                    <AdminHeader />
                    <main className="flex-1 overflow-y-auto bg-muted/10 p-6">
                        {children}
                    </main>
                </div>
            </div>
        </AdminProvider>
    );
}

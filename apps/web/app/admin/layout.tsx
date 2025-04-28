"use client"

import type { ReactNode } from "react"
import { AdminSidebar } from "@/components/common/layout/admin/admin-sidebar"
import { AdminHeader } from "@/components/common/layout/admin/admin-header"

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
      <div className="flex h-screen bg-background">
        <AdminSidebar />
        <div className="flex flex-1 flex-col">
          <AdminHeader />
          <main className="flex-1 overflow-y-auto bg-muted/10 p-6">
            {children}
          </main>
        </div>
      </div>
  )
}

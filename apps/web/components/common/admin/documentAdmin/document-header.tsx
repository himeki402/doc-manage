"use client"

import { Plus } from "lucide-react"
import { DashboardHeader } from "../admin-dashboard-header"

interface DocumentsHeaderProps {
  onCreateDocument: () => void
}

export function DocumentsHeader({ onCreateDocument }: DocumentsHeaderProps) {
  return (
    <DashboardHeader
      title="Quản lý tài liệu"
      description="Quản lý toàn bộ văn bản trong hệ thống."
      actionLabel="Thêm tài liệu"
      actionIcon={Plus}
      onAction={onCreateDocument}
    />
  )
}

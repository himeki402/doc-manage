"use client";

import { PlusIcon } from "lucide-react";
import UserTable from "@/components/common/admin/user/user-table";
import { DashboardHeader } from "@/components/common/admin/admin-dashboard-header";

export default function UsersPage() {
    const handleAddUser = () => {
        // Logic to add a new user
        console.log("Add User button clicked");
    };
    return (
        <div className="space-y-6">
            <DashboardHeader
                title="Quản lý người dùng"
                description="Quản lý người dùng trong hệ thống."
                actionLabel="Thêm người dùng"
                actionIcon={PlusIcon}
                onAction={handleAddUser}
            />
            <UserTable />
        </div>
    );
}

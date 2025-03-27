import { ModeToggle } from "@/components/ui/themeToggle";
import React from "react";

export default function Header() {
    return (
        <div className="flex justify-between">
            <div>Header</div>
            <ModeToggle />
        </div>
    );
}

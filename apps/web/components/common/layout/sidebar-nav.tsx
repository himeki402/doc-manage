"use client";

import { Button } from "@/components/ui/button";
import {
    ChevronDown,
    FileText,
    FolderIcon,
    Heart,
    Plus,
    Settings,
} from "lucide-react";

export function SidebarNav() {
    return (
        <div className="w-72 border-r bg-background flex flex-col h-screen">
            <div className="p-4">

                <div className="space-y-4">
                    <div className="flex items-center gap-3 p-2 rounded-md hover:bg-accent">
                        <FileText size={18} className="text-primary" />
                        <span className="text-sm font-medium text-foreground">
                            My Document
                        </span>
                    </div>

                    <div className="flex items-center gap-3 p-2 rounded-md hover:bg-accent">
                        <Heart size={18} className="text-muted-foreground" />
                        <span className="text-sm font-medium text-muted-foreground">
                            Favourite
                        </span>
                    </div>

                    <div className="flex items-center gap-3 p-2 rounded-md hover:bg-accent">
                        <FileText size={18} className="text-muted-foreground" />
                        <span className="text-sm font-medium text-muted-foreground">
                            Unsorted
                        </span>
                    </div>

                    <div className="flex items-center gap-3 p-2 rounded-md hover:bg-accent">
                        <FileText size={18} className="text-muted-foreground" />
                        <span className="text-sm font-medium text-muted-foreground">
                            My Template
                        </span>
                    </div>
                </div>
            </div>

            <div className="mt-4 px-4">
                <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-muted-foreground">
                        FOLDERS
                    </span>
                    <Button variant="ghost" size="icon" className="h-6 w-6">
                        <Plus size={16} />
                    </Button>
                </div>

                <div className="space-y-1">
                    <div className="flex items-center gap-3 p-2 rounded-md hover:bg-accent">
                        <FolderIcon size={18} className="text-primary" />
                        <span className="text-sm font-medium text-foreground">
                            Keitoto Shot
                        </span>
                    </div>

                    <div className="flex items-center gap-3 p-2 rounded-md hover:bg-accent">
                        <FolderIcon size={18} className="text-primary" />
                        <span className="text-sm font-medium text-foreground">
                            Design System Journal
                        </span>
                    </div>

                    <div className="flex items-center gap-3 p-2 rounded-md hover:bg-accent">
                        <FolderIcon size={18} className="text-primary" />
                        <span className="text-sm font-medium text-foreground">
                            Social Media Marketing
                        </span>
                    </div>

                    <div className="flex items-center gap-3 p-2 rounded-md hover:bg-accent">
                        <FolderIcon size={18} className="text-primary" />
                        <span className="text-sm font-medium text-foreground">
                            Usability Testing
                        </span>
                    </div>
                </div>

                <Button
                    variant="ghost"
                    className="w-full justify-start mt-2 text-sm text-muted-foreground"
                >
                    Show more <ChevronDown size={14} className="ml-1" />
                </Button>
            </div>
        </div>
    );
}

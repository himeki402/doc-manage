"use client";

import { useState } from "react";
import {
    BellIcon,
    MessageSquareIcon,
    SearchIcon,
    MenuIcon,
    XIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { AdminSidebar } from "./admin-sidebar";

export function AdminHeader() {
    const [isSearchOpen, setIsSearchOpen] = useState(false);

    return (
        <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b bg-background px-4 md:px-6">
            <div className="flex items-center gap-2 lg:hidden">
                <Sheet>
                    <SheetTrigger asChild>
                        <Button
                            variant="outline"
                            size="icon"
                            className="lg:hidden"
                        >
                            <MenuIcon className="h-5 w-5" />
                            <span className="sr-only">Toggle menu</span>
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="p-0">
                        <AdminSidebar />
                    </SheetContent>
                </Sheet>
            </div>

            <div
                className={cn(
                    "hidden transition-all sm:flex items-center",
                    isSearchOpen ? "w-full" : "w-auto"
                )}
            >
                {isSearchOpen ? (
                    <div className="relative w-full max-w-md">
                        <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            type="search"
                            placeholder="Search..."
                            className="w-full rounded-md bg-muted pl-8 focus:bg-background"
                            autoFocus
                            onBlur={() => setIsSearchOpen(false)}
                        />
                        <Button
                            variant="ghost"
                            size="icon"
                            className="absolute right-0 top-0"
                            onClick={() => setIsSearchOpen(false)}
                        >
                            <XIcon className="h-4 w-4" />
                            <span className="sr-only">Close search</span>
                        </Button>
                    </div>
                ) : (
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setIsSearchOpen(true)}
                    >
                        <SearchIcon className="h-4 w-4" />
                        <span className="sr-only">Search</span>
                    </Button>
                )}
            </div>

            <div className="flex items-center gap-2">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button
                            variant="outline"
                            size="icon"
                            className="relative"
                        >
                            <BellIcon className="h-4 w-4" />
                            <span className="sr-only">Notifications</span>
                            <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[10px] font-medium text-destructive-foreground">
                                4
                            </span>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-80">
                        <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <div className="max-h-[300px] overflow-auto">
                            {[1, 2, 3, 4].map((i) => (
                                <DropdownMenuItem
                                    key={i}
                                    className="cursor-pointer py-3"
                                >
                                    <div className="flex items-start gap-2">
                                        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10">
                                            <MessageSquareIcon className="h-4 w-4 text-primary" />
                                        </span>
                                        <div className="grid gap-1">
                                            <p className="text-sm font-medium">
                                                New document comment
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                                John Doe commented on "Annual
                                                Report"
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                                2h ago
                                            </p>
                                        </div>
                                    </div>
                                </DropdownMenuItem>
                            ))}
                        </div>
                    </DropdownMenuContent>
                </DropdownMenu>

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="relative h-8 w-8 rounded-full"
                        >
                            <Avatar className="h-8 w-8">
                                <AvatarImage
                                    src="https://avatars.githubusercontent.com/u/124599?v=4"
                                    alt="User"
                                />
                                <AvatarFallback>AD</AvatarFallback>
                            </Avatar>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>My Account</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>Profile</DropdownMenuItem>
                        <DropdownMenuItem>Settings</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>
                            <a href="/logout">Log out</a>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </header>
    );
}

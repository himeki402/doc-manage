"use client";

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
import { ModeToggle } from "@/components/ui/themeToggle";
import {
    Bell,
    ChevronDown,
    HelpCircle,
    Menu,
    Plus,
    Search,
} from "lucide-react";
import Link from "next/link";

export function Header() {
    return (
        <header className="sticky top-0 z-40 w-full border-b bg-background">
            <div className="flex h-16 items-center justify-between px-4 md:px-6">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" className="md:hidden">
                        <Menu className="h-5 w-5" />
                        <span className="sr-only">Toggle menu</span>
                    </Button>
                    <div className="hidden md:flex items-center gap-2">
                        <div className="bg-primary w-8 h-8 rounded-full flex items-center justify-center">
                            <svg
                                width="16"
                                height="16"
                                viewBox="0 0 24 24"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    d="M12 4L4 8L12 12L20 8L12 4Z"
                                    fill="white"
                                />
                                <path
                                    d="M4 12L12 16L20 12"
                                    stroke="white"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                                <path
                                    d="M4 16L12 20L20 16"
                                    stroke="white"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            </svg>
                        </div>
                        <span className="font-semibold text-lg text-foreground">
                            KMA Document
                        </span>
                    </div>
                    <nav className="hidden md:flex items-center gap-6">
                        <Link
                            href="#"
                            className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
                        >
                            Dashboard
                        </Link>
                        <Link
                            href="#"
                            className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
                        >
                            Documents
                        </Link>
                        <Link
                            href="#"
                            className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
                        >
                            Projects
                        </Link>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button
                                    variant="ghost"
                                    className="h-8 gap-1 px-2"
                                >
                                    <span className="text-sm font-medium text-muted-foreground">
                                        More
                                    </span>
                                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem>Templates</DropdownMenuItem>
                                <DropdownMenuItem>Analytics</DropdownMenuItem>
                                <DropdownMenuItem>Team</DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </nav>
                </div>

                <div className="flex items-center gap-4">
                    <div className="relative hidden md:flex items-center">
                        <Search className="absolute left-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            type="search"
                            placeholder="Search documents..."
                            className="w-64 pl-8 rounded-full bg-accent border-input focus-visible:ring-primary"
                        />
                    </div>

                    <Button
                        variant="ghost"
                        size="icon"
                        className="text-muted-foreground"
                    >
                        <HelpCircle className="h-5 w-5" />
                        <span className="sr-only">Help</span>
                    </Button>

                    <Button
                        variant="ghost"
                        size="icon"
                        className="text-muted-foreground"
                    >
                        <Bell className="h-5 w-5" />
                        <span className="sr-only">Notifications</span>
                    </Button>

                    <ModeToggle />

                    <Button
                        variant="ghost"
                        size="icon"
                        className="rounded-full h-8 w-8 bg-primary/10 text-primary"
                    >
                        <Plus className="h-5 w-5" />
                        <span className="sr-only">Create</span>
                    </Button>

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant="ghost"
                                className="relative h-8 w-8 rounded-full"
                            >
                                <Avatar className="h-8 w-8">
                                    <AvatarImage
                                        src="/placeholder.svg"
                                        alt="User"
                                    />
                                    <AvatarFallback className="bg-primary/10 text-primary">
                                        JD
                                    </AvatarFallback>
                                </Avatar>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>My Account</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>Profile</DropdownMenuItem>
                            <DropdownMenuItem>Settings</DropdownMenuItem>
                            <DropdownMenuItem>Billing</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>Log out</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
        </header>
    );
}

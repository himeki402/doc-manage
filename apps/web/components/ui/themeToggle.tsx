"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";

export function ModeToggle() {
    const { setTheme, theme } = useTheme();

    const handleThemeChange = () => {
        setTheme(theme === "light" ? "dark" : "light");
    };

    return (
        <Button variant="outline" size='icon' onClick={handleThemeChange}>
            {theme === "light" ? <Moon /> : <Sun />}
        </Button>
    );
}

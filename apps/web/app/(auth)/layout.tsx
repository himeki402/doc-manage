import React, { PropsWithChildren } from "react";
import { ThemeProvider } from "@/components/themes/theme-provider";

export default function AuthLayout({ children }: PropsWithChildren) {
    return (
        <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
        >
            <div className="min-h-svh bg-background">{children}</div>
        </ThemeProvider>
    );
}

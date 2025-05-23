import { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DashboardHeaderProps {
    title: string;
    description?: string;
    actionLabel?: string;
    actionIcon?: LucideIcon;
    onAction?: () => void;
    children?: React.ReactNode;
}

export function DashboardHeader({
    title,
    description,
    actionLabel,
    actionIcon: ActionIcon,
    onAction,
    children,
}: DashboardHeaderProps) {
    return (
        <div className="flex items-center justify-between pr-4 md:py-6 border-b">
            <div>
                <h1 className="text-3xl font-bold mb-3">{title}</h1>
                {description && (
                    <p className="text-sm text-muted-foreground">
                        {description}
                    </p>
                )}
                {children}
            </div>
            {onAction && (
                <Button onClick={onAction}>
                    {ActionIcon && <ActionIcon className="mr-2 h-4 w-4" />}
                    {actionLabel}
                </Button>
            )}
        </div>
    );
}

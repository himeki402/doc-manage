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
        <div className="flex items-center justify-between p-4 md:p-6 border-b">
            <div>
                <h1 className="text-2xl font-bold">{title}</h1>
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

interface WelcomeSectionProps {
    name?: string;
}

export default function WelcomeSection({ name }: WelcomeSectionProps) {
    return (
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
            <div>
                <h1 className="text-2xl font-bold tracking-tight">
                    Xin chào, {name || "Sinh viên"}
                </h1>
                <p className="text-muted-foreground">
                    Quản lý tài liệu học tập của bạn
                </p>
            </div>
        </div>
    );
}

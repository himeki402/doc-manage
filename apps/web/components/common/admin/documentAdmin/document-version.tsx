import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { formatDateToFullOptions } from "@/lib/utils";
import { Download, Eye, History } from "lucide-react";
import { useRouter } from "next/navigation";

interface DocumentVersionProps {
    document: {
        id: string;
        createdByName: string;
        created_at: string;
    };
}

export function DocumentVersion({ document }: DocumentVersionProps) {
    const router = useRouter();

    const handleViewDocument = () => {
        router.push(`/doc/${document.id}`);
    };

    return (
        <>
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">Lịch sử phiên bản</CardTitle>
                    <CardDescription>
                        Theo dõi các thay đổi và phiên bản trước đó của tài liệu
                        này
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {/* {document.versionHistory
                            .slice()
                            .reverse()
                            .map((version) => ( */}
                        <div
                            // key={version.version}
                            className="flex items-start gap-4 pb-4 border-b last:border-0"
                        >
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted">
                                <History className="h-4 w-4" />
                            </div>
                            <div className="flex-1 space-y-1">
                                <div className="flex items-center justify-between">
                                    <p className="text-sm font-medium">
                                        Phiên bản 1
                                    </p>
                                    <div className="flex items-center gap-2">
                                        <Button variant="ghost" size="sm">
                                            <Download className="mr-2 h-3.5 w-3.5" />
                                            Tải xuống
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={handleViewDocument}
                                        >
                                            <Eye className="mr-2 h-3.5 w-3.5" />
                                            Xem
                                        </Button>
                                    </div>
                                </div>
                                <p className="text-sm text-muted-foreground">
                                    Khởi tạo tài liệu
                                </p>
                                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                    <span>
                                        Cập nhật bởi {document.createdByName}
                                    </span>
                                    <span>
                                        {formatDateToFullOptions(
                                            document.created_at
                                        )}
                                    </span>
                                </div>
                            </div>
                        </div>
                        {/* ))} */}
                    </div>
                </CardContent>
            </Card>

            <div className="flex justify-end gap-2">
                <Button
                    size="sm"
                    onClick={() => {
                        // setIsVersionModalOpen(true);
                        // onOpenChange(false);
                    }}
                >
                    <History className="mr-2 h-4 w-4" />
                    Tải lên phiên bản mới
                </Button>
            </div>
        </>
    );
}

import { Document } from "@/lib/types/document";
import { Button } from "@/components/ui/button";
import { Sparkles, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import documentApi from "@/lib/apis/documentApi";
import { SUMMARY_ENDPOINT } from "@/lib/constants";

interface DocumentContentTabProps {
    document: Document;
}

export default function DocumentContentTab({
    document,
}: DocumentContentTabProps) {
    const [isLoadingSummary, setIsLoadingSummary] = useState(false);
    const [summary, setSummary] = useState<string>("");
    const [documentContent, setDocumentContent] = useState<string>("");

    const fetchDocumentContent = async () => {
        try {
            const response = await documentApi.getDocumentContentAndSummary(document.id);
            setDocumentContent(response.data.content);
            setSummary(response.data.summary);
        } catch (error) {
            console.error("Error fetching document content:", error);
        }
    };

    useEffect(() => {
        if (document && document.id) {
            fetchDocumentContent();
        }
    }, [document]);

    const handleSummarize = async () => {
        setIsLoadingSummary(true);
        try {
            const response = await fetch(`${SUMMARY_ENDPOINT}/summarize`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    text: documentContent,
                }),
            });

            if (response.ok) {
                const data = await response.json();
                setSummary(data.summary);
            } else {
                setSummary("Không thể tóm tắt nội dung. Vui lòng thử lại sau.");
            }
        } catch (error) {
            console.error("Error summarizing document:", error);
            setSummary("Đã xảy ra lỗi khi tóm tắt nội dung.");
        } finally {
            setIsLoadingSummary(false);
        }
    };

    return (
        <div className="grid gap-4">
            {/* Nội dung văn bản */}
            <div>
                <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-medium">Nội dung văn bản</h3>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={handleSummarize}
                        disabled={isLoadingSummary}
                    >
                        {isLoadingSummary ? (
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        ) : (
                            <Sparkles className="h-4 w-4 mr-2" />
                        )}
                        {isLoadingSummary ? "Đang tóm tắt..." : "Tóm tắt"}
                    </Button>
                </div>
                <div className="border rounded-md p-4 bg-gray-50 max-h-60 overflow-y-auto">
                    <p className="text-sm text-gray-700 whitespace-pre-wrap">
                        {documentContent ||
                            `Nội dung của tài liệu "${document.title}"...\n\nĐây là phần nội dung mẫu của tài liệu. Tạm thời chưa có nội dung thực tế được hiển thị ở đây.`}
                    </p>
                </div>
            </div>

            {/* Tóm tắt */}
            <div>
                <h3 className="text-sm font-medium mb-3">Tóm tắt nội dung</h3>
                <div className="border rounded-md p-4 bg-blue-50">
                    {summary ? (
                        <p className="text-sm text-gray-700 whitespace-pre-wrap">
                            {summary}
                        </p>
                    ) : (
                        <p className="text-sm text-gray-500 italic">
                            Nhấn nút "Tóm tắt" để tạo tóm tắt nội dung tài liệu
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}

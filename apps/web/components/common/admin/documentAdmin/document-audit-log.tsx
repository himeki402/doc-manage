import React, { useState, useEffect } from "react";
import {
    Activity,
    User,
    FileText,
    Clock,
    Search,
    ChevronDown,
    Tag,
    CheckCircle,
    Edit,
    Plus,
    AlertCircle,
    Heart,
    Image,
} from "lucide-react";
import documentApi from "@/lib/apis/documentApi";
import { AuditLog } from "@/lib/types/auditLog";

interface AuditLogProps {
    documentId?: string;
}

interface ActionConfig {
    icon: React.ComponentType<{ className?: string }>;
    label: string;
    color: string;
    bgColor: string;
    borderColor: string;
}

const AuditLogComponent = ({ documentId }: AuditLogProps) => {
    const [logs, setLogs] = useState<AuditLog[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [selectedActionType, setSelectedActionType] = useState<string>("");
    const [selectedDateRange, setSelectedDateRange] = useState<string>("");

    const actionTypeConfig: Record<string, ActionConfig> = {
        UPDATE_DOCUMENT: {
            icon: Edit,
            label: "Cập nhật tài liệu",
            color: "text-blue-600",
            bgColor: "bg-blue-50",
            borderColor: "border-blue-200",
        },
        ADD_TAG: {
            icon: Tag,
            label: "Thêm thẻ",
            color: "text-green-600",
            bgColor: "bg-green-50",
            borderColor: "border-green-200",
        },
        APPROVE_DOCUMENT: {
            icon: CheckCircle,
            label: "Phê duyệt tài liệu",
            color: "text-emerald-600",
            bgColor: "bg-emerald-50",
            borderColor: "border-emerald-200",
        },
        REQUEST_APPROVAL: {
            icon: AlertCircle,
            label: "Yêu cầu phê duyệt",
            color: "text-orange-600",
            bgColor: "bg-orange-50",
            borderColor: "border-orange-200",
        },
        CREATE_DOCUMENT: {
            icon: Plus,
            label: "Tạo tài liệu",
            color: "text-purple-600",
            bgColor: "bg-purple-50",
            borderColor: "border-purple-200",
        },
        LIKE_DOCUMENT: {
            icon: Heart,
            label: "Thích tài liệu",
            color: "text-pink-600",
            bgColor: "bg-pink-50",
            borderColor: "border-pink-200",
        },
        DISLIKE_DOCUMENT: {
            icon: Heart,
            label: "Không thích tài liệu",
            color: "text-gray-600",
            bgColor: "bg-gray-50",
            borderColor: "border-gray-200",
        },
        CREATE_IMAGE_DOCUMENT: {
            icon: Image,
            label: "Tạo tài liệu hình ảnh",
            color: "text-indigo-600",
            bgColor: "bg-indigo-50",
            borderColor: "border-indigo-200",
        },
        REMOVE_DOCUMENT_FROM_GROUP: {
            icon: FileText,
            label: "Xóa tài liệu khỏi nhóm",
            color: "text-red-600",
            bgColor: "bg-red-50",
            borderColor: "border-red-200",
        },
    };

    useEffect(() => {
        fetchAuditLogs();
    }, [documentId]);

    const fetchAuditLogs = async () => {
        if (!documentId) {
            setLogs([]);
            setLoading(false);
            return;
        }
        try {
            setLoading(true);
            setError(null);
            const data = await documentApi.getDocumentAuditLogs(documentId);
            if (Array.isArray(data)) {
                setLogs(data);
            } else if (
                data &&
                typeof data === "object" &&
                data.data &&
                Array.isArray(data.data)
            ) {
                setLogs(data.data);
            } else if (
                data &&
                typeof data === "object" &&
                data.logs &&
                Array.isArray(data.logs)
            ) {
                setLogs(data.logs);
            } else {
                console.warn("API response is not an array:", data);
                setLogs([]);
            }
        } catch (err: any) {
            console.error("Error fetching audit logs:", err);
            setError(err.message || "Không thể tải nhật ký kiểm tra");
            setLogs([]);
        } finally {
            setLoading(false);
        }
    };

    const formatDateTime = (timestamp: string) => {
        const date = new Date(timestamp);
        return {
            date: date.toLocaleDateString("vi-VN"),
            time: date.toLocaleTimeString("vi-VN", {
                hour: "2-digit",
                minute: "2-digit",
            }),
        };
    };

    const getRelativeTime = (timestamp: string): string => {
        const now = new Date();
        const logTime = new Date(timestamp);
        const diffInMinutes = Math.floor(
            (now.getTime() - logTime.getTime()) / (1000 * 60)
        );

        if (diffInMinutes < 1) return "Vừa xong";
        if (diffInMinutes < 60) return `${diffInMinutes} phút trước`;

        const diffInHours = Math.floor(diffInMinutes / 60);
        if (diffInHours < 24) return `${diffInHours} giờ trước`;

        const diffInDays = Math.floor(diffInHours / 24);
        if (diffInDays < 7) return `${diffInDays} ngày trước`;

        return formatDateTime(timestamp).date;
    };

    const getActionDetails = (log: AuditLog): string => {
        if (
            typeof log.action_details === "object" &&
            log.action_details !== null &&
            "tag_name" in log.action_details
        ) {
            return `Đã thêm thẻ "${log.action_details.tag_name}"`;
        }

        switch (log.action_type) {
            case "UPDATE_DOCUMENT":
                return "Đã cập nhật thông tin tài liệu";
            case "APPROVE_DOCUMENT":
                return "Đã phê duyệt tài liệu";
            case "REQUEST_APPROVAL":
                return "Đã gửi yêu cầu phê duyệt";
            case "CREATE_DOCUMENT":
                return "Đã tạo tài liệu mới";
            case "ADD_TAG":
                return `Đã thêm thẻ "${log.action_details.tag_name}"`;
            case "DELETE_DOCUMENT":
                return "Đã xóa tài liệu";
            case "LIKE_DOCUMENT":
                return "Đã thích tài liệu";
            case "DISLIKE_DOCUMENT":
                return "Đã không thích tài liệu";
            case "CREATE_IMAGE_DOCUMENT":
                return "Đã tạo tài liệu hình ảnh";
            case "REMOVE_DOCUMENT_FROM_GROUP":
                return "Đã xóa tài liệu khỏi nhóm";

            default:
                return typeof log.action_details === "string"
                    ? log.action_details
                    : "Không có chi tiết";
        }
    };

    const filteredLogs = logs.filter((log) => {
        const matchesSearch =
            !searchTerm ||
            log.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            log.document.title
                .toLowerCase()
                .includes(searchTerm.toLowerCase()) ||
            getActionDetails(log)
                .toLowerCase()
                .includes(searchTerm.toLowerCase());

        const matchesActionType =
            !selectedActionType || log.action_type === selectedActionType;

        const matchesDateRange =
            !selectedDateRange ||
            (() => {
                const logDate = new Date(log.timestamp);
                const now = new Date();

                switch (selectedDateRange) {
                    case "today":
                        return logDate.toDateString() === now.toDateString();
                    case "week":
                        return (
                            now.getTime() - logDate.getTime() <=
                            7 * 24 * 60 * 60 * 1000
                        );
                    case "month":
                        return (
                            now.getTime() - logDate.getTime() <=
                            30 * 24 * 60 * 60 * 1000
                        );
                    default:
                        return true;
                }
            })();

        return matchesSearch && matchesActionType && matchesDateRange;
    });

    const uniqueActionTypes = [...new Set(logs.map((log) => log.action_type))];

    if (loading) {
        return (
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
                <div className="p-6 border-b border-gray-200">
                    <div className="flex items-center gap-2">
                        <Activity className="h-5 w-5 text-gray-600" />
                        <h3 className="text-lg font-semibold text-gray-900">
                            Nhật ký kiểm tra
                        </h3>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">
                        Theo dõi tất cả các hoạt động và thay đổi liên quan đến
                        tài liệu này.
                    </p>
                </div>

                <div className="p-6">
                    <div className="animate-pulse space-y-4">
                        {[1, 2, 3, 4, 5].map((i) => (
                            <div key={i} className="flex items-start gap-4">
                                <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                                <div className="flex-1 space-y-2">
                                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
                <div className="p-6 border-b border-gray-200">
                    <div className="flex items-center gap-2">
                        <Activity className="h-5 w-5 text-gray-600" />
                        <h3 className="text-lg font-semibold text-gray-900">
                            Nhật ký kiểm tra
                        </h3>
                    </div>
                </div>

                <div className="p-6 text-center">
                    <AlertCircle className="h-12 w-12 mx-auto mb-4 text-red-400" />
                    <h4 className="text-lg font-medium text-gray-900 mb-2">
                        Không thể tải nhật ký
                    </h4>
                    <p className="text-gray-500 mb-4">{error}</p>
                    <button
                        onClick={fetchAuditLogs}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        Thử lại
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
            {/* Filters */}
            <div className="p-6 border-b border-gray-200 bg-gray-50">
                <div className="flex flex-col sm:flex-row gap-4">
                    {/* Search */}
                    <div className="flex-1">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Tìm kiếm theo tên người dùng, hoạt động..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                    </div>

                    {/* Action Type Filter */}
                    <div className="relative">
                        <select
                            value={selectedActionType}
                            onChange={(
                                e: React.ChangeEvent<HTMLSelectElement>
                            ) => setSelectedActionType(e.target.value)}
                            className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                            <option value="">Tất cả hoạt động</option>
                            {uniqueActionTypes.map((type) => (
                                <option key={type} value={type}>
                                    {actionTypeConfig[type]?.label || type}
                                </option>
                            ))}
                        </select>
                        <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                    </div>

                    {/* Date Range Filter */}
                    <div className="relative">
                        <select
                            value={selectedDateRange}
                            onChange={(e) =>
                                setSelectedDateRange(e.target.value)
                            }
                            className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                            <option value="">Tất cả thời gian</option>
                            <option value="today">Hôm nay</option>
                            <option value="week">7 ngày qua</option>
                            <option value="month">30 ngày qua</option>
                        </select>
                        <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="p-6">
                {filteredLogs.length === 0 ? (
                    <div className="text-center py-12">
                        <Activity className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                        <h4 className="text-lg font-medium text-gray-900 mb-2">
                            {logs.length === 0
                                ? "Chưa có hoạt động nào"
                                : "Không tìm thấy kết quả"}
                        </h4>
                        <p className="text-gray-500 max-w-md mx-auto">
                            {logs.length === 0
                                ? "Các hoạt động trên tài liệu này sẽ được hiển thị tại đây."
                                : "Thử thay đổi bộ lọc để xem thêm kết quả."}
                        </p>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {filteredLogs.map((log, index) => {
                            const config = actionTypeConfig[
                                log.action_type
                            ] || {
                                icon: Activity,
                                label: log.action_type,
                                color: "text-gray-600",
                                bgColor: "bg-gray-50",
                                borderColor: "border-gray-200",
                            };
                            const Icon = config.icon;
                            const dateTime = formatDateTime(log.timestamp);

                            return (
                                <div key={log.log_id} className="relative">
                                    {/* Timeline line */}
                                    {index < filteredLogs.length - 1 && (
                                        <div className="absolute left-5 top-12 w-px h-16 bg-gray-200"></div>
                                    )}

                                    <div className="flex items-start gap-4">
                                        {/* Icon */}
                                        <div
                                            className={`flex-shrink-0 w-10 h-10 rounded-full ${config.bgColor} ${config.borderColor} border-2 flex items-center justify-center`}
                                        >
                                            <Icon
                                                className={`h-5 w-5 ${config.color}`}
                                            />
                                        </div>

                                        {/* Content */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-start justify-between">
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <span
                                                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.bgColor} ${config.color}`}
                                                        >
                                                            {config.label}
                                                        </span>
                                                        <span className="text-xs text-gray-500">
                                                            {getRelativeTime(
                                                                log.timestamp
                                                            )}
                                                        </span>
                                                    </div>

                                                    <p className="text-sm text-gray-900 font-medium mb-1">
                                                        {getActionDetails(log)}
                                                    </p>

                                                    <div className="flex items-center gap-4 text-xs text-gray-500">
                                                        <div className="flex items-center gap-1">
                                                            <User className="h-3 w-3" />
                                                            <span>
                                                                {log.user.name}
                                                            </span>
                                                        </div>
                                                        <div className="flex items-center gap-1">
                                                            <FileText className="h-3 w-3" />
                                                            <span className="truncate max-w-48">
                                                                {
                                                                    log.document
                                                                        .title
                                                                }
                                                            </span>
                                                        </div>
                                                        <div className="flex items-center gap-1">
                                                            <Clock className="h-3 w-3" />
                                                            <span>
                                                                {dateTime.date}{" "}
                                                                lúc{" "}
                                                                {dateTime.time}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Footer */}
            {filteredLogs.length > 0 && (
                <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
                    <div className="flex items-center justify-between text-sm text-gray-500">
                        <span>
                            Hiển thị {filteredLogs.length} / {logs.length} hoạt
                            động
                        </span>
                        {logs.length > 0 && (
                            <span>
                                Cập nhật lần cuối:{" "}
                                {logs[0]
                                    ? getRelativeTime(logs[0].timestamp)
                                    : ""}
                            </span>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default AuditLogComponent;

"use client";

import type React from "react";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Check, FileText, FolderIcon, HomeIcon, LockIcon, Plus, Upload } from "lucide-react";
import { Document } from "@/lib/types/document";
import { formatDateToFullOptions } from "@/lib/utils";

interface RecentUploadsProps {
    recentUploads: Document[];
    onUploadNew: () => void;
}

export function RecentUploads({ recentUploads, onUploadNew }: RecentUploadsProps) {
    console.log('recentUploads:', recentUploads);
    console.log('IDs:', recentUploads.map(doc => doc?.id));
    console.log('Duplicate IDs:', recentUploads.map(doc => doc?.id).filter((id, index, arr) => arr.indexOf(id) !== index));
    return (
        <Card>
            <CardHeader>
                <CardTitle>Tài liệu đã tải lên gần đây</CardTitle>
                <CardDescription>
                    Danh sách tài liệu bạn đã tải lên gần đây
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="rounded-md border">
                    <ScrollArea className="h-[400px]">
                        <div className="divide-y">
                            {recentUploads.map((doc) => (
                                <div
                                    key={doc.id}
                                    className="flex items-center justify-between p-4 hover:bg-muted/50"
                                >
                                    <div className="flex items-center gap-3">
                                        <div
                                            className={`w-10 h-10 rounded-md flex items-center justify-center ${
                                                doc.mimeType === "application/pdf"
                                                    ? "bg-red-100 text-red-700"
                                                    : doc.mimeType === "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                                                      ? "bg-blue-100 text-blue-700"
                                                      : "bg-amber-100 text-amber-700"
                                            }`}
                                        >
                                            <FileText size={20} />
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium">
                                                {doc.title}
                                            </p>
                                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                                <span>{doc.mimeType==="application/pdf"?"PDF":"Word"}</span>
                                                <span>•</span>
                                                <span>{doc.categoryName}</span>
                                                <span>•</span>
                                                <span>
                                                    Tải lên:{" "}
                                                    {formatDateToFullOptions(doc.created_at)}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {doc.accessType === "PUBLIC" ? (
                                            <Badge
                                                variant="outline"
                                                className="bg-green-50 text-green-700 border-green-200"
                                            >
                                                <Check className="mr-1 h-3 w-3" />{" "}
                                                Public
                                            </Badge>
                                        ) : doc.accessType === "PRIVATE" ? (
                                            <Badge
                                                variant="outline"
                                                className="bg-red-50 text-red-700 border-red-200"
                                            >
                                                <LockIcon className="mr-1 h-3 w-3" />{" "}
                                                Private
                                            </Badge>
                                        ) : (
                                            <Badge
                                                variant="outline"
                                                className="bg-yellow-50 text-yellow-700 border-yellow-200"
                                            >
                                                <HomeIcon className="mr-1 h-3 w-3" />{" "}
                                                Group
                                            </Badge>
                                        )}
                                        <Button variant="ghost" size="sm">
                                            Xem
                                        </Button>
                                    </div>
                                </div>
                            ))}

                            {recentUploads.length === 0 && (
                                <div className="flex flex-col items-center justify-center p-8 text-center">
                                    <FolderIcon className="h-12 w-12 text-muted-foreground mb-4" />
                                    <h3 className="text-lg font-medium">
                                        Chưa có tài liệu nào được tải lên
                                    </h3>
                                    <p className="text-muted-foreground mt-2 mb-4">
                                        Bạn chưa tải lên tài liệu nào. Hãy tải lên
                                        tài liệu đầu tiên của bạn.
                                    </p>
                                    <Button onClick={onUploadNew}>
                                        <Plus className="mr-2 h-4 w-4" /> Tải lên
                                        tài liệu
                                    </Button>
                                </div>
                            )}
                        </div>
                    </ScrollArea>
                </div>
            </CardContent>
            <CardFooter>
                <Button
                    variant="outline"
                    className="w-full"
                    onClick={onUploadNew}
                >
                    <Upload className="mr-2 h-4 w-4" /> Tải lên tài liệu mới
                </Button>
            </CardFooter>
        </Card>
    );
}
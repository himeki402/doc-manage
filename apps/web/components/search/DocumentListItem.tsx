"use client";

import { Document } from "@/lib/types/document";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText, Clock, User, Folder } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";

interface DocumentListItemProps {
    document: Document;
}

export function DocumentListItem({ document }: DocumentListItemProps) {
    return (
        <Card className="group hover:shadow-md transition-shadow">
            <CardContent className="p-4">
                <div className="flex gap-4">
                    {/* Thumbnail */}
                    <Link
                        href={`/doc/${document.id}`}
                        className="relative w-24 h-24 flex-shrink-0 overflow-hidden rounded-md"
                    >
                        {document.thumbnailUrl ? (
                            <Image
                                src={document.thumbnailUrl}
                                alt={document.title}
                                fill
                                className="object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                        ) : (
                            <div className="w-full h-full bg-muted flex items-center justify-center">
                                <FileText className="h-8 w-8 text-muted-foreground" />
                            </div>
                        )}
                    </Link>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-4">
                            <div className="space-y-1">
                                <Link
                                    href={`/doc/${document.id}`}
                                    className="block hover:underline"
                                >
                                    <h3 className="font-semibold line-clamp-1">
                                        {document.title}
                                    </h3>
                                </Link>
                                <p className="text-sm text-muted-foreground line-clamp-2">
                                    {document.description}
                                </p>
                            </div>
                        </div>

                        <div className="mt-2 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                                <Clock className="h-4 w-4" />
                                {formatDistanceToNow(
                                    new Date(document.created_at),
                                    {
                                        addSuffix: true,
                                        locale: vi,
                                    }
                                )}
                            </div>
                            {document.categoryName && (
                                <div className="flex items-center gap-1">
                                    <Folder className="h-4 w-4" />
                                    {document.categoryName}
                                </div>
                            )}
                            {document.createdByName && (
                                <div className="flex items-center gap-1">
                                    <User className="h-4 w-4" />
                                    {document.createdByName}
                                </div>
                            )}
                        </div>

                        <div className="mt-2 flex flex-wrap gap-2">
                            {document.tags?.map((tag) => (
                                <Badge
                                    key={tag.id}
                                    variant="secondary"
                                    className="text-xs"
                                >
                                    {tag.name}
                                </Badge>
                            ))}
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

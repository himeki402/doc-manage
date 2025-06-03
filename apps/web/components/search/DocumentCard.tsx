"use client";

import { Document } from "@/lib/types/document";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileText, Download, Eye, Clock, User, Folder } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";

interface DocumentCardProps {
    document: Document;
}

export function DocumentCard({ document }: DocumentCardProps) {
    return (
        <Card className="group hover:shadow-md transition-shadow">
            <Link href={`/doc/${document.id}`} className="block">
                <div className="relative aspect-[4/3] overflow-hidden">
                    {document.thumbnailUrl ? (
                        <Image
                            src={document.thumbnailUrl}
                            alt={document.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                    ) : (
                        <div className="w-full h-full bg-muted flex items-center justify-center">
                            <FileText className="h-12 w-12 text-muted-foreground" />
                        </div>
                    )}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <Button variant="secondary" size="sm">
                            <Eye className="h-4 w-4 mr-2" />
                            Xem chi tiết
                        </Button>
                    </div>
                </div>
            </Link>
            <CardContent className="p-4">
                <div className="space-y-2">
                    <div className="flex items-start justify-between gap-2">
                        <Link
                            href={`/doc/${document.id}`}
                            className="flex-1 hover:underline"
                        >
                            <h3 className="font-semibold line-clamp-2">
                                {document.title}
                            </h3>
                        </Link>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                        {document.description}
                    </p>
                </div>
            </CardContent>
            <CardFooter className="p-4 pt-0">
                <div className="w-full space-y-2">
                    <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
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
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {document.tags?.slice(0, 3).map((tag) => (
                            <Badge
                                key={tag.id}
                                variant="secondary"
                                className="text-xs"
                            >
                                {tag.name}
                            </Badge>
                        ))}
                        {document.tags && document.tags.length > 3 && (
                            <Badge variant="secondary" className="text-xs">
                                +{document.tags.length - 3}
                            </Badge>
                        )}
                    </div>
                </div>
            </CardFooter>
        </Card>
    );
}

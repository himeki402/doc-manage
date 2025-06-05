"use client";

import { useEffect } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface Tag {
    id: string;
    name: string;
    description?: string;
    documentCount?: number;
}

const tagSchema = z.object({
    name: z.string().min(2, "Tên tag phải có ít nhất 2 ký tự"),
    description: z.string().optional(),
});

type TagFormValues = z.infer<typeof tagSchema>;

interface TagDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSave: (tag: Tag) => void;
    tag?: Tag | null;
}

export function TagDialog({
    open,
    onOpenChange,
    onSave,
    tag = null,
}: TagDialogProps) {
    const form = useForm<TagFormValues>({
        resolver: zodResolver(tagSchema),
        defaultValues: {
            name: "",
            description: "",
        },
    });

    useEffect(() => {
        if (open) {
            if (tag) {
                form.reset({
                    name: tag.name,
                    description: tag.description || "",
                });
            } else {
                form.reset({
                    name: "",
                    description: "",
                });
            }
        }
    }, [open, tag, form]);

    const onSubmit = (data: TagFormValues) => {
        onSave({
            id: tag?.id || "",
            name: data.name,
            description: data.description || "",
            documentCount: tag?.documentCount || 0,
        });
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle>{tag ? "Sửa Tag" : "Thêm Tag"}</DialogTitle>
                    <DialogDescription>
                        {tag
                            ? "Chỉnh sửa thông tin cho tag này."
                            : "Tạo một tag mới để tổ chức tài liệu."}
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-4"
                    >
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Name</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Tag name"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Mô tả</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="Mô tả ngắn gọn về tag này (tùy chọn)"
                                            className="resize-none"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <DialogFooter>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => onOpenChange(false)}
                            >
                                Hủy
                            </Button>
                            <Button type="submit">
                                {tag ? "Lưu thay đổi" : "Tạo tag"}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}

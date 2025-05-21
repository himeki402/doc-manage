"use client";

import { useEffect } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
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
// Validation schema
const groupSchema = z.object({
    name: z.string().min(2, "Tên nhóm phải có ít nhất 2 ký tự"),
    description: z.string().optional(),
});

// Form values type
type GroupFormValues = z.infer<typeof groupSchema>;

// Props
interface CreateGroupDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSave: (group: any) => void;
}

export function CreateGroupDialog({
    open,
    onOpenChange,
    onSave,
}: CreateGroupDialogProps) {
    const form = useForm<GroupFormValues>({
        resolver: zodResolver(groupSchema),
        defaultValues: {
            name: "",
            description: "",
        },
    });

    useEffect(() => {
        if (open) {
            form.reset({
                name: "",
                description: "",
            });
        }
    }, [open, form]);

    const onSubmit = async (data: GroupFormValues) => {
        try {
            onSave({
                name: data.name,
                description: data.description || "",
            });
            onOpenChange(false);
        } catch (error) {
            console.error("Error creating group:", error);
            form.setError("root", { message: "Lỗi khi tạo nhóm" });
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Tạo nhóm mới</DialogTitle>
                    <DialogDescription>
                        Tạo nhóm mới để chia sẻ tài liệu
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="grid gap-4 py-4"
                    >
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem className="grid gap-2">
                                    <FormLabel>Tên nhóm</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Nhập tên nhóm"
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
                                <FormItem className="grid gap-2">
                                    <FormLabel>Mô tả nhóm</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="Nhập mô tả nhóm"
                                            rows={3}
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
                            <Button
                                type="submit"
                                disabled={form.formState.isSubmitting}
                            >
                                {form.formState.isSubmitting
                                    ? "Đang tạo..."
                                    : "Tạo nhóm"}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}

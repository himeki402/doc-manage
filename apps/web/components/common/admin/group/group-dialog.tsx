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
import { Group } from "@/lib/types/group";
import { toast } from "sonner";
import groupApi from "@/lib/apis/groupApi";

const groupSchema = z.object({
  name: z.string().min(2, "Tên nhóm phải có ít nhất 2 ký tự"),
  description: z.string().optional(),
});

type GroupFormValues = z.infer<typeof groupSchema>;

interface GroupDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (group: Group) => void;
  group?: Group | null;
  isSaving?: boolean;
}

export function GroupDialog({
  open,
  onOpenChange,
  onSave,
  group = null,
  isSaving = false,
}: GroupDialogProps) {
  const form = useForm<GroupFormValues>({
    resolver: zodResolver(groupSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  useEffect(() => {
    if (open) {
      if (group) {
        form.reset({
          name: group.name,
          description: group.description || "",
        });
      } else {
        form.reset({
          name: "",
          description: "",
        });
      }
    }
  }, [open, group, form]);

 const onSubmit = async (data: GroupFormValues) => {
    try {
      let savedGroup: Group;
      if (group) {
        savedGroup = await groupApi.updateGroup(group.id, {
          name: data.name,
          description: data.description || "",
        });
      } else {
        savedGroup = await groupApi.createGroup({
          name: data.name,
          description: data.description || "",
        });
      }

      onSave(savedGroup);
      toast.success(group ? "Đã chỉnh sửa nhóm thành công" : "Tạo nhóm thành công");
      onOpenChange(false);
    } catch (error: any) {
      console.error("Error saving group:", error);
      toast.error(
        error.errors
          ? error.errors.join(", ")
          : error.message || "Lỗi khi lưu nhóm"
      );
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{group ? "Chỉnh sửa nhóm" : "Tạo nhóm mới"}</DialogTitle>
          <DialogDescription>
            {group
              ? "Chỉnh sửa chi tiết cho nhóm này."
              : "Tạo một nhóm mới để tổ chức tài liệu và thành viên."}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tên nhóm</FormLabel>
                  <FormControl>
                    <Input placeholder="Tên nhóm" {...field} />
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
                      placeholder="Mô tả ngắn về nhóm này (tùy chọn)"
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
              <Button type="submit">{group ? "Lưu thay đổi" : "Tạo nhóm"}</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
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
}

export function GroupDialog({
  open,
  onOpenChange,
  onSave,
  group = null,
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
      let response;
      if (group) {
        response = await fetch(`/api/groups/${group.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });
      } else {
        // Create new group (assume userId is available, e.g., from auth context)
        const userId = "current-user-id"; // Replace with actual userId from auth
        response = await fetch("/api/groups", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...data, createdBy: userId }),
        });
      }

      if (!response.ok) {
        throw new Error("Failed to save group");
      }

      const savedGroup: Group = await response.json().then((res) => res.data);

      // Call onSave with the saved group
      onSave(savedGroup);
      onOpenChange(false);
    } catch (error) {
      console.error("Error saving group:", error);
      // Optionally show error message in UI
      form.setError("root", { message: "Lỗi khi lưu nhóm" });
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
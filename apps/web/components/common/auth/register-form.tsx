"use client";

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
import { Loader2 } from "lucide-react";
import { useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema } from "@/lib/validations/registerSchema";
import { toast } from "sonner";
import { Register } from "@/lib/actions/auth/register";
import { useActionState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterForm() {
    const nameInputRef = useRef<HTMLInputElement>(null);
    const router = useRouter();
    const [state, formAction, isPending] = useActionState(Register, undefined);

    const form = useForm<z.infer<typeof registerSchema>>({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            name: "",
            username: "",
            password: "",
            confirmPassword: "",
        },
    });

    useEffect(() => {
        if (nameInputRef.current) {
            nameInputRef.current.focus();
        }
    }, []);

    useEffect(() => {
        if (state?.error) {
            const errorMessages = Object.values(state.error).flat().join(", ");
            toast.error(`Lỗi: ${errorMessages}`);
            Object.entries(state.error).forEach(([key, errors]) => {
                form.setError(key as keyof z.infer<typeof registerSchema>, {
                    message: errors[0],
                });
            });
        } else if (state?.message) {
            toast.error(state.message);
        } else if (state?.success) {
            toast.success("Đăng ký thành công!");
            router.push("/login");
            router.refresh();
        }
    }, [state, form, router]);

    return (
        <div className="container mx-auto p-4 max-w-md">
            <Form {...form}>
                <form action={formAction} className="space-y-4">
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Họ và tên</FormLabel>
                                <FormControl>
                                    <Input
                                        {...field}
                                        ref={nameInputRef}
                                        placeholder="Nhập họ tên"
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="username"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Tên đăng nhập</FormLabel>
                                <FormControl>
                                    <Input
                                        {...field}
                                        placeholder="Nhập tên đăng nhập"
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Mật khẩu</FormLabel>
                                <FormControl>
                                    <Input
                                        type="password"
                                        {...field}
                                        placeholder="Nhập mật khẩu"
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="confirmPassword"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Xác nhận mật khẩu</FormLabel>
                                <FormControl>
                                    <Input
                                        type="password"
                                        {...field}
                                        placeholder="Nhập lại mật khẩu"
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <Button
                        type="submit"
                        className="w-full bg-red-500 hover:bg-red-700"
                        disabled={isPending}
                    >
                        {isPending ? (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                            "Đăng ký"
                        )}
                    </Button>
                </form>
            </Form>
            <div className="text-center text-sm text-muted-foreground mt-4">
                Bạn đã có tài khoản?{" "}
                <Link
                    href="/login"
                    className="font-normal text-primary hover:underline"
                >
                    <Button variant="link" className="font-normal" size="sm">
                        Hãy đăng nhập
                    </Button>
                </Link>
            </div>
        </div>
    );
}

"use client";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useActionState, useEffect, useRef, startTransition } from "react";
import { Login } from "@/lib/actions/auth/login";
import {
    Form,
    FormField,
    FormItem,
    FormLabel,
    FormControl,
    FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { loginSchema } from "@/lib/validations/loginSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export function LoginForm({
    className,
    ...props
}: React.ComponentPropsWithoutRef<"div">) {
    const usernameInputRef = useRef<HTMLInputElement>(null);
    const [state, formAction, isPending] = useActionState(Login, undefined);
    const router = useRouter();

    const form = useForm<z.infer<typeof loginSchema>>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            username: "",
            password: "",
        },
    });

    useEffect(() => {
        if (usernameInputRef.current) {
            usernameInputRef.current.focus();
        }
    }, []);

    useEffect(() => {
        if (state) {
            if (state.error) {
                Object.entries(state.error).forEach(([key, errors]) => {
                    if (Array.isArray(errors) && errors.length > 0) {
                        form.setError(
                            key as keyof z.infer<typeof loginSchema>,
                            {
                                message: errors[0],
                            }
                        );
                    }
                });
                toast.error("Vui lòng kiểm tra lại thông tin đăng nhập");
            } else if (!state.success && state.message) {
                toast.error(state.message);
            } else if (state.success) {
                toast.success("Đăng nhập thành công");
                setTimeout(() => {
                    router.push("/");
                    router.refresh();
                }, 1000);
            }
        }
    }, [state, form, router]);

    function onSubmit(data: z.infer<typeof loginSchema>) {
        const formData = new FormData();
        formData.append("username", data.username);
        formData.append("password", data.password);

        startTransition(() => {
            formAction(formData);
        });
    }

    return (
        <div className={cn("grid gap-6", className)} {...props}>
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-4"
                >
                    <FormField
                        control={form.control}
                        name="username"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Tên đăng nhập</FormLabel>
                                <FormControl>
                                    <Input
                                        {...field}
                                        ref={usernameInputRef}
                                        disabled={isPending}
                                        placeholder="Nhập tên đăng nhập"
                                        autoComplete="username"
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
                                <div className="flex items-center justify-between">
                                    <FormLabel>Mật khẩu</FormLabel>
                                    <Button
                                        variant="link"
                                        className="px-0 font-normal"
                                        size="sm"
                                    >
                                        Quên mật khẩu?
                                    </Button>
                                </div>
                                <FormControl>
                                    <Input
                                        {...field}
                                        disabled={isPending}
                                        type="password"
                                        placeholder="Nhập mật khẩu"
                                        autoComplete="current-password"
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <Button
                        type="submit"
                        className="w-full"
                        disabled={isPending}
                    >
                        {isPending ? "Đang đăng nhập..." : "Đăng nhập"}
                    </Button>
                </form>
            </Form>

            <div className="relative">
                <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">
                        Hoặc tiếp tục với
                    </span>
                </div>
            </div>

            <Button variant="outline" type="button" disabled={isPending}>
                <svg
                    className="mr-2 h-4 w-4"
                    aria-hidden="true"
                    focusable="false"
                    data-prefix="fab"
                    data-icon="google"
                    role="img"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 488 512"
                >
                    <path
                        fill="currentColor"
                        d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"
                    ></path>
                </svg>
                Đăng nhập với Google
            </Button>

            <div className="text-center text-sm text-muted-foreground">
                Chưa có tài khoản?{" "}
                <Button variant="link" className="font-normal" size="sm">
                    Đăng ký ngay
                </Button>
            </div>
        </div>
    );
}

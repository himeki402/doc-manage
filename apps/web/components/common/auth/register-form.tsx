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
import { useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema } from "@/lib/validations/registerSchema";
import { toast } from "sonner";
import { Register } from "@/lib/actions/auth/register";
import { useActionState } from "react";

export default function RegisterForm() {
    const nameInputRef = useRef<HTMLInputElement>(null);
    const [state, formAction, isPending] = useActionState(Register, undefined);

    useEffect(() => {
        if (nameInputRef.current) {
            nameInputRef.current.focus();
        }
    }, []);

    const form = useForm<z.infer<typeof registerSchema>>({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            name: "",
            username: "",
            password: "",
        },
    });

    useEffect(() => {
        if (state?.error) {
            Object.entries(state.error).forEach(([key, errors]) => {
                form.setError(key as keyof z.infer<typeof registerSchema>, {
                    message: errors[0],
                });
            });
            toast("Validation Error");
        } else if (state?.message) {
            toast.error(state.message);
        } else if (state?.success) {
            toast.success("Đăng ký thành công!");
            window.location.href = "/dashboard"; 
        }
    }, [state, form]);

    return (
        <Form {...form}>
            <form action={formAction} className="space-y-4">
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Name</FormLabel>
                            <FormControl>
                                <Input {...field} />
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
                            <FormLabel>Username</FormLabel>
                            <FormControl>
                                <Input {...field} />
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
                            <FormLabel>Password</FormLabel>
                            <FormControl>
                                <Input type="password" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Xác nhận mật khẩu</FormLabel>
                            <FormControl>
                                <Input type="password" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                /> */}

                <Button
                    type="submit"
                    className="w-full"
                    disabled={form.formState.isSubmitting}
                >
                    {isPending ? "Loading..." : "Sign up"}
                </Button>
            </form>
        </Form>
    );
}

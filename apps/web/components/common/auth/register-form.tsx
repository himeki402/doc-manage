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
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Register } from "@/app/services/authService/authService";
import { registerSchema } from "@/lib/validations/registerSchema";
import { toast } from "sonner";

export default function RegisterForm() {
    const [isLoading, setIsLoading] = useState(false);
    const nameInputRef = useRef<HTMLInputElement>(null);

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

    const onSubmit = async (data: z.infer<typeof registerSchema>) => {
        setIsLoading(true);
        try {
            const formData = new FormData();
            formData.append("name", data.name);
            formData.append("username", data.username);
            formData.append("password", data.password);

            const result = await Register({}, formData);
            console.log("Error:", result.error);
            console.log("Message:", result.message);

            if (result.error) {
                console.log("Entering error toast path");
                toast("Validation Error");
            } else if (result.message) {
                console.log("Entering message toast path");
                toast("Registration Error");
            }
        } catch (err) {
            toast("Registration Failure");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                            <FormLabel>Mật khẩu</FormLabel>
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

                <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? "Đang xử lý..." : "Đăng ký"}
                </Button>
            </form>
        </Form>
    );
}

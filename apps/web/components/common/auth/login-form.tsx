'use client'
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useActionState, useEffect, useRef } from "react";
import { Login } from "@/lib/actions/auth/login";
import { Form } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { loginSchema } from "@/lib/validations/loginSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

export function LoginForm({
    className,
    ...props
}: React.ComponentPropsWithoutRef<"div">) {
    const usernameInputRef = useRef<HTMLInputElement>(null);
    const [state, formAction, isPending] = useActionState(Login, undefined);

    
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
        if (state?.error) {
            Object.entries(state.error).forEach(([key, errors]) => {
                form.setError(key as keyof z.infer<typeof loginSchema>, {
                    message: errors[0],
                });
            });
            toast("Validation Error");
        } else if (state?.message) {
            toast.error(state.message);
        } else if (state?.success) {
            toast.success("Login Success");
            window.location.href = "/dashboard"; 
        }
    }, [state, form]);
    return (
        <div className={cn("flex flex-col gap-6", className)} {...props}>
            <Card>
                <CardHeader>
                    <CardTitle className="text-2xl">Login</CardTitle>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form action={formAction}>
                            <div className="flex flex-col gap-6">
                                <div className="grid gap-2">
                                    <Label htmlFor="email">Username</Label>
                                    <Input
                                        ref={usernameInputRef}
                                        id="username"
                                        type="username"
                                        placeholder=""
                                        required
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <div className="flex items-center">
                                        <Label htmlFor="password">
                                            Password
                                        </Label>
                                        <a
                                            href="#"
                                            className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                                        >
                                            Forgot your password?
                                        </a>
                                    </div>
                                    <Input
                                        id="password"
                                        type="password"
                                        required
                                    />
                                </div>
                                <Button type="submit" className="w-full">
                                    Login
                                </Button>
                                <Button variant="outline" className="w-full">
                                    Login with Google
                                </Button>
                            </div>
                            <div className="mt-4 text-center text-sm">
                                Don&apos;t have an account?{" "}
                                <a
                                    href="/register"
                                    className="underline underline-offset-4"
                                >
                                    Sign up
                                </a>
                            </div>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    );
}

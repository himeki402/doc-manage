'use client'
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useActionState, useEffect, useRef, startTransition } from "react";
import { Login } from "@/lib/actions/auth/login";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
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
    
    // Fixed function to handle form submission
    function onSubmit(data: z.infer<typeof loginSchema>) {
        const formData = new FormData();
        
        formData.append("username", data.username);
        formData.append("password", data.password);
        
        // Use startTransition to dispatch the action
        startTransition(() => {
            formAction(formData);
        });
    }
    
    return (
        <div className={cn("flex flex-col gap-6", className)} {...props}>
            <Card>
                <CardHeader>
                    <CardTitle className="text-2xl">Login</CardTitle>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)}>
                            <div className="flex flex-col gap-6">
                                <FormField
                                    control={form.control}
                                    name="username"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Username</FormLabel>
                                            <FormControl>
                                                <Input
                                                    {...field}
                                                    ref={usernameInputRef}
                                                    id="username" 
                                                    placeholder="Enter your username"
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
                                            <div className="flex items-center">
                                                <FormLabel>Password</FormLabel>
                                                <a
                                                    href="#"
                                                    className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                                                >
                                                    Forgot your password?
                                                </a>
                                            </div>
                                            <FormControl>
                                                <Input
                                                    {...field}
                                                    id="password"
                                                    type="password"
                                                    placeholder="Enter your password"
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <Button type="submit" className="w-full" disabled={isPending}>
                                    {isPending ? "Logging in..." : "Login"}
                                </Button>
                                <Button type="button" variant="outline" className="w-full">
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
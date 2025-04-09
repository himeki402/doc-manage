import RegisterForm from "@/components/common/auth/register-form";
import poster from "@/public/login.i1.png";
import Image from "next/image";

export default function LoginPage() {
    return (
        <div className="container relative min-h-svh flex-col items-center justify-center grid lg:max-w-none lg:grid-cols-[1.4fr_1fr] lg:px-0">
            <div className="lg:p-8 lg:pr-0">
                <div className="mx-auto flex w-full flex-col justify-start max-w-md pb-12">
                    <div className="flex items-start mb-8">
                        <div className="bg-primary w-12 h-12 rounded-lg flex items-center justify-center">
                            <svg
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                                className="text-white"
                            >
                                <path
                                    d="M12 4L4 8L12 12L20 8L12 4Z"
                                    fill="currentColor"
                                />
                                <path
                                    d="M4 12L12 16L20 12"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                                <path
                                    d="M4 16L12 20L20 16"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            </svg>
                        </div>
                        <div className="ml-3">
                            <h2 className="text-xl font-bold text-foreground">
                                KMA Document
                            </h2>
                            <p className="text-sm text-muted-foreground">
                                Hệ thống quản lý tài liệu
                            </p>
                        </div>
                    </div>
                    <RegisterForm />
                </div>
            </div>

            <div className="relative hidden lg:flex h-full">
                <Image
                    src={poster}
                    alt="KMA Document Poster"
                    fill
                    className="object-cover"
                    priority
                />
            </div>
        </div>
    );
}

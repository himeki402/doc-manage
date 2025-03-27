'use server'
import RegisterForm from "@/components/common/auth/register-form";

export default async function RegisterPage() {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <div className="flex w-full justify-center text-2xl font-bold mb-4">Register</div>
        <RegisterForm />
      </div>
    </div>
  )
}

import Image from "next/image";
import { Card } from "@/components/ui/card";
import { LoginForm } from "./_components/LoginForm";
import { APP_NAME } from "@/utils/constants";

export default function LoginPage() {
  return (
    <main className="flex min-h-screen w-full items-center justify-center bg-slate-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-6">
        {/* Branding & Logo: Icon and Name side-by-side */}
        <div className="flex justify-center">
          <div className="flex items-center justify-center gap-3">
            <Image
              src="/images/sacflow-icon.svg"
              alt={APP_NAME}
              width={48}
              height={48}
              className="h-12 w-12 rounded-xl object-contain"
              priority
              unoptimized
            />
            <span className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              {APP_NAME}
            </span>
          </div>
        </div>

        {/* Login Form Card */}
        <Card className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-7">
          <LoginForm />
        </Card>
      </div>
    </main>
  );
}

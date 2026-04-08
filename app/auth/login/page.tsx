import { LayoutDashboard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { LoginWithGoogle } from "@/components/login-form";
import Link from "next/link";
import Image from "next/image";

export default function LoginPage() {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10 bg-gradient-to-l from-[#022B16] via-30% via-black to-black">
        <div className="flex justify-center gap-2 md:justify-start">
          <a href="#" className="flex items-center gap-2 font-medium text-white">
            <div className="flex h-6 w-6 items-center justify-center rounded-md text-primary-foreground">
              <Image src="/logomain.png" alt="Logo" width={24} height={24} />
            </div>
            DAVA Inc.
          </a>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            {/* Login Page */}
            <div className={cn("flex flex-col gap-6")}>
              <div className="flex flex-col items-center gap-2 text-center">
                <h1 className="text-2xl font-bold text-white">Login to your account</h1>
                <p className="text-gray-300 text-sm text-balance">
                  Continue with Google to access your account
                </p>
              </div>

              <div className="grid gap-6">
                <LoginWithGoogle className="w-full bg-white/10 hover:bg-white/20 text-white border-gray-600" />
              </div>

              {/* Redirecting to Sign up Page */}

              <div className="text-center text-sm text-gray-300">
                Don&apos;t have an account?{" "}
                <Link
                  href="/auth/signup"
                  className="underline underline-offset-4 text-emerald-400 hover:text-emerald-300"
                >
                  Sign up
                </Link>
              </div>
            </div>
            {/* End of Login Page */}
          </div>
        </div>
      </div>
      <div className="relative hidden bg-muted lg:block">
        <Image
          src="/login.png"
          alt="Image"
          className="absolute inset-0 h-full w-full object-cover"
          width={100}
          height={100}
        />
      </div>
    </div>
  );
}
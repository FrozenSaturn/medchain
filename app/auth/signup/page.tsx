import { LayoutDashboard } from "lucide-react";
import { signup } from "../actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import Image from "next/image";

export default function LoginPage() {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10 bg-gradient-to-l from-[#022B16] via-30% via-black to-black">
        <div className="flex justify-center gap-2 md:justify-start">
          <a href="#" className="flex items-center gap-2 font-medium">
            <div className="flex h-6 w-6 items-center justify-center rounded-md text-primary-foreground">
              <Image src="/logomain.png" alt="Logo" width={24} height={24} />
            </div>
            DAVA Inc.
          </a>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            {/* SignUp Page */}
            <div className={cn("flex flex-col gap-6")}>
              <div className="flex flex-col items-center gap-2 text-center">
                <h1 className="text-2xl font-bold">
                  SignUp your account for DAVA
                </h1>
                <p className="text-muted-foreground text-sm text-balance">
                  Enter your email below to Signup
                </p>
              </div>

              <div className="grid gap-6">
                <form>
                  <div className="flex flex-col gap-3">
                    <div className="grid gap-3">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" name="email" type="email" required />
                    </div>
                    <div className="grid gap-3">
                      <div className="flex items-center">
                        <Label htmlFor="password">Password</Label>
                      </div>
                      <Input
                        id="password"
                        name="password"
                        type="password"
                        required
                      />
                    </div>

                    <Button
                      formAction={signup}
                      type="submit"
                      className="w-full"
                    >
                      Signup
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="relative hidden bg-muted lg:block">
        <img
          src="/login.png"
          alt="Image"
          className="absolute inset-0 h-full w-full object-cover "
          width={100}
          height={100}
        />
      </div>
  </div>
 );
}
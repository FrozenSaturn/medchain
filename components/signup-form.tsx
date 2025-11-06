// "use client";

// import { cn } from "@/lib/utils";
// import { createClient } from "@/lib/supabase/client";
// import { Button } from "@/components/ui/button";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import { useState } from "react";

// export function LoginForm({
//   className,
//   ...props
// }: React.ComponentPropsWithoutRef<"div">) {
//   const [error, setError] = useState<string | null>(null);
//   const [isLoading, setIsLoading] = useState(false);

//   const handleSocialLogin = async (e: React.FormEvent) => {
//     e.preventDefault();
//     const supabase = createClient();
//     setIsLoading(true);
//     setError(null);

//     try {
//       const { error } = await supabase.auth.signInWithOAuth({
//         provider: "google",
//         options: {
//           redirectTo: `${window.location.origin}/auth/oauth?next=/dashboard`,
//         },
//       });

//       if (error) throw error;
//     } catch (error: unknown) {
//       setError(error instanceof Error ? error.message : "An error occurred");
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className={cn("flex flex-col gap-6", className)} {...props}>
//       <Card>
//         <CardHeader>
//           <CardTitle className="text-2xl">Welcome!</CardTitle>
//           <CardDescription>Sign in to your account to continue</CardDescription>
//         </CardHeader>
//         <CardContent>
//           <form onSubmit={handleSocialLogin}>
//             <div className="flex flex-col gap-6">
//               {error && <p className="text-sm text-destructive-500">{error}</p>}
//               <Button type="submit" className="w-full" disabled={isLoading}>
//                 {isLoading ? "Logging in..." : "Continue with Google"}
//               </Button>
//             </div>
//           </form>
//         </CardContent>
//       </Card>
//     </div>
//   );
// }

"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
// import { signup } from "@/app/auth/actions";

// type LoginFormProps = {
//   action: (formData: FormData) => Promise<any>;
// } & React.ComponentPropsWithoutRef<"div">;

export function SignupForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {

  
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);


  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">Login to your account</h1>
        <p className="text-muted-foreground text-sm text-balance">
          Enter your email below to login to your account
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
              <Input id="password" name="password" type="password" required />
            </div>

            {/* <Button formAction={signup} className="w-full">
              Signup
            </Button> */}
          </div>
        </form>

        
      </div>
    </div>
  );
}

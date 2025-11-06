"use client";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export function LogoutButton() {
  const router = useRouter();

  const logout = async () => {
    // const supabase = createClient();

    // await supabase.auth.signOut();
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user) {
      await supabase.auth.signOut();
    }
    router.push("/");
  };

  return <Button onClick={logout}>Logout</Button>;
}

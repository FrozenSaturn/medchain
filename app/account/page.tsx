import { AccountSettings } from "@/components/account/account-settings"
import { AppShell } from "@/components/app-shell"
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";



export default async function AccountPage() {
  const supabase = await createClient();
  
    const { data, error } = await supabase.auth.getUser();
    // console.log("Protected Page Data:", data);
    if (error || !data?.user) {
      redirect("/auth/login");
    }
    const {user}=data;
  return(
    <div>
      <AppShell><AccountSettings user={user} /></AppShell>
  </div>
  ) 
  
}

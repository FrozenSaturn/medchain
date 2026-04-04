"use client";
import MedicalRecordUpload from "@/components-for-dash/patient/MedicalRecordUpload";
import React, { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Loader2 } from "lucide-react";

export default function RecordsPage() {
  const [userId, setUserId] = useState<string | null>(null);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserId(user.id);
        const { data: profile } = await supabase
          .from("profiles")
          .select("walletAddress")
          .eq("id", user.id)
          .single();
        setWalletAddress(profile?.walletAddress || null);
      }
      setLoading(false);
    };
    load();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[40vh]">
        <Loader2 className="h-8 w-8 animate-spin text-[#388E3C]" />
      </div>
    );
  }

  return <MedicalRecordUpload userId={userId} walletAddress={walletAddress} />;
}

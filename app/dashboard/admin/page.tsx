"use client";

import React, { useEffect, useState } from "react";
import Admin from "@/dash-components/Admin";
import { CONTRACT_ABI2, CONTRACT_ADDRESS2 } from "@/lib/contracts2";
import { useReadContract, useAccount } from "wagmi";
import { createClient } from "@/lib/supabase/client";

const NotAdminComponent = ({ address }: { address?: string }) => {
  return (
    <div className="flex flex-col items-center justify-center h-screen text-center px-4">
      <div className="p-8 bg-white rounded-lg shadow-md dark:bg-gray-800 max-w-lg">
        <h1 className="text-xl font-semibold text-gray-800 dark:text-white">
          Access Denied
        </h1>
        <p className="mt-4 text-gray-600 dark:text-gray-300">
          Wallet:{" "}
          <span className="font-mono text-sm break-all">{address ?? "—"}</span>
        </p>
        <p className="mt-2 text-red-500">
          This wallet is not an on-chain admin, and your Supabase profile is not
          role <code className="text-xs">admin</code>.
        </p>
        <p className="mt-4 text-sm text-muted-foreground text-left">
          To open the admin panel: connect the wallet set as admin on the access
          contract, <strong>or</strong> sign in with a Supabase user whose{" "}
          <code className="text-xs">profiles.role</code> is{" "}
          <code className="text-xs">admin</code> (see seed / Table Editor).
        </p>
      </div>
    </div>
  );
};

const AdminPage = () => {
  const { address, isConnected } = useAccount();
  const [dbAdmin, setDbAdmin] = useState(false);
  const [dbCheckDone, setDbCheckDone] = useState(false);

  const { data: isContractAdmin, isLoading: contractLoading } = useReadContract({
    address: CONTRACT_ADDRESS2,
    abi: CONTRACT_ABI2,
    functionName: "isAdmin",
    args: [address ?? "0x0000000000000000000000000000000000000000"],
    query: {
      enabled: Boolean(address),
    },
  });

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const supabase = createClient();
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (!user) {
          if (!cancelled) {
            setDbAdmin(false);
            setDbCheckDone(true);
          }
          return;
        }
        const { data: profile } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", user.id)
          .maybeSingle();
        if (!cancelled) {
          setDbAdmin(profile?.role === "admin");
          setDbCheckDone(true);
        }
      } catch {
        if (!cancelled) {
          setDbAdmin(false);
          setDbCheckDone(true);
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  if (!isConnected) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>Please connect your wallet to view this page.</p>
      </div>
    );
  }

  if (!dbCheckDone || (address && contractLoading)) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>Checking permissions...</p>
      </div>
    );
  }

  const allowed = isContractAdmin === true || dbAdmin;

  if (allowed) {
    return (
      <div>
        <Admin />
      </div>
    );
  }

  return <NotAdminComponent address={address} />;
};

export default AdminPage;

import { AppShell } from "@/components/app-shell";
import { Providers } from "@/providers/providers";
import React from "react";

const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="dark">
      <Providers>
        <AppShell>{children}</AppShell>
      </Providers>
    </div>
  );
};

export default layout;

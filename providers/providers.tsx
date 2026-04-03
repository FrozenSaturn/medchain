'use client';
import type React from 'react';
import dynamic from 'next/dynamic';

const DynamicInnerProviders = dynamic(
  () => import('./inner-providers').then((m) => m.InnerProviders),
  { ssr: false }
);

export function Providers({ children }: { children: React.ReactNode }) {
  return <DynamicInnerProviders>{children}</DynamicInnerProviders>;
}

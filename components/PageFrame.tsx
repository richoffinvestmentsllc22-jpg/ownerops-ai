"use client";

import { AppShell } from "@/components/AppShell";
import { DataProvider, useOwnerOps } from "@/components/DataProvider";

function InnerFrame({ children }: { children: React.ReactNode }) {
  const { data } = useOwnerOps();
  return <AppShell data={data}>{children}</AppShell>;
}

export function PageFrame({ children }: { children: React.ReactNode }) {
  return (
    <DataProvider>
      <InnerFrame>{children}</InnerFrame>
    </DataProvider>
  );
}

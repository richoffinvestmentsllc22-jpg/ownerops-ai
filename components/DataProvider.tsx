"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { loadOwnerOpsData, saveOwnerOpsData } from "@/lib/storage";
import type { OwnerOpsData } from "@/lib/types";

type DataContextValue = {
  data: OwnerOpsData;
  setData: React.Dispatch<React.SetStateAction<OwnerOpsData>>;
};

const DataContext = createContext<DataContextValue | null>(null);

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<OwnerOpsData>(() => loadOwnerOpsData());

  useEffect(() => {
    saveOwnerOpsData(data);
  }, [data]);

  const value = useMemo(() => ({ data, setData }), [data]);

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

export function useOwnerOps() {
  const context = useContext(DataContext);
  if (!context) throw new Error("useOwnerOps must be used inside DataProvider");
  return context;
}

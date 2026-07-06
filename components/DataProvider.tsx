"use client";

import type { Session } from "@supabase/supabase-js";
import { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";
import { isSupabaseConfigured, supabase } from "@/lib/supabase";
import { hydrateOwnerOpsData, loadOwnerOpsData, saveOwnerOpsData } from "@/lib/storage";
import type { OwnerOpsData } from "@/lib/types";

type DataContextValue = {
  data: OwnerOpsData;
  setData: React.Dispatch<React.SetStateAction<OwnerOpsData>>;
  session: Session | null;
  cloudStatus: string;
  syncNow: () => Promise<void>;
  signOut: () => Promise<void>;
};

const DataContext = createContext<DataContextValue | null>(null);

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<OwnerOpsData>(() => loadOwnerOpsData());
  const [session, setSession] = useState<Session | null>(null);
  const [cloudStatus, setCloudStatus] = useState(isSupabaseConfigured ? "Checking cloud session..." : "Demo browser storage");
  const cloudReady = useRef(false);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  async function loadCloudData(nextSession: Session | null) {
    setSession(nextSession);
    cloudReady.current = false;
    if (!supabase || !nextSession) {
      setCloudStatus(isSupabaseConfigured ? "Not signed in. Using browser storage." : "Demo browser storage");
      return;
    }

    setCloudStatus("Loading cloud workspace...");
    const { data: snapshot, error } = await supabase
      .from("ownerops_data_snapshots")
      .select("data")
      .eq("user_id", nextSession.user.id)
      .maybeSingle();

    if (error) {
      setCloudStatus(`Cloud setup needs attention: ${error.message}`);
      return;
    }

    if (snapshot?.data) {
      setData(hydrateOwnerOpsData(snapshot.data as Partial<OwnerOpsData>));
      setCloudStatus("Cloud workspace loaded.");
    } else {
      setCloudStatus("Cloud workspace ready. Saving this browser workspace...");
      await saveCloudData(data, nextSession);
    }
    cloudReady.current = true;
  }

  async function saveCloudData(nextData: OwnerOpsData, activeSession = session) {
    if (!supabase || !activeSession) return;
    const { error } = await supabase.from("ownerops_data_snapshots").upsert(
      {
        user_id: activeSession.user.id,
        data: nextData,
        updated_at: new Date().toISOString()
      },
      { onConflict: "user_id" }
    );
    setCloudStatus(error ? `Cloud save failed: ${error.message}` : "Saved to cloud.");
  }

  async function syncNow() {
    await saveCloudData(data);
  }

  async function signOut() {
    if (supabase) await supabase.auth.signOut();
    setSession(null);
    cloudReady.current = false;
    setCloudStatus("Signed out. Using browser storage.");
  }

  useEffect(() => {
    if (!supabase) return;
    supabase.auth.getSession().then(({ data: authData }) => loadCloudData(authData.session));
    const { data: subscription } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      loadCloudData(nextSession);
    });
    return () => subscription.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    saveOwnerOpsData(data);
    if (!session || !cloudReady.current) return;
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      saveCloudData(data);
    }, 700);
    return () => {
      if (saveTimer.current) clearTimeout(saveTimer.current);
    };
  }, [data, session]);

  const value = useMemo(() => ({ data, setData, session, cloudStatus, syncNow, signOut }), [cloudStatus, data, session]);

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

export function useOwnerOps() {
  const context = useContext(DataContext);
  if (!context) throw new Error("useOwnerOps must be used inside DataProvider");
  return context;
}

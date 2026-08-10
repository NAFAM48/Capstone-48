"use client";

import { useEffect, useSyncExternalStore, type ReactNode } from "react";
import { useRouter } from "next/navigation";

const emptySubscribe = () => () => {};

export default function ProtectedView({ children }: { children: ReactNode }) {
  const isClient = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );
  const router = useRouter();

  useEffect(() => {
    const token = window.localStorage.getItem("nafam_token");
    if (!token) {
      router.replace("/");
    }
  }, [router]);

  if (!isClient) {
    return null;
  }

  return <>{children}</>;
}

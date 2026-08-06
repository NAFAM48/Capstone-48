"use client";

import { useEffect, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";

export default function ProtectedView({ children }: { children: ReactNode }) {
  const [isClient, setIsClient] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsClient(true);
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

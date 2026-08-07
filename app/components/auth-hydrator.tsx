"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/store/auth";

/**
 * Kicks off Zustand's persisted-state rehydration once, on the client only.
 * Renders nothing — just mount it once near the top of the tree.
 */
export function AuthHydrator() {
  useEffect(() => {
    useAuthStore.persist.rehydrate();
  }, []);

  return null;
}
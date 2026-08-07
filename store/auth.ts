import { create } from "zustand";
import { persist } from "zustand/middleware";

type AuthState = {
  token: string | null;
  role: string | null;
  user: string | null;
  setAuth: (token: string, role: string | null, user: string | null) => void;
  clearAuth: () => void;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      role: null,
      user: null,
      setAuth: (token, role, user) => set({ token, role, user }),
      clearAuth: () => set({ token: null, role: null, user: null }),
    }),
    {
      name: "nafam-auth-store",
      partialize: (state) => ({ token: state.token, role: state.role, user: state.user }),
    }
  )
);

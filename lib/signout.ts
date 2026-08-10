import { useAuthStore } from "@/store/auth";

export async function signOut() {
  window.localStorage.removeItem("nafam_token");
  window.localStorage.removeItem("nafam_role");
  window.localStorage.removeItem("nafam_user");
  window.localStorage.removeItem("nafam-auth-store");
  document.cookie = "nafam_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
  useAuthStore.getState().clearAuth();
}

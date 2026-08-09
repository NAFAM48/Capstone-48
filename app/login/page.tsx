"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const setAuth = useAuthStore((s) => s.setAuth);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      // BFF may return plain text on error
      const contentType = response.headers.get("content-type") ?? "";
      const result = contentType.includes("application/json")
        ? await response.json().catch(() => ({}))
        : { error: await response.text().catch(() => "Request failed.") };

      if (!response.ok) {
        setError(result.error ?? result.message ?? "Invalid credentials. Please try again.");
        return;
      }

      // BFF returns { token, email, role } — local session token for the rest of the app.
      const userEmail = result.email ?? email;
      const role = (result.role ?? "Viewer") as import("@/lib/demo-data").Role;
      const token = result.token;

      // Keep Zustand store (persisted) and localStorage in sync
      setAuth(token, role, userEmail);
      // Also write to cookie so Edge Middleware can enforce role-based routing
      document.cookie = `nafam_token=${token}; path=/; SameSite=Lax`;

      window.localStorage.setItem("nafam_token", token);
      window.localStorage.setItem("nafam_role", role);
      window.localStorage.setItem("nafam_user", userEmail);

      router.push("/dashboard");
    } catch (err) {
      setError(
        err instanceof Error && err.message
          ? `Network error: ${err.message}`
          : "Could not reach the server. Please check your connection."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {/* Reusing the zero-config animations from the landing page */}
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-up { 
          opacity: 0;
          animation: fadeUp 0.6s ease-out forwards; 
        }
      `}</style>

      <main className="relative min-h-screen overflow-hidden bg-slate-50 flex items-center justify-center p-4 py-8">
        {/* Background Image with Gradient Overlay (Matches Landing Page) */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1581092160562-40aa08e78837?ixlib=rb-4.0.3&auto=format&fit=crop&w=2560&q=80"
            alt="Manufacturing facility background"
            className="h-full w-full object-cover object-center opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-slate-100 via-slate-100/95 to-slate-100/60"></div>
        </div>

        <div className="relative z-10 w-full max-w-md animate-fade-up">
          {/* Glassmorphism Auth Card */}
          <div className="overflow-hidden rounded-[2rem] border border-white/50 bg-white/70 p-8 shadow-2xl shadow-slate-200/50 backdrop-blur-xl sm:p-10">
            
            <div className="mb-8 text-center">
              <span className="inline-flex items-center rounded-full border border-blue-200 bg-blue-50/50 px-3 py-1 text-xs font-bold uppercase tracking-[0.2em] text-blue-700 backdrop-blur-sm">
                NAFAM Toy Factory
              </span>
              <h1 className="mt-4 text-3xl font-extrabold text-slate-900">Welcome back</h1>
              <p className="mt-2 text-sm text-slate-600">Sign in to access your manufacturing dashboard.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-slate-700">
                  Email
                </label>
                <div className="mt-2">
                  <input
                    id="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    type="email"
                    required
                    className="block w-full rounded-xl border border-slate-300 bg-white/60 px-4 py-3.5 text-slate-900 transition-all focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-500/10 sm:text-sm"
                    placeholder="admin@nafam.com"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-semibold text-slate-700">
                  Password
                </label>
                <div className="mt-2">
                  <input
                    id="password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    type="password"
                    required
                    className="block w-full rounded-xl border border-slate-300 bg-white/60 px-4 py-3.5 text-slate-900 transition-all focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-500/10 sm:text-sm"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              {error && (
                <div className="flex items-center gap-2 rounded-lg bg-red-50 p-3 text-sm text-red-600 border border-red-100">
                  <svg className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p>{error}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="group relative flex w-full justify-center rounded-xl bg-blue-700 px-4 py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-700/20 transition-all duration-300 hover:-translate-y-0.5 hover:bg-blue-800 hover:shadow-blue-700/40 disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:translate-y-0"
              >
                {loading ? (
                  <svg className="h-5 w-5 animate-spin text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : (
                  "Sign In"
                )}
              </button>
            </form>

            <div className="mt-4 text-center text-sm text-slate-600">
              Don&apos;t have an account?{' '}
              <a href="/signup" className="font-semibold text-blue-700 hover:text-blue-800">
                Sign up
              </a>
            </div>

            {/* Demo Credentials Box */}
            <div className="mt-8 rounded-2xl border border-slate-200/60 bg-white/40 p-4">
              <p className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-500">Demo Accounts</p>
              <div className="space-y-2 text-sm text-slate-600">
                <div className="flex items-center justify-between rounded-lg bg-white/60 p-2 px-3">
                  <span className="font-medium text-slate-900">Admin</span>
                  <span className="font-mono text-xs text-slate-500">admin@nafam.com / demo</span>
                </div>
                <div className="flex items-center justify-between rounded-lg bg-white/60 p-2 px-3">
                  <span className="font-medium text-slate-900">Manager</span>
                  <span className="font-mono text-xs text-slate-500">manager@nafam.com / demo</span>
                </div>
                <div className="flex items-center justify-between rounded-lg bg-white/60 p-2 px-3">
                  <span className="font-medium text-slate-900">Viewer</span>
                  <span className="font-mono text-xs text-slate-500">viewer@nafam.com / demo</span>
                </div>
              </div>
            </div>
            
          </div>
        </div>
      </main>
    </>
  );
}
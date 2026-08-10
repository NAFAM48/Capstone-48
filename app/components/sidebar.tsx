"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/auth";
import { signOut } from "@/lib/signout";

function UnreadBadge() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const token = window.localStorage.getItem("nafam_token");
    fetch("/api/notifications/unread", {
      headers: { Authorization: `Bearer ${token ?? ""}` },
    })
      .then((response) => (response.ok ? response.json() : null))
      .then((data) => setCount(data?.notifications?.length ?? 0))
      .catch(() => setCount(0));
  }, []);

  if (count === 0) {
    return null;
  }

  return (
    <span className="ml-auto inline-flex h-5 min-w-5 shrink-0 items-center justify-center rounded-full bg-rose-500 px-1.5 text-[0.65rem] font-bold text-white">
      {count}
    </span>
  );
}

const navItems = [
  { 
    label: "Dashboard", 
    href: "/dashboard",
    icon: (
      <svg className="h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    )
  },
  { 
    label: "Production Monitoring", 
    href: "/production-monitoring",
    icon: (
      <svg className="h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    )
  },
  { 
    label: "Machine Analytics", 
    href: "/machine-analytics",
    icon: (
      <svg className="h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    )
  },
  { 
    label: "Efficiency Analytics", 
    href: "/efficiency-analytics",
    icon: (
      <svg className="h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    )
  },
  { 
    label: "Production Noise Analysis", 
    href: "/production-noise-analysis",
    icon: (
      <svg className="h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
      </svg>
    )
  },
  { 
    label: "Notifications", 
    href: "/notifications",
    icon: (
      <svg className="h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
      </svg>
    )
  },
  { 
    label: "Reports", 
    href: "/reports",
    icon: (
      <svg className="h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    )
  },
  { 
    label: "Settings", 
    href: "/settings",
    icon: (
      <svg className="h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
      </svg>
    )
  },
];

interface SidebarProps {
  userName?: string;
  userRole?: string;
}

interface NavListProps {
  pathname: string;
  onNavigate?: () => void;
}

function NavList({ pathname, onNavigate }: NavListProps) {
  return (
    <div className="flex flex-col gap-1">
      {navItems.map((item, index) => {
        const isActive = pathname === item.href;

        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            className={`group relative flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium transition-all duration-200 animate-fade-up ${
              isActive
                ? "bg-blue-600/10 text-blue-400"
                : "text-slate-400 hover:bg-slate-800/50 hover:text-slate-200"
            }`}
            style={{ animationDelay: `${index * 40}ms` }}
          >
            {/* Active Indicator Line */}
            {isActive && (
              <div className="absolute left-0 top-1/2 h-1/2 w-1 -translate-y-1/2 rounded-r-full bg-blue-500" />
            )}

            {/* Icon */}
            <div className={`transition-transform duration-200 group-hover:scale-110 ${isActive ? "text-blue-500" : "text-slate-500"}`}>
              {item.icon}
            </div>

            <span className="min-w-0 truncate">{item.label}</span>
            {item.href === "/notifications" && <UnreadBadge />}
          </Link>
        );
      })}
    </div>
  );
}

export default function Sidebar({ userName, userRole }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [signingOut, setSigningOut] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const storeUser = useAuthStore((s) => s.user);
  const storeRole = useAuthStore((s) => s.role);

  const resolvedName = userName ?? storeUser ?? "User";
  const resolvedRole = userRole ?? storeRole ?? "—";

  const userInitials = resolvedName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  // Close the mobile drawer after navigating to a new page
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  // Lock body scroll and close the drawer on Escape while it is open
  useEffect(() => {
    if (!mobileOpen) {
      return;
    }
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMobileOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [mobileOpen]);

  const handleSignOut = async () => {
    if (signingOut) {
      return;
    }
    setSigningOut(true);
    try {
      await signOut();
    } finally {
      router.replace("/");
    }
  };

  return (
    <>
      <style>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        @keyframes fadeUp {
          from {
            opacity: 0;
            transform: translateY(8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-up {
          opacity: 0;
          animation: fadeUp 0.3s ease-out forwards;
        }
      `}</style>

      {/* ================= Mobile Top Bar ================= */}
      <div className="sticky top-0 z-40 flex items-center justify-between gap-3 border-b border-slate-800 bg-[#0B1120] px-4 py-3 text-slate-300 md:hidden">
        <div className="flex min-w-0 items-center gap-3">
          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            aria-label="Open navigation menu"
            aria-expanded={mobileOpen}
            aria-controls="mobile-nav-drawer"
            className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-700/60 bg-slate-800/40 text-slate-300 transition-all duration-200 hover:bg-slate-700/40 hover:text-white active:scale-95"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          <div className="flex min-w-0 items-center gap-2.5">
            <Image
              src="/nafam-logo.png"
              alt="NAFAM logo"
              width={1536}
              height={1024}
              className="h-8 w-8 shrink-0 rounded-lg object-cover shadow-md shadow-blue-900/50"
            />
            <div className="min-w-0">
              <p className="text-[0.6rem] font-bold uppercase tracking-[0.3em] text-slate-500">NAFAM</p>
              <h1 className="truncate text-sm font-black tracking-tight text-white">Toy Factory</h1>
            </div>
          </div>
        </div>

        <span className="flex shrink-0 items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1 text-[0.65rem] font-semibold text-emerald-400">
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
          </span>
          Live
        </span>
      </div>

      {/* ================= Mobile Drawer ================= */}
      <div
        id="mobile-nav-drawer"
        className={`fixed inset-0 z-50 md:hidden ${mobileOpen ? "" : "pointer-events-none"}`}
        aria-hidden={!mobileOpen}
        inert={!mobileOpen}
      >
        {/* Backdrop */}
        <div
          onClick={() => setMobileOpen(false)}
          className={`absolute inset-0 bg-slate-950/60 backdrop-blur-sm transition-opacity duration-300 ease-out ${
            mobileOpen ? "opacity-100" : "opacity-0"
          }`}
        />

        {/* Drawer Panel */}
        <div
          role="dialog"
          aria-modal="true"
          className={`absolute left-0 top-0 flex h-full w-72 max-w-[85%] flex-col border-r border-slate-800 bg-[#0B1120] text-slate-300 shadow-2xl shadow-black/50 transition-transform duration-300 ease-out will-change-transform ${
            mobileOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          {/* Drawer Header */}
          <div className="flex items-center justify-between gap-3 px-5 py-5">
            <div className="flex min-w-0 items-center gap-3">
              <Image
                src="/nafam-logo.png"
                alt="NAFAM logo"
                width={1536}
                height={1024}
                className="h-10 w-10 shrink-0 rounded-xl object-cover shadow-lg shadow-blue-900/50"
              />
              <div className="min-w-0">
                <p className="text-[0.65rem] font-bold uppercase tracking-[0.3em] text-slate-500">NAFAM</p>
                <h1 className="truncate text-lg font-black tracking-tight text-white">Toy Factory</h1>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setMobileOpen(false)}
              aria-label="Close menu"
              className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-slate-700/60 bg-slate-800/40 text-slate-400 transition-all duration-200 hover:bg-slate-700/40 hover:text-white active:scale-95"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Drawer Navigation */}
          <nav className="no-scrollbar flex-1 overflow-y-auto px-3 py-2">
            <NavList
              key={mobileOpen ? "open" : "closed"}
              pathname={pathname}
              onNavigate={() => setMobileOpen(false)}
            />
          </nav>

          {/* Drawer Footer */}
          <div className="border-t border-slate-800 p-4">
            <div className="flex items-center gap-3 rounded-xl px-2 py-2">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-700 text-sm font-bold text-white">
                {userInitials}
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-slate-200">{resolvedName}</p>
                <p className="truncate text-xs text-slate-500">{resolvedRole}</p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleSignOut}
              disabled={signingOut}
              className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-slate-700 px-4 py-2.5 text-sm font-semibold text-slate-300 transition hover:border-rose-500/40 hover:bg-rose-500/10 hover:text-rose-400 disabled:opacity-60"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              {signingOut ? "Signing out…" : "Sign Out"}
            </button>
          </div>
        </div>
      </div>

      {/* ================= Desktop Sidebar ================= */}
      <aside className="hidden border-r border-slate-800 bg-[#0B1120] text-slate-300 md:fixed md:top-0 md:left-0 md:z-20 md:flex md:h-screen md:min-h-screen md:w-72 md:shrink-0 md:flex-col md:overflow-y-auto">
        {/* Brand Header */}
        <div className="flex items-center justify-between px-8 py-8">
          <div className="flex min-w-0 items-center gap-3">
            <Image
              src="/nafam-logo.png"
              alt="NAFAM logo"
              width={1536}
              height={1024}
              className="h-10 w-10 shrink-0 rounded-xl object-cover shadow-lg shadow-blue-900/50"
            />
            <div className="min-w-0">
              <p className="text-[0.65rem] font-bold uppercase tracking-[0.3em] text-slate-500">NAFAM</p>
              <h1 className="truncate text-lg font-black tracking-tight text-white">Toy Factory</h1>
            </div>
          </div>

          <div className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1 text-xs font-semibold text-emerald-400">
            Live
          </div>
        </div>

        {/* Navigation Area */}
        <nav className="no-scrollbar flex-1 overflow-y-auto px-4 pb-8">
          <NavList pathname={pathname} />
        </nav>

        {/* User Profile / Bottom Section */}
        <div className="border-t border-slate-800 p-4">
          <div className="flex items-center gap-3 rounded-xl px-4 py-3 cursor-pointer transition-colors hover:bg-slate-800/50">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-700 text-sm font-bold text-white">
              {userInitials}
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-slate-200">{resolvedName}</p>
              <p className="truncate text-xs text-slate-500">{resolvedRole}</p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleSignOut}
            disabled={signingOut}
            className="mt-1 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-slate-700 px-4 py-2.5 text-sm font-semibold text-slate-300 transition hover:border-rose-500/40 hover:bg-rose-500/10 hover:text-rose-400 disabled:opacity-60"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            {signingOut ? "Signing out…" : "Sign Out"}
          </button>
        </div>
      </aside>
    </>
  );
}

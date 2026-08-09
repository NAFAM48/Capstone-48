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
    <span className="ml-auto inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-rose-500 px-1.5 text-[0.65rem] font-bold text-white">
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

export default function Sidebar({ userName, userRole }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [signingOut, setSigningOut] = useState(false);
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
          animation: fadeUp 0.3s ease-out forwards;
        }
      `}</style>

      <aside className="sticky top-0 left-0 z-20 flex flex-col h-screen min-h-screen overflow-y-auto border-r border-slate-800 bg-[#0B1120] text-slate-300 w-full md:fixed md:h-screen md:w-72 md:shrink-0">
        
        {/* Brand Header */}
        <div className="flex items-center justify-between px-6 py-6 md:px-8 md:py-8">
          <div className="flex items-center gap-3">
            <Image
              src="/nafam-logo.png"
              alt="NAFAM logo"
              width={1536}
              height={1024}
              className="h-10 w-10 rounded-xl shadow-lg shadow-blue-900/50 object-cover"
            />
            <div>
              <p className="text-[0.65rem] font-bold uppercase tracking-[0.3em] text-slate-500">NAFAM</p>
              <h1 className="text-lg font-black tracking-tight text-white">Toy Factory</h1>
            </div>
          </div>
          
          <div className="hidden rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1 text-xs font-semibold text-emerald-400 md:block">
            Live
          </div>
        </div>

        {/* Navigation Area */}
        <nav className="no-scrollbar flex overflow-x-auto px-4 pb-4 md:block md:overflow-visible md:px-4 md:pb-8">
          <div className="flex gap-2 md:flex-col md:space-y-1">
            {navItems.map((item, index) => {
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`group relative flex shrink-0 items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200 animate-fade-up
                    ${isActive 
                      ? "bg-blue-600/10 text-blue-400" 
                      : "text-slate-400 hover:bg-slate-800/50 hover:text-slate-200"
                    }
                  `}
                  style={{
                    animationDelay: `${index * 40}ms`
                  }}
                >
                  {/* Active Indicator Line (Desktop) */}
                  {isActive && (
                    <div className="absolute left-0 top-1/2 hidden h-1/2 w-1 -translate-y-1/2 rounded-r-full bg-blue-500 md:block" />
                  )}

                  {/* Icon */}
                  <div className={`transition-transform duration-200 group-hover:scale-110 ${isActive ? "text-blue-500" : "text-slate-500"}`}>
                    {item.icon}
                  </div>
                  
                  <span>{item.label}</span>
                  {item.href === "/notifications" && <UnreadBadge />}
                </Link>
              );
            })}
          </div>
        </nav>
        
        {/* User Profile / Bottom Section (Desktop Only) */}
        <div className="mt-auto hidden border-t border-slate-800 p-4 md:block">
          <div className="flex items-center gap-3 rounded-xl px-4 py-3 hover:bg-slate-800/50 cursor-pointer transition-colors">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-700 text-sm font-bold text-white">
              {userInitials}
            </div>
            <div className="overflow-hidden">
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

        {/* Sign Out (Mobile Only) */}
        <div className="border-t border-slate-800 p-4 md:hidden">
          <button
            type="button"
            onClick={handleSignOut}
            disabled={signingOut}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-slate-700 px-4 py-2.5 text-sm font-semibold text-slate-300 transition hover:border-rose-500/40 hover:bg-rose-500/10 hover:text-rose-400 disabled:opacity-60"
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
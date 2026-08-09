"use client";

import { useEffect, useState } from "react";
import DashboardShell from "@/app/components/dashboard-shell";
import type { Machine } from "@/lib/demo-data";
import { apiFetch } from "@/lib/api";

export default function Settings() {
  const [machines, setMachines] = useState<Machine[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    apiFetch<{ machines: Machine[] }>("/api/machines")
      .then((data) => setMachines(data.machines))
      .catch((err) => setError(err?.message ?? "Unable to load machines."))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <DashboardShell>
        <div className="mx-auto max-w-7xl py-24 text-center text-slate-600">Loading settings…</div>
      </DashboardShell>
    );
  }

  if (error) {
    return (
      <DashboardShell>
        <div className="mx-auto max-w-7xl py-24 text-center text-red-600">{error}</div>
      </DashboardShell>
    );
  }

  return (
    <DashboardShell>
          <div className="mx-auto max-w-7xl">
            
            {/* Header Area */}
            <header className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between animate-fade-up">
              <div>
                <div className="mb-1 flex items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-widest text-slate-400">
                    NAFAM Toy Factory
                  </span>
                </div>
                <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
                  Settings
                </h1>
                <p className="mt-1 text-sm text-slate-500">
                  Manage the factory abstraction model, machine assignments, and access controls.
                </p>
              </div>

              {/* Status Badge */}
              <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-bold text-blue-700 shadow-sm">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-400 opacity-75"></span>
                  <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-blue-600"></span>
                </span>
                Configuration Engine Active
              </div>
            </header>

            {/* Grid Content */}
            <div className="grid gap-6 xl:grid-cols-[2fr_1fr] animate-fade-up delay-100">
              
              {/* Registered Machines Section */}
              <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <h2 className="text-lg font-bold text-slate-900">Registered Machines</h2>
                <p className="text-xs text-slate-500 mb-5">Active factory line assignments and telemetry status</p>
                
                <div className="overflow-x-auto">
                  <table className="min-w-full text-left text-sm text-slate-700">
                    <thead>
                      <tr className="border-b border-slate-200 bg-slate-50/50">
                        <th className="px-4 py-3 font-semibold text-slate-600">Name</th>
                        <th className="px-4 py-3 font-semibold text-slate-600">Line</th>
                        <th className="px-4 py-3 font-semibold text-slate-600">Shift</th>
                        <th className="px-4 py-3 font-semibold text-slate-600">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {machines.map((machine) => (
                        <tr key={machine.id} className="transition-colors hover:bg-slate-50/50">
                          <td className="px-4 py-3 font-semibold text-slate-900">{machine.name}</td>
                          <td className="px-4 py-3 text-slate-600">{machine.line}</td>
                          <td className="px-4 py-3 text-slate-600">{machine.shift}</td>
                          <td className="px-4 py-3">
                            <span className="inline-flex items-center gap-1.5 rounded-md border border-emerald-200 bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700">
                              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                              {machine.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>

              {/* Right Column: Access & Abstraction Boundary */}
              <div className="space-y-6">
                
                {/* Access and Roles */}
                <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm animate-fade-up delay-200">
                  <h2 className="text-lg font-bold text-slate-900">Access and Roles</h2>
                  <p className="text-xs text-slate-500 mb-5">User privilege levels and permissions</p>
                  
                  <div className="space-y-3.5 text-sm text-slate-700">
                    <div className="rounded-xl border border-slate-100 bg-slate-50/50 p-3.5">
                      <p><span className="font-semibold text-slate-900">Admin</span> - full system access for machine and line management.</p>
                    </div>
                    <div className="rounded-xl border border-slate-100 bg-slate-50/50 p-3.5">
                      <p><span className="font-semibold text-slate-900">Plant Manager</span> - dashboard and OEE analytics access.</p>
                    </div>
                    <div className="rounded-xl border border-slate-100 bg-slate-50/50 p-3.5">
                      <p><span className="font-semibold text-slate-900">Viewer</span> - read-only visibility into dashboards.</p>
                    </div>
                  </div>
                </section>

                {/* Abstraction Boundary */}
                <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm animate-fade-up delay-300">
                  <h3 className="text-lg font-bold text-slate-900">Abstraction Boundary</h3>
                  <p className="text-xs text-slate-500 mb-4">Telemetry filtering guidelines</p>
                  
                  <div className="rounded-xl border border-blue-100 bg-blue-50/50 p-4">
                    <p className="text-xs font-medium text-slate-700 leading-relaxed">
                      The system filters out raw floor noise, micro-behavior, and sensor jitter, tracking only machine status, cycle time, unit counts, downtime reasons, and shift/line context.
                    </p>
                  </div>
                </section>

              </div>

            </div>

          </div>
      </DashboardShell>
  );
}
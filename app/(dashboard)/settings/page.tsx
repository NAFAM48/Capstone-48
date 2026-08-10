"use client";

import { FormEvent, useEffect, useState } from "react";
import DashboardShell from "@/app/components/dashboard-shell";
import type { Machine } from "@/lib/demo-data";
import { apiFetch } from "@/lib/api";
import { setEventShiftOverride, setShiftOverride } from "@/lib/shift-overrides";

export default function Settings() {
  const [machines, setMachines] = useState<Machine[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [machineName, setMachineName] = useState("");
  const [machineLine, setMachineLine] = useState("");
  const [machineShift, setMachineShift] = useState<Machine["shift"]>("Day");
  const [machineStatus, setMachineStatus] = useState<Machine["status"]>("Running");
  const [machineMessage, setMachineMessage] = useState<string | null>(null);
  const [eventMachineId, setEventMachineId] = useState("");
  const [eventLine, setEventLine] = useState("");
  const [eventShift, setEventShift] = useState<Machine["shift"]>("Day");
  const [eventReason, setEventReason] = useState("");
  const [eventStart, setEventStart] = useState("");
  const [eventEnd, setEventEnd] = useState("");
  const [eventMessage, setEventMessage] = useState<string | null>(null);
  const [health, setHealth] = useState<{ status: string; message: string } | null>(null);

  const fetchHealth = async () =>
    apiFetch<{ status: string; message: string }>("/api/health");

  const fetchMachines = async (): Promise<Machine[]> => {
    const data = await apiFetch<{ machines: Machine[] }>("/api/machines");
    return data.machines ?? [];
  };

  useEffect(() => {
    fetchMachines()
      .then(setMachines)
      .catch((err) => setError((err as Error)?.message ?? "Unable to load machines."))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    fetchHealth()
      .then(setHealth)
      .catch(() => setHealth(null));
  }, []);

  const handleMachineSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMachineMessage(null);

    try {
      const response = await apiFetch<{ id: string; name: string }>("/api/machines", {
        method: "POST",
        body: JSON.stringify({ name: machineName, line: machineLine, shift: machineShift, status: machineStatus }),
      });
      setShiftOverride(response.id, machineShift);
      setMachineMessage(`Created machine ${response.name ?? response.id}.`);
      setMachineName("");
      setMachineLine("");
      setMachineShift("Day");
      setMachineStatus("Running");
      setMachines(await fetchMachines());
    } catch (err) {
      setMachineMessage((err as Error)?.message ?? "Unable to create machine.");
    }
  };

  const handleEventSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setEventMessage(null);

    try {
      const response = await apiFetch<{ id: string | number }>("/api/downtime", {
        method: "POST",
        body: JSON.stringify({
          machineId: eventMachineId,
          line: eventLine,
          shift: eventShift,
          reason: eventReason,
          start: eventStart,
          end: eventEnd,
        }),
      });
      setEventShiftOverride(response.id, eventShift);
      setEventMessage("Downtime event saved successfully.");
      setEventMachineId("");
      setEventLine("");
      setEventShift("Day");
      setEventReason("");
      setEventStart("");
      setEventEnd("");
    } catch (err) {
      setEventMessage((err as Error)?.message ?? "Unable to save downtime event.");
    }
  };

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
        <header className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between animate-fade-up">
          <div>
            <div className="mb-1 flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-widest text-slate-400">NAFAM Toy Factory</span>
            </div>
            <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">Settings</h1>
            <p className="mt-1 text-sm text-slate-500">Manage machines, register downtime incidents, and update the factory model.</p>
          </div>

          <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-bold text-blue-700 shadow-sm">
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-blue-600"></span>
            </span>
            Configuration Engine Active
          </div>
        </header>

        <section className="mb-6 flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm animate-fade-up delay-50 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100">
              <svg className="h-5 w-5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-9.75 0h9.75" />
              </svg>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-slate-900">System Status</h2>
                {health?.status === "ok" && (
                  <span className="inline-flex items-center gap-1.5 rounded-md border border-emerald-200 bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    Online
                  </span>
                )}
                {health?.status === "degraded" && (
                  <span className="inline-flex items-center gap-1.5 rounded-md border border-amber-200 bg-amber-50 px-2.5 py-0.5 text-xs font-semibold text-amber-700">
                    <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                    Degraded
                  </span>
                )}
                {health?.status === "unreachable" && (
                  <span className="inline-flex items-center gap-1.5 rounded-md border border-rose-200 bg-rose-50 px-2.5 py-0.5 text-xs font-semibold text-rose-700">
                    <span className="h-1.5 w-1.5 rounded-full bg-rose-500" />
                    Unreachable
                  </span>
                )}
                {!health && (
                  <span className="inline-flex items-center gap-1.5 rounded-md border border-slate-200 bg-slate-50 px-2.5 py-0.5 text-xs font-semibold text-slate-500">
                    <span className="h-1.5 w-1.5 rounded-full bg-slate-300 animate-pulse" />
                    Checking…
                  </span>
                )}
              </div>
              <p className="mt-0.5 text-xs text-slate-500">
                {health?.message ?? "Verifying connection to the factory backend API (GET /api/health)."}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => fetchHealth().then(setHealth).catch(() => setHealth(null))}
            className="inline-flex items-center justify-center rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            Re-check
          </button>
        </section>

        <div className="grid gap-6 xl:grid-cols-[2fr_1fr] animate-fade-up delay-100">
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-6 flex items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-bold text-slate-900">Registered Machines</h2>
                <p className="text-xs text-slate-500">Active factory line assignments and telemetry status.</p>
              </div>
              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">{machines.length} machines</span>
            </div>

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
                        <span
                          className={
                            machine.status === "Running"
                              ? "inline-flex items-center gap-1.5 rounded-md border border-emerald-200 bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700"
                              : machine.status === "Down"
                                ? "inline-flex items-center gap-1.5 rounded-md border border-rose-200 bg-rose-50 px-2.5 py-0.5 text-xs font-semibold text-rose-700"
                                : "inline-flex items-center gap-1.5 rounded-md border border-amber-200 bg-amber-50 px-2.5 py-0.5 text-xs font-semibold text-amber-700"
                          }
                        >
                          <span
                            className={
                              machine.status === "Running"
                                ? "h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"
                                : machine.status === "Down"
                                  ? "h-1.5 w-1.5 rounded-full bg-rose-500"
                                  : "h-1.5 w-1.5 rounded-full bg-amber-500"
                            }
                          />
                          {machine.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <div className="space-y-6">
            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-bold text-slate-900">Register New Machine</h2>
              <p className="text-xs text-slate-500 mb-5">Create a new machine stage and status profile.</p>

              <form onSubmit={handleMachineSubmit} className="space-y-4">
                <div>
                  <label htmlFor="machineName" className="block text-sm font-semibold text-slate-700">Machine Name</label>
                  <input
                    id="machineName"
                    value={machineName}
                    onChange={(event) => setMachineName(event.target.value)}
                    required
                    className="mt-2 block w-full rounded-xl border border-slate-300 bg-white/60 px-4 py-3 text-slate-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                    placeholder="Assembly Line A"
                  />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="machineLine" className="block text-sm font-semibold text-slate-700">Line</label>
                    <input
                      id="machineLine"
                      value={machineLine}
                      onChange={(event) => setMachineLine(event.target.value)}
                      required
                      className="mt-2 block w-full rounded-xl border border-slate-300 bg-white/60 px-4 py-3 text-slate-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                      placeholder="Line 1"
                    />
                  </div>
                  <div>
                    <label htmlFor="machineShift" className="block text-sm font-semibold text-slate-700">Shift</label>
                    <select
                      id="machineShift"
                      value={machineShift}
                      onChange={(event) => setMachineShift(event.target.value as Machine["shift"])}
                      required
                      className="mt-2 block w-full rounded-xl border border-slate-300 bg-white/60 px-4 py-3 text-slate-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                    >
                      <option value="Day">Day</option>
                      <option value="Night">Night</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor="machineStatus" className="block text-sm font-semibold text-slate-700">Status</label>
                  <select
                    id="machineStatus"
                    value={machineStatus}
                    onChange={(event) => setMachineStatus(event.target.value as Machine["status"])}
                    className="mt-2 block w-full rounded-xl border border-slate-300 bg-white/60 px-4 py-3 text-slate-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                  >
                    <option>Running</option>
                    <option>Down</option>
                    <option>Idle</option>
                  </select>
                </div>

                {machineMessage && (
                  <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">{machineMessage}</div>
                )}

                <button
                  type="submit"
                  className="inline-flex w-full justify-center rounded-xl bg-blue-700 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-800"
                >
                  Register Machine
                </button>
              </form>
            </section>

            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-bold text-slate-900">Log Downtime Event</h2>
              <p className="text-xs text-slate-500 mb-5">Create or update a downtime incident cause and schedule.</p>

              <form onSubmit={handleEventSubmit} className="space-y-4">
                <div>
                  <label htmlFor="eventMachineId" className="block text-sm font-semibold text-slate-700">Machine</label>
                  <select
                    id="eventMachineId"
                    value={eventMachineId}
                    onChange={(event) => {
                      const selected = machines.find((machine) => machine.id === event.target.value);
                      setEventMachineId(event.target.value);
                      setEventLine(selected?.line ?? "");
                    }}
                    required
                    className="mt-2 block w-full rounded-xl border border-slate-300 bg-white/60 px-4 py-3 text-slate-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                  >
                    <option value="" disabled>Select a machine</option>
                    {machines.map((machine) => (
                      <option key={machine.id} value={machine.id}>
                        {machine.name} ({machine.id})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="eventLine" className="block text-sm font-semibold text-slate-700">Line</label>
                    <input
                      id="eventLine"
                      value={eventLine}
                      onChange={(event) => setEventLine(event.target.value)}
                      required
                      className="mt-2 block w-full rounded-xl border border-slate-300 bg-white/60 px-4 py-3 text-slate-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                      placeholder="Line 1"
                    />
                  </div>
                  <div>
                    <label htmlFor="eventShift" className="block text-sm font-semibold text-slate-700">Shift</label>
                    <select
                      id="eventShift"
                      value={eventShift}
                      onChange={(event) => setEventShift(event.target.value as Machine["shift"])}
                      required
                      className="mt-2 block w-full rounded-xl border border-slate-300 bg-white/60 px-4 py-3 text-slate-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                    >
                      <option value="Day">Day</option>
                      <option value="Night">Night</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor="eventReason" className="block text-sm font-semibold text-slate-700">Reason / Cause</label>
                  <input
                    id="eventReason"
                    value={eventReason}
                    onChange={(event) => setEventReason(event.target.value)}
                    required
                    className="mt-2 block w-full rounded-xl border border-slate-300 bg-white/60 px-4 py-3 text-slate-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                    placeholder="Breakdown"
                  />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="eventStart" className="block text-sm font-semibold text-slate-700">Start</label>
                    <input
                      id="eventStart"
                      type="datetime-local"
                      value={eventStart}
                      onChange={(event) => setEventStart(event.target.value)}
                      required
                      className="mt-2 block w-full rounded-xl border border-slate-300 bg-white/60 px-4 py-3 text-slate-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                    />
                  </div>
                  <div>
                    <label htmlFor="eventEnd" className="block text-sm font-semibold text-slate-700">End</label>
                    <input
                      id="eventEnd"
                      type="datetime-local"
                      value={eventEnd}
                      onChange={(event) => setEventEnd(event.target.value)}
                      required
                      className="mt-2 block w-full rounded-xl border border-slate-300 bg-white/60 px-4 py-3 text-slate-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                    />
                  </div>
                </div>

                {eventMessage && (
                  <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">{eventMessage}</div>
                )}

                <button
                  type="submit"
                  className="inline-flex w-full justify-center rounded-xl bg-blue-700 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-800"
                >
                  Save Downtime Event
                </button>
              </form>
            </section>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}

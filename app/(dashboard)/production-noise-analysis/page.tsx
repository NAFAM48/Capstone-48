"use client";

import { useEffect, useState } from "react";
import DashboardShell from "@/app/components/dashboard-shell";
import type { FrontendAlert } from "@/app/api/alerts/route";
import type { FrontendNoiseReading } from "@/app/api/noise-reading/route";
import type { DowntimeEvent, Machine, ProductionRecord } from "@/lib/demo-data";
import { apiFetch } from "@/lib/api";

function formatTime(timestamp: string) {
  return new Date(timestamp).toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function noiseLevelLabel(noiseLevel: number) {
  if (noiseLevel >= 85) {
    return { label: "HIGH", badge: "border-rose-200 bg-rose-100 text-rose-800", status: "Monitoring Required" };
  }
  if (noiseLevel >= 70) {
    return { label: "MODERATE", badge: "border-amber-200 bg-amber-100 text-amber-800", status: "Elevated Operation" };
  }
  return { label: "LOW", badge: "border-emerald-200 bg-emerald-100 text-emerald-800", status: "Stable Operation" };
}

function machineStatusBadge(status: Machine["status"]) {
  if (status === "Running") {
    return { status: "Active", color: "text-emerald-600 bg-emerald-50 border-emerald-200" };
  }
  if (status === "Down") {
    return { status: "Down", color: "text-rose-600 bg-rose-50 border-rose-200" };
  }
  return { status: "Idle", color: "text-amber-600 bg-amber-50 border-amber-200" };
}

export default function ProductionNoiseAnalysis() {
  const [noiseReadings, setNoiseReadings] = useState<FrontendNoiseReading[]>([]);
  const [alerts, setAlerts] = useState<FrontendAlert[]>([]);
  const [machines, setMachines] = useState<Machine[]>([]);
  const [records, setRecords] = useState<ProductionRecord[]>([]);
  const [events, setEvents] = useState<DowntimeEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([
      apiFetch<{ noiseReadings: FrontendNoiseReading[] }>("/api/noise-reading"),
      apiFetch<{ alerts: FrontendAlert[] }>("/api/alerts"),
      apiFetch<{ machines: Machine[]; records: ProductionRecord[]; events: DowntimeEvent[] }>("/api/machines"),
    ])
      .then(([noiseData, alertData, machineData]) => {
        setNoiseReadings(noiseData.noiseReadings ?? []);
        setAlerts(alertData.alerts ?? []);
        setMachines(machineData.machines ?? []);
        setRecords(machineData.records ?? []);
        setEvents(machineData.events ?? []);
      })
      .catch((err) => setError(err?.message ?? "Unable to load noise analysis data."))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <DashboardShell>
        <div className="mx-auto max-w-7xl py-24 text-center text-slate-600">Loading acoustic telemetry…</div>
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

  const anomalyCount = noiseReadings.filter((reading) => reading.isAnomaly).length;
  const openAlertCount = alerts.filter((alert) => !alert.resolved).length;
  const totalDefects = records.reduce((sum, record) => sum + record.defectiveUnits, 0);
  const totalDowntimeMinutes = events.reduce(
    (sum, event) => sum + Math.round((new Date(event.end).getTime() - new Date(event.start).getTime()) / 60000),
    0
  );
  const latestReading = noiseReadings.length > 0 ? noiseReadings[noiseReadings.length - 1] : null;
  const currentLevel = latestReading ? noiseLevelLabel(latestReading.noiseLevel) : noiseLevelLabel(0);

  return (
    <DashboardShell>
      <div className="mx-auto max-w-7xl">

        {/* Header Area */}
        <header className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between animate-fade-up">
          <div>
            <div className="mb-1 flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-widest text-slate-400">
                NAFAM OEE Control
              </span>
            </div>
            <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
              Production Noise Analysis
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Detect and monitor acoustic disruptions affecting factory performance and stability.
            </p>
          </div>

          {/* Status Badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-bold text-blue-700 shadow-sm">
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-blue-600"></span>
            </span>
            Acoustic Sensors Active
          </div>
        </header>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 animate-fade-up delay-100">

          {/* Noise Incidents */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-slate-500">Noise Incidents</h3>
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.536 11.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                </svg>
              </div>
            </div>
            <div className="mt-4">
              <p className="text-3xl font-bold text-slate-900">{anomalyCount}</p>
            </div>
            <p className="mt-1 text-xs text-slate-400">Recorded anomalous spikes</p>
          </div>

          {/* Machine Alerts */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-slate-500">Machine Alerts</h3>
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-rose-50 text-rose-600">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
            </div>
            <div className="mt-4">
              <p className="text-3xl font-bold text-slate-900">{openAlertCount}</p>
            </div>
            <p className="mt-1 text-xs text-slate-400">Triggered thresholds</p>
          </div>

          {/* Quality Issues */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-slate-500">Quality Issues</h3>
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <div className="mt-4">
              <p className="text-3xl font-bold text-slate-900">{totalDefects}</p>
            </div>
            <p className="mt-1 text-xs text-slate-400">Linked to sound anomalies</p>
          </div>

          {/* Production Delays */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-slate-500">Production Delays</h3>
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <div className="mt-4">
              <p className="text-3xl font-bold text-slate-900">{totalDowntimeMinutes} <span className="text-lg font-normal text-slate-500">min</span></p>
            </div>
            <p className="mt-1 text-xs text-slate-400">Impacted production run</p>
          </div>

        </div>

        {/* Grid Section: Noise Level & Filtering Status */}
        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2 animate-fade-up delay-200">

          {/* Current Noise Level */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-bold text-slate-900">Current Noise Level</h2>
            <p className="text-xs text-slate-500">Real-time factory ambient spectrum</p>

            <div className="mt-6 flex flex-col items-start justify-between gap-4 rounded-xl border border-emerald-100 bg-emerald-50/50 p-5 sm:flex-row sm:items-center">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-emerald-800">Acoustic Index</p>
                <p className="mt-1 text-3xl font-black text-emerald-600">{currentLevel.label}</p>
                {latestReading && (
                  <p className="mt-1 text-xs text-slate-500">{latestReading.noiseLevel.toFixed(1)} dB · {formatTime(latestReading.timestamp)}</p>
                )}
                {!latestReading && (
                  <p className="mt-1 text-xs text-slate-500">No readings recorded yet</p>
                )}
              </div>
              <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${currentLevel.badge}`}>
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                {currentLevel.status}
              </span>
            </div>
          </div>

          {/* Production Noise Filtering Status */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-bold text-slate-900">Production Noise Filtering Status</h2>
            <p className="text-xs text-slate-500">DSP algorithm performance</p>

            <div className="mt-6 rounded-xl border border-slate-100 bg-slate-50/50 p-5">
              <p className="text-sm font-medium text-slate-700 leading-relaxed">
                {anomalyCount > 0
                  ? `Detected ${anomalyCount} anomalous reading${anomalyCount === 1 ? "" : "s"} across ${noiseReadings.length} total reading${noiseReadings.length === 1 ? "" : "s"} — spectral dampening is engaged and flagging elevated acoustic activity.`
                  : "The production system is filtering abnormal machine activities successfully with active spectral dampening engaged."}
              </p>
            </div>
          </div>

        </div>

        {/* Grid Section: Sensor Monitoring & Production Disturbances */}
        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2 animate-fade-up delay-300">

          {/* Sensor Monitoring */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-bold text-slate-900">Sensor Monitoring</h2>
            <p className="text-xs text-slate-500">Telemetry feed from hardware nodes</p>

            <ul className="mt-5 space-y-3">
              {machines.length === 0 && (
                <li className="rounded-xl border border-slate-100 bg-slate-50/50 p-3.5 text-sm text-slate-500">
                  No machine telemetry available yet.
                </li>
              )}
              {machines.map((machine) => {
                const badge = machineStatusBadge(machine.status);
                return (
                  <li key={machine.id} className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50/50 p-3.5 transition-all hover:bg-slate-50">
                    <span className="text-sm font-semibold text-slate-800">
                      {machine.name} <span className="font-normal text-slate-400">· {machine.id}</span>
                    </span>
                    <span className={`rounded-md border px-2.5 py-0.5 text-xs font-semibold ${badge.color}`}>
                      {badge.status}
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Production Disturbances */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-bold text-slate-900">Production Disturbances</h2>
            <p className="text-xs text-slate-500">Logged disruption events</p>

            <ul className="mt-5 space-y-3">
              {events.length === 0 && (
                <li className="flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50/50 p-3.5 text-sm text-slate-500">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-50 text-blue-600 text-xs font-bold">
                    ✓
                  </span>
                  No major disturbances detected.
                </li>
              )}
              {events.map((event) => {
                const machine = machines.find((item) => item.id === event.machineId);
                const minutes = Math.round((new Date(event.end).getTime() - new Date(event.start).getTime()) / 60000);
                return (
                  <li key={event.id} className="flex items-center justify-between gap-3 rounded-xl border border-slate-100 bg-slate-50/50 p-3.5 transition-all hover:bg-slate-50">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-slate-800">
                        {machine?.name ?? event.machineId}
                      </p>
                      <p className="text-xs text-slate-500">{event.reason}</p>
                    </div>
                    <span className="shrink-0 rounded-md bg-amber-100 px-2 py-0.5 text-xs font-bold text-amber-700">
                      {minutes}m
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>

        </div>

        {/* Recent Updates */}
        <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm animate-fade-up">
          <h2 className="text-lg font-bold text-slate-900">Recent Noise Analysis Updates</h2>
          <p className="text-xs text-slate-500">Latest automated system logs and adjustments</p>

          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {[
              latestReading
                ? `Latest reading: ${latestReading.noiseLevel.toFixed(1)} dB from ${latestReading.machineName} at ${formatTime(latestReading.timestamp)}.`
                : "No noise readings recorded yet.",
              `${noiseReadings.length} total noise reading${noiseReadings.length === 1 ? "" : "s"} captured.`,
              `${openAlertCount} unresolved machine alert${openAlertCount === 1 ? "" : "s"} in the system.`,
              `${events.length} downtime incident${events.length === 1 ? "" : "s"} logged (${totalDowntimeMinutes} min total).`,
            ].map((update, idx) => (
              <div key={idx} className="flex items-start gap-3 rounded-xl border border-slate-100 bg-slate-50/50 p-4 transition-all hover:bg-slate-50">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-slate-200 text-[0.65rem] font-bold text-slate-700">
                  {idx + 1}
                </span>
                <span className="text-sm font-medium text-slate-700">{update}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Live Noise Readings */}
        <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm animate-fade-up">
          <h2 className="text-lg font-bold text-slate-900">Live Noise Readings</h2>
          <p className="text-xs text-slate-500">Telemetry recorded by acoustic sensors</p>

          {noiseReadings.length === 0 ? (
            <p className="mt-5 text-sm text-slate-500">No noise readings recorded yet. Data will appear here once acoustic sensors report.</p>
          ) : (
            <ul className="mt-5 space-y-3">
              {[...noiseReadings].reverse().slice(0, 10).map((reading) => {
                const level = noiseLevelLabel(reading.noiseLevel);
                return (
                  <li key={reading.id} className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50/50 p-4 transition-all hover:bg-slate-50">
                    <div>
                      <p className="text-sm font-semibold text-slate-800">{reading.machineName} · {reading.line}</p>
                      <p className="text-xs text-slate-500">{formatTime(reading.timestamp)}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`inline-flex items-center gap-1.5 rounded-md border px-2.5 py-0.5 text-xs font-semibold ${level.badge}`}>
                        {reading.noiseLevel.toFixed(1)} dB
                      </span>
                      {reading.isAnomaly && (
                        <span className="inline-flex items-center gap-1.5 rounded-md border border-rose-200 bg-rose-50 px-2.5 py-0.5 text-xs font-semibold text-rose-700">
                          Anomaly
                        </span>
                      )}
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

      </div>
    </DashboardShell>
  );
}

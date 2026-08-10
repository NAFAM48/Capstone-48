"use client";

import { useEffect, useMemo, useState } from "react";
import DashboardShell from "@/app/components/dashboard-shell";
import type { DowntimeEvent } from "@/lib/demo-data";
import { apiFetch } from "@/lib/api";

function formatDateTime(timestamp: string) {
  return new Date(timestamp).toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function toDateTimeLocal(timestamp: string) {
  const date = new Date(timestamp);
  const pad = (value: number) => String(value).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

export default function Reports() {
  const [events, setEvents] = useState<DowntimeEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ reason: "", start: "", end: "" });
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  const loadEvents = async () => {
    const data = await apiFetch<{ events: DowntimeEvent[] }>("/api/downtime");
    setEvents(data.events ?? []);
  };

  useEffect(() => {
    apiFetch<{ events: DowntimeEvent[] }>("/api/downtime")
      .then((data) => setEvents(data.events ?? []))
      .catch((err) => setError(err?.message ?? "Unable to load reports."))
      .finally(() => setLoading(false));
  }, []);

  const startEdit = (event: DowntimeEvent) => {
    setActionMessage(null);
    setEditingId(event.id);
    setEditForm({
      reason: event.reason,
      start: toDateTimeLocal(event.start),
      end: toDateTimeLocal(event.end),
    });
  };

  const saveEdit = async (event: DowntimeEvent) => {
    try {
      await apiFetch(`/api/downtime/${event.id}`, {
        method: "PUT",
        body: JSON.stringify({
          machineId: event.machineId,
          reason: editForm.reason,
          start: editForm.start,
          end: editForm.end,
          shift: event.shift,
        }),
      });
      setEditingId(null);
      setActionMessage("Downtime event updated.");
      await loadEvents();
    } catch (err) {
      setActionMessage((err as Error)?.message ?? "Unable to update downtime event.");
    }
  };

  const deleteEvent = async (event: DowntimeEvent) => {
    if (!window.confirm(`Delete downtime event for machine ${event.machineId}? The machine will be set back to Running.`)) {
      return;
    }
    try {
      await apiFetch(`/api/downtime/${event.id}`, { method: "DELETE" });
      setActionMessage("Downtime event deleted.");
      await loadEvents();
    } catch (err) {
      setActionMessage((err as Error)?.message ?? "Unable to delete downtime event.");
    }
  };

  const filteredEvents = useMemo(() => {
    const query = filter.trim().toLowerCase();
    if (!query) {
      return events;
    }
    return events.filter((event) =>
      [event.machineId, event.line, event.shift, event.reason, event.start, event.end]
        .join(" ")
        .toLowerCase()
        .includes(query)
    );
  }, [events, filter]);

  const totalDowntimeMinutes = useMemo(() => {
    return filteredEvents.reduce((total, event) => {
      const start = Date.parse(event.start);
      const end = Date.parse(event.end);
      if (Number.isNaN(start) || Number.isNaN(end)) {
        return total;
      }
      return total + Math.max(0, (end - start) / 60000);
    }, 0);
  }, [filteredEvents]);

  const exportCsv = () => {
    const headers = ["Machine ID", "Line", "Shift", "Reason", "Start", "End"];
    const rows = filteredEvents.map((event) => [
      event.machineId,
      event.line,
      event.shift,
      event.reason,
      event.start,
      event.end,
    ]);
    const csv = [headers, ...rows]
      .map((row) => row.map((value) => `"${String(value).replace(/"/g, '""')}"`).join(","))
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "downtime-report.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <DashboardShell>
        <div className="mx-auto max-w-7xl py-24 text-center text-slate-600">Loading reports…</div>
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
              <span className="text-xs font-bold uppercase tracking-widest text-slate-400">NAFAM OEE Control</span>
            </div>
            <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">Reports</h1>
            <p className="mt-1 text-sm text-slate-500">View downtime events, filter results, and export incident reports.</p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-bold text-blue-700 shadow-sm">
              <span className="relative flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-blue-600"></span>
              </span>
              Reports Engine Active
            </div>
            <button
              type="button"
              onClick={exportCsv}
              className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              Export CSV
            </button>
          </div>
        </header>

        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Downtime Event Reports</h2>
            <p className="text-sm text-slate-500">Events loaded from the protected downtime endpoint.</p>
          </div>
          <div className="space-y-1 sm:space-y-0 sm:flex sm:items-center sm:gap-4">
            <div className="rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-700 shadow-sm">
              <p className="font-medium text-slate-900">Filtered Events</p>
              <p>{filteredEvents.length} event{filteredEvents.length === 1 ? "" : "s"}</p>
            </div>
            <div className="rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-700 shadow-sm">
              <p className="font-medium text-slate-900">Estimated Downtime</p>
              <p>{totalDowntimeMinutes.toFixed(1)} min</p>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <label className="relative block w-full sm:w-80">
            <span className="sr-only">Search events</span>
            <input
              value={filter}
              onChange={(event) => setFilter(event.target.value)}
              type="search"
              placeholder="Filter by machine, line, reason, or timestamp"
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
            />
          </label>
        </div>

        {actionMessage && (
          <div className="mb-6 flex items-center justify-between gap-4 rounded-2xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-800 shadow-sm">
            <span>{actionMessage}</span>
            <button
              type="button"
              onClick={() => setActionMessage(null)}
              className="text-xs font-semibold uppercase tracking-wide text-blue-600 hover:text-blue-800"
            >
              Dismiss
            </button>
          </div>
        )}

        <div className="overflow-x-auto rounded-3xl border border-slate-200 bg-white shadow-sm">
          <table className="min-w-full divide-y divide-slate-200 text-left text-sm text-slate-700">
            <thead className="bg-slate-50 text-xs uppercase tracking-[0.2em] text-slate-500">
              <tr>
                <th className="px-4 py-3">Machine</th>
                <th className="px-4 py-3">Line</th>
                <th className="px-4 py-3">Shift</th>
                <th className="px-4 py-3">Reason</th>
                <th className="px-4 py-3">Start</th>
                <th className="px-4 py-3">End</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {filteredEvents.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-sm text-slate-500">
                    No downtime events match your filter.
                  </td>
                </tr>
              ) : (
                filteredEvents.map((event) =>
                  editingId === event.id ? (
                    <tr key={event.id} className="bg-blue-50/40 transition-colors">
                      <td className="px-4 py-3 font-medium text-slate-900">{event.machineId}</td>
                      <td className="px-4 py-3 text-slate-600">{event.line}</td>
                      <td className="px-4 py-3 text-slate-600">{event.shift}</td>
                      <td className="px-4 py-3">
                        <input
                          value={editForm.reason}
                          onChange={(input) => setEditForm((form) => ({ ...form, reason: input.target.value }))}
                          placeholder="Reason"
                          className="w-full min-w-28 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <input
                          type="datetime-local"
                          value={editForm.start}
                          onChange={(input) => setEditForm((form) => ({ ...form, start: input.target.value }))}
                          className="w-full min-w-40 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <input
                          type="datetime-local"
                          value={editForm.end}
                          onChange={(input) => setEditForm((form) => ({ ...form, end: input.target.value }))}
                          className="w-full min-w-40 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => saveEdit(event)}
                            className="rounded-lg bg-blue-700 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-blue-800"
                          >
                            Save
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setEditingId(null);
                              setActionMessage(null);
                            }}
                            className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-50"
                          >
                            Cancel
                          </button>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    <tr key={event.id} className="transition-colors hover:bg-slate-50/80">
                      <td className="px-4 py-4 font-medium text-slate-900">{event.machineId}</td>
                      <td className="px-4 py-4 text-slate-600">{event.line}</td>
                      <td className="px-4 py-4 text-slate-600">{event.shift}</td>
                      <td className="px-4 py-4 text-slate-700">{event.reason}</td>
                      <td className="px-4 py-4 text-slate-600">{formatDateTime(event.start)}</td>
                      <td className="px-4 py-4 text-slate-600">{formatDateTime(event.end)}</td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => startEdit(event)}
                            className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-50"
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => deleteEvent(event)}
                            className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-1.5 text-xs font-semibold text-rose-700 transition hover:bg-rose-100"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                )
              )}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardShell>
  );
}

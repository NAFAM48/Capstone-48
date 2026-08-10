"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import DashboardShell from "@/app/components/dashboard-shell";
import type { FrontendNotification } from "@/app/api/notifications/_shared";
import { apiFetch } from "@/lib/api";

function timeAgo(timestamp: string) {
  const diffMs = Date.now() - new Date(timestamp).getTime();
  const minutes = Math.floor(diffMs / 60000);
  if (minutes < 1) {
    return "just now";
  }
  if (minutes < 60) {
    return `${minutes}m ago`;
  }
  const hours = Math.floor(minutes / 60);
  if (hours < 24) {
    return `${hours}h ago`;
  }
  return `${Math.floor(hours / 24)}d ago`;
}

function severityStyle(severity: string) {
  const normalized = severity.toUpperCase();
  if (normalized === "HIGH" || normalized === "CRITICAL") {
    return "border-rose-200 bg-rose-50 text-rose-700";
  }
  if (normalized === "MEDIUM") {
    return "border-amber-200 bg-amber-50 text-amber-700";
  }
  return "border-blue-200 bg-blue-50 text-blue-700";
}

function typeLabel(type: string) {
  const normalized = (type || "INFO").toUpperCase();
  if (normalized === "ALERT") {
    return "ALERT";
  }
  if (normalized === "MAINTENANCE") {
    return "MAINT";
  }
  return "INFO";
}

const SEVERITIES = ["LOW", "MEDIUM", "HIGH"];
const TYPES = ["INFO", "ALERT", "MAINTENANCE"];

export default function Notifications() {
  const [notifications, setNotifications] = useState<FrontendNotification[]>([]);
  const [machines, setMachines] = useState<{ id: string; name: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | "unread">("all");
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  const [composeMachineId, setComposeMachineId] = useState("");
  const [composeTitle, setComposeTitle] = useState("");
  const [composeMessage, setComposeMessage] = useState("");
  const [composeType, setComposeType] = useState("INFO");
  const [composeSeverity, setComposeSeverity] = useState("LOW");
  const [composeStatus, setComposeStatus] = useState<string | null>(null);
  const [sending, setSending] = useState(false);

  const loadNotifications = async () => {
    const data = await apiFetch<{ notifications: FrontendNotification[] }>("/api/notifications");
    setNotifications(data.notifications ?? []);
  };

  useEffect(() => {
    Promise.all([
      apiFetch<{ notifications: FrontendNotification[] }>("/api/notifications"),
      apiFetch<{ machines: { id: string; name: string }[] }>("/api/machines").catch(() => ({ machines: [] })),
    ])
      .then(([notifData, machineData]) => {
        setNotifications(notifData.notifications ?? []);
        setMachines(machineData.machines ?? []);
      })
      .catch((err) => setError(err?.message ?? "Unable to load notifications."))
      .finally(() => setLoading(false));
  }, []);

  const unreadCount = useMemo(() => notifications.filter((n) => !n.read).length, [notifications]);
  const highCount = useMemo(
    () =>
      notifications.filter((n) => {
        const severity = n.severity.toUpperCase();
        return severity === "HIGH" || severity === "CRITICAL";
      }).length,
    [notifications]
  );
  const machineCount = useMemo(() => notifications.filter((n) => n.machineId !== "all").length, [notifications]);

  const visibleNotifications = useMemo(
    () => (filter === "unread" ? notifications.filter((n) => !n.read) : notifications),
    [notifications, filter]
  );

  const markRead = async (notification: FrontendNotification) => {
    try {
      await apiFetch(`/api/notifications/${notification.id}`, { method: "PUT" });
      setNotifications((list) => list.map((n) => (n.id === notification.id ? { ...n, read: true } : n)));
    } catch (err) {
      setActionMessage((err as Error)?.message ?? "Unable to mark notification as read.");
    }
  };

  const markAllRead = async () => {
    try {
      await apiFetch("/api/notifications/read-all", { method: "PUT" });
      setNotifications((list) => list.map((n) => ({ ...n, read: true })));
      setActionMessage("All notifications marked as read.");
    } catch (err) {
      setActionMessage((err as Error)?.message ?? "Unable to mark all notifications as read.");
    }
  };

  const remove = async (notification: FrontendNotification) => {
    if (!window.confirm(`Delete notification "${notification.title}"?`)) {
      return;
    }
    try {
      await apiFetch(`/api/notifications/${notification.id}`, { method: "DELETE" });
      setNotifications((list) => list.filter((n) => n.id !== notification.id));
      setActionMessage("Notification deleted.");
    } catch (err) {
      setActionMessage((err as Error)?.message ?? "Unable to delete notification.");
    }
  };

  const sendNotification = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (sending) {
      return;
    }
    setSending(true);
    setComposeStatus(null);
    try {
      await apiFetch("/api/notifications", {
        method: "POST",
        body: JSON.stringify({
          machineId: composeMachineId || null,
          title: composeTitle,
          message: composeMessage,
          type: composeType,
          severity: composeSeverity,
        }),
      });
      setComposeStatus("Notification sent successfully.");
      setComposeTitle("");
      setComposeMessage("");
      setComposeMachineId("");
      await loadNotifications();
    } catch (err) {
      setComposeStatus((err as Error)?.message ?? "Unable to send notification.");
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return (
      <DashboardShell>
        <div className="mx-auto max-w-7xl py-24 text-center text-slate-600">Loading notifications…</div>
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
              <span className="text-xs font-bold uppercase tracking-widest text-slate-400">NAFAM OEE Control</span>
            </div>
            <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">Notifications</h1>
            <p className="mt-1 text-sm text-slate-500">
              Factory alerts, system messages, and maintenance notices — synced with the backend.
            </p>
          </div>

          <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-bold text-blue-700 shadow-sm">
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-blue-600"></span>
            </span>
            Notification Center Active
          </div>
        </header>

        {/* Notification Summary Cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 animate-fade-up delay-100">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-slate-500">Total Notifications</h3>
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
              </div>
            </div>
            <div className="mt-4">
              <p className="text-3xl font-bold text-slate-900">{notifications.length}</p>
            </div>
            <p className="mt-1 text-xs text-slate-400">Factory-wide messages</p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-slate-500">Unread</h3>
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
            <div className="mt-4">
              <p className="text-3xl font-bold text-slate-900">{unreadCount}</p>
            </div>
            <p className="mt-1 text-xs text-slate-400">Awaiting review</p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-slate-500">High Priority</h3>
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-rose-50 text-rose-600">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
            </div>
            <div className="mt-4">
              <p className="text-3xl font-bold text-slate-900">{highCount}</p>
            </div>
            <p className="mt-1 text-xs text-slate-400">Critical severity items</p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-slate-500">Machine Alerts</h3>
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
            </div>
            <div className="mt-4">
              <p className="text-3xl font-bold text-slate-900">{machineCount}</p>
            </div>
            <p className="mt-1 text-xs text-slate-400">Equipment-specific notices</p>
          </div>
        </div>

        {/* Grid: Inbox + Compose */}
        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3 animate-fade-up delay-200">
          {/* Inbox */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm lg:col-span-2">
            <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-lg font-bold text-slate-900">Notification Inbox</h2>
                <p className="text-xs text-slate-500">Chronological feed of factory events</p>
              </div>

              <div className="flex items-center gap-2">
                <div className="inline-flex rounded-xl border border-slate-200 bg-slate-50 p-1">
                  {(["all", "unread"] as const).map((value) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setFilter(value)}
                      className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                        filter === value
                          ? "bg-white text-blue-700 shadow-sm"
                          : "text-slate-500 hover:text-slate-700"
                      }`}
                    >
                      {value === "all" ? "All" : "Unread"}
                    </button>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={markAllRead}
                  disabled={unreadCount === 0}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-slate-900 px-3 py-2 text-xs font-semibold text-white transition hover:bg-slate-800 disabled:opacity-40"
                >
                  <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Mark all read
                </button>
              </div>
            </div>

            {actionMessage && (
              <div className="mb-4 flex items-center justify-between gap-4 rounded-2xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-800 shadow-sm">
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

            {visibleNotifications.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50/50 px-6 py-12 text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-400">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="text-sm font-semibold text-slate-700">
                  {filter === "unread" ? "You're all caught up." : "No notifications yet."}
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  {filter === "unread"
                    ? "No unread notifications in the inbox."
                    : "New factory events will appear here as they are recorded."}
                </p>
              </div>
            ) : (
              <ul className="space-y-3">
                {visibleNotifications.map((notification) => (
                  <li
                    key={notification.id}
                    className={`flex items-start justify-between gap-4 rounded-xl border p-4 transition-all ${
                      notification.read
                        ? "border-slate-100 bg-white"
                        : "border-blue-200 bg-blue-50/40"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <span
                        className={`mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full ${
                          notification.read ? "bg-slate-200" : "bg-blue-500 animate-pulse"
                        }`}
                      />
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <span
                            className={`inline-flex items-center rounded-md border px-2 py-0.5 text-[0.65rem] font-bold uppercase tracking-wider ${severityStyle(
                              notification.severity
                            )}`}
                          >
                            {notification.severity}
                          </span>
                          <span className="inline-flex items-center rounded-md bg-slate-100 px-2 py-0.5 text-[0.65rem] font-bold uppercase tracking-wider text-slate-600">
                            {typeLabel(notification.type)}
                          </span>
                          <p className="text-sm font-bold text-slate-900">{notification.title}</p>
                        </div>
                        {notification.message && (
                          <p className="mt-1 text-sm text-slate-600">{notification.message}</p>
                        )}
                        <p className="mt-1.5 text-xs text-slate-400">
                          {notification.machineName} · {timeAgo(notification.createdAt)}
                        </p>
                      </div>
                    </div>

                    <div className="flex shrink-0 items-center gap-2">
                      {!notification.read && (
                        <button
                          type="button"
                          onClick={() => markRead(notification)}
                          title="Mark as read"
                          className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 transition hover:border-blue-300 hover:text-blue-600"
                        >
                          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => remove(notification)}
                        title="Delete notification"
                        className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-rose-200 bg-rose-50 text-rose-600 transition hover:bg-rose-100"
                      >
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Compose + Status */}
          <div className="space-y-6">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="mb-5">
                <h2 className="text-lg font-bold text-slate-900">Send Notification</h2>
                <p className="text-xs text-slate-500">Broadcast a factory-wide or machine-specific message</p>
              </div>

              <form onSubmit={sendNotification} className="space-y-4">
                <div>
                  <label htmlFor="notifyMachine" className="block text-sm font-semibold text-slate-700">Machine</label>
                  <select
                    id="notifyMachine"
                    value={composeMachineId}
                    onChange={(e) => setComposeMachineId(e.target.value)}
                    className="mt-2 block w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                  >
                    <option value="">Factory-wide (all machines)</option>
                    {machines.map((machine) => (
                      <option key={machine.id} value={machine.id}>
                        {machine.name} ({machine.id})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label htmlFor="notifyType" className="block text-sm font-semibold text-slate-700">Type</label>
                    <select
                      id="notifyType"
                      value={composeType}
                      onChange={(e) => setComposeType(e.target.value)}
                      className="mt-2 block w-full rounded-xl border border-slate-300 bg-white px-3 py-3 text-sm text-slate-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                    >
                      {TYPES.map((type) => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label htmlFor="notifySeverity" className="block text-sm font-semibold text-slate-700">Severity</label>
                    <select
                      id="notifySeverity"
                      value={composeSeverity}
                      onChange={(e) => setComposeSeverity(e.target.value)}
                      className="mt-2 block w-full rounded-xl border border-slate-300 bg-white px-3 py-3 text-sm text-slate-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                    >
                      {SEVERITIES.map((severity) => (
                        <option key={severity} value={severity}>{severity}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor="notifyTitle" className="block text-sm font-semibold text-slate-700">Title</label>
                  <input
                    id="notifyTitle"
                    value={composeTitle}
                    onChange={(e) => setComposeTitle(e.target.value)}
                    placeholder="e.g. Shift handover"
                    className="mt-2 block w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                  />
                </div>

                <div>
                  <label htmlFor="notifyMessage" className="block text-sm font-semibold text-slate-700">Message</label>
                  <textarea
                    id="notifyMessage"
                    value={composeMessage}
                    onChange={(e) => setComposeMessage(e.target.value)}
                    rows={3}
                    placeholder="Optional details for the team"
                    className="mt-2 block w-full resize-none rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                  />
                </div>

                <button
                  type="submit"
                  disabled={sending || (!composeTitle.trim() && !composeMessage.trim())}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-blue-700 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-800 disabled:opacity-50"
                >
                  {sending ? "Sending…" : "Send Notification"}
                </button>

                {composeStatus && (
                  <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">
                    {composeStatus}
                  </div>
                )}
              </form>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-bold text-slate-900">System Status</h2>
              <p className="text-xs text-slate-500">Overall telemetry health</p>

              <div className="mt-5 rounded-xl border border-emerald-100 bg-emerald-50/50 p-5">
                <div className="mb-2 flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">Operational</span>
                </div>
                <p className="text-sm font-semibold text-emerald-900">
                  {unreadCount > 0
                    ? `${unreadCount} unread notification${unreadCount === 1 ? "" : "s"} require review.`
                    : "All notifications have been reviewed."}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}

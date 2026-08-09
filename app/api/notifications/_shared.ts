export interface BackendNotification {
  id?: string | number;
  machineId?: string | number | null;
  machineName?: string | null;
  title?: string | null;
  message?: string | null;
  type?: string | null;
  severity?: string | null;
  read?: boolean;
  createdAt?: string | null;
}

export interface FrontendNotification {
  id: string;
  machineId: string;
  machineName: string;
  title: string;
  message: string;
  type: string;
  severity: string;
  read: boolean;
  createdAt: string;
}

function parseDate(value: string | null | undefined): string {
  if (!value) {
    return new Date().toISOString();
  }
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? new Date().toISOString() : parsed.toISOString();
}

export function mapNotification(notification: BackendNotification): FrontendNotification {
  return {
    id: notification.id != null ? String(notification.id) : `N-${Date.now()}`,
    machineId: notification.machineId != null ? String(notification.machineId) : "all",
    machineName: notification.machineName ?? "Factory",
    title: notification.title ?? "Notification",
    message: notification.message ?? "",
    type: notification.type ?? "INFO",
    severity: notification.severity ?? "LOW",
    read: Boolean(notification.read),
    createdAt: parseDate(notification.createdAt),
  };
}

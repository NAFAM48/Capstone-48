export function normalizeRole(raw: string | null | undefined) {
  if (!raw) return "Viewer";
  const r = String(raw).trim();

  // Common backend values normalized to friendly UI roles
  const map: Record<string, string> = {
    OPERATOR: "Viewer",
    OP: "Viewer",
    VIEWER: "Viewer",
    ADMIN: "Admin",
    "PLANT MANAGER": "Plant Manager",
    "PLANT_MANAGER": "Plant Manager",
    MANAGER: "Plant Manager",
  };

  const key = r.toUpperCase();
  return map[key] ?? // mapped value
    // fallback: Title case the raw value
    r
      .toLowerCase()
      .split(" ")
      .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
      .join(" ");
}

export function isViewer(role: string | null | undefined) {
  return normalizeRole(role) === "Viewer";
}

import type { CounsellorStatus } from "../api";

const LABELS: Record<CounsellorStatus, string> = {
  available: "Available",
  busy: "In session",
  offline: "Offline",
};

export function StatusBadge({ status }: { status: CounsellorStatus }) {
  return (
    <span className={`badge badge-${status}`}>
      <span className="badge-dot" />
      {LABELS[status]}
    </span>
  );
}

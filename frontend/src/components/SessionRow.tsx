import { useNavigate } from "react-router-dom";
import type { CounsellingSession, Role } from "../api";

const STATUS_LABEL: Record<CounsellingSession["status"], string> = {
  pending: "Finding a match…",
  confirmed: "Confirmed",
  in_progress: "In session",
  completed: "Completed",
};

function formatWhen(session: CounsellingSession): string {
  if (session.type === "instant") {
    return session.status === "pending" ? "Instant · matching now" : "Instant session";
  }
  if (!session.scheduled_time) return "";
  return new Date(session.scheduled_time).toLocaleString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export function SessionRow({ session, viewerRole }: { session: CounsellingSession; viewerRole: Role }) {
  const navigate = useNavigate();
  const counterpart = viewerRole === "client" ? session.counsellor : session.client;
  const canJoin = session.status === "confirmed" || session.status === "in_progress";

  return (
    <div className="session-row">
      <div className="session-row-main">
        <span className="session-type-dot" data-type={session.type} />
        <div>
          <div style={{ fontWeight: 600 }}>
            {counterpart ? counterpart.name : "Waiting for a counsellor…"}
          </div>
          <div className="muted" style={{ fontSize: "0.82rem" }}>
            {formatWhen(session)}
          </div>
        </div>
      </div>
      <div className="session-row-end">
        <span className={`badge badge-session-${session.status}`}>{STATUS_LABEL[session.status]}</span>
        {canJoin && (
          <button className="btn btn-sm btn-primary" onClick={() => navigate(`/session/${session.id}`)}>
            Join
          </button>
        )}
      </div>
    </div>
  );
}

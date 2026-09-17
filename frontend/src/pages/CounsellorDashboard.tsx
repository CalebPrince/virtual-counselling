import { useEffect, useState } from "react";
import { api, type CounsellingSession, type CounsellorStatus, type User } from "../api";
import { useIdentity } from "../context/IdentityContext";
import { SessionRow } from "../components/SessionRow";

const OPTIONS: { value: CounsellorStatus; label: string }[] = [
  { value: "available", label: "Available" },
  { value: "busy", label: "In session" },
  { value: "offline", label: "Offline" },
];

export function CounsellorDashboard() {
  const { identity, setIdentity } = useIdentity();
  const [me, setMe] = useState<User | null>(identity);
  const [sessions, setSessions] = useState<CounsellingSession[]>([]);
  const [updating, setUpdating] = useState(false);

  const loadSessions = async (id: number) => {
    const list = await api.counsellorSessions(id);
    setSessions(list);
  };

  useEffect(() => {
    if (!identity) return;
    api.getUser(identity.id).then((u) => {
      setMe(u);
      setIdentity(u);
    });
    loadSessions(identity.id);
    const interval = window.setInterval(() => loadSessions(identity.id), 5000);
    return () => window.clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [identity?.id]);

  if (!identity || !me) return null;

  async function setStatus(status: CounsellorStatus) {
    setUpdating(true);
    try {
      const updated = await api.setCounsellorStatus(me!.id, status);
      setMe(updated);
      setIdentity(updated);
      await loadSessions(updated.id);
    } finally {
      setUpdating(false);
    }
  }

  const active = sessions.filter((s) => s.status !== "completed");
  const pendingCount = active.filter((s) => s.status === "pending").length;

  return (
    <div className="page">
      <div className="container dash-grid">
        <div className="avail-card card">
          <div className="counsellor-avatar" style={{ margin: "0 auto 12px", width: 56, height: 56 }}>
            {me.name
              .replace("Dr. ", "")
              .split(" ")
              .map((p) => p[0])
              .slice(0, 2)
              .join("")}
          </div>
          <h3 style={{ fontSize: "1.05rem" }}>{me.name}</h3>
          <p className="eyebrow" style={{ marginBottom: 6 }}>
            {me.specialty}
          </p>

          <div className="avail-toggle">
            {OPTIONS.map((opt) => (
              <button
                key={opt.value}
                className={`avail-option ${me.status === opt.value ? "active" : ""}`}
                onClick={() => setStatus(opt.value)}
                disabled={updating}
              >
                <span className={`status-dot status-dot-${opt.value}`} />
                {opt.label}
              </button>
            ))}
          </div>

          {pendingCount > 0 && (
            <p className="muted" style={{ marginTop: 14, fontSize: "0.8rem" }}>
              {pendingCount} client{pendingCount > 1 ? "s" : ""} waiting for a match — go{" "}
              <strong>Available</strong> to pick one up.
            </p>
          )}
        </div>

        <div>
          <div className="section-head">
            <h2>Your sessions</h2>
          </div>
          {active.length === 0 ? (
            <div className="empty-state">
              Nothing on your schedule. Set yourself to Available to start receiving Talk Now
              requests.
            </div>
          ) : (
            <div className="session-list">
              {active.map((s) => (
                <SessionRow key={s.id} session={s} viewerRole="counsellor" />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2, PhoneCall } from "lucide-react";
import { api, type CounsellingSession, type User } from "../api";
import { useIdentity } from "../context/IdentityContext";
import { CounsellorCard } from "../components/CounsellorCard";
import { BookingModal } from "../components/BookingModal";
import { Overlay } from "../components/Overlay";
import { SessionRow } from "../components/SessionRow";

const SPECIALTIES = [
  "Anxiety & Stress",
  "Relationships & Family",
  "Depression",
  "Addiction & Recovery",
  "Grief & Loss",
];

export function ClientHome() {
  const { identity } = useIdentity();
  const navigate = useNavigate();

  const [counsellors, setCounsellors] = useState<User[]>([]);
  const [specialtyFilter, setSpecialtyFilter] = useState<string | null>(null);
  const [sessions, setSessions] = useState<CounsellingSession[]>([]);
  const [bookingTarget, setBookingTarget] = useState<User | null>(null);
  const [matching, setMatching] = useState(false);
  const pollRef = useRef<number | null>(null);

  const loadCounsellors = () => api.listCounsellors().then(setCounsellors);
  const loadSessions = () => {
    if (identity) api.clientSessions(identity.id).then(setSessions);
  };

  useEffect(() => {
    loadCounsellors();
    loadSessions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [identity?.id]);

  useEffect(() => () => {
    if (pollRef.current) window.clearInterval(pollRef.current);
  }, []);

  if (!identity) return null;

  const visibleCounsellors = specialtyFilter
    ? counsellors.filter((c) => c.specialty === specialtyFilter)
    : counsellors;

  async function talkNow() {
    if (!identity) return;
    setMatching(true);
    try {
      const session = await api.requestInstant(identity.id);
      if (session.status === "confirmed") {
        setMatching(false);
        navigate(`/session/${session.id}`);
        return;
      }
      pollRef.current = window.setInterval(async () => {
        const updated = await api.getSession(session.id);
        if (updated.status !== "pending") {
          if (pollRef.current) window.clearInterval(pollRef.current);
          setMatching(false);
          navigate(`/session/${session.id}`);
        }
      }, 1800);
    } catch {
      setMatching(false);
    }
  }

  return (
    <div className="page">
      <div className="container">
        <div className="talk-now-card">
          <img src="/images/talk-now-banner.webp" alt="" className="talk-now-bg" aria-hidden="true" />
          <div className="talk-now-copy">
            <h2>Need to talk right now?</h2>
            <p>We'll match you with the next available counsellor. Usually takes under a minute.</p>
          </div>
          <button className="btn talk-now-btn" onClick={talkNow} disabled={matching}>
            {matching ? <Loader2 size={17} className="spin-icon" /> : <PhoneCall size={17} strokeWidth={2} />}
            Talk Now
          </button>
        </div>

        <div className="section-head">
          <h2>Browse counsellors</h2>
        </div>

        <div className="filter-row">
          <button
            className={`filter-chip ${specialtyFilter === null ? "active" : ""}`}
            onClick={() => setSpecialtyFilter(null)}
          >
            All specialties
          </button>
          {SPECIALTIES.map((s) => (
            <button
              key={s}
              className={`filter-chip ${specialtyFilter === s ? "active" : ""}`}
              onClick={() => setSpecialtyFilter(s)}
            >
              {s}
            </button>
          ))}
        </div>

        <div className="counsellor-grid">
          {visibleCounsellors.map((c) => (
            <CounsellorCard key={c.id} counsellor={c} onBook={setBookingTarget} />
          ))}
        </div>

        <div className="section-head">
          <h2>Your sessions</h2>
        </div>
        {sessions.length === 0 ? (
          <div className="empty-state">No sessions yet — book one above or try Talk Now.</div>
        ) : (
          <div className="session-list">
            {sessions.map((s) => (
              <SessionRow key={s.id} session={s} viewerRole="client" />
            ))}
          </div>
        )}
      </div>

      {bookingTarget && (
        <BookingModal
          counsellor={bookingTarget}
          clientId={identity.id}
          onClose={() => setBookingTarget(null)}
          onBooked={loadSessions}
        />
      )}

      {matching && (
        <Overlay>
          <Loader2 size={40} strokeWidth={2} className="spin-icon" style={{ display: "block", margin: "4px auto 20px", color: "var(--teal-600)" }} />
          <h3 style={{ textAlign: "center", marginBottom: 6 }}>Finding you a counsellor…</h3>
          <p className="muted" style={{ textAlign: "center" }}>
            Hang tight, this usually only takes a moment.
          </p>
        </Overlay>
      )}
    </div>
  );
}

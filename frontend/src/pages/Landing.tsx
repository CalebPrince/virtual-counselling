import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ChevronDown, MessageCircleHeart, Stethoscope } from "lucide-react";
import { api, type Role, type User } from "../api";
import { useIdentity } from "../context/IdentityContext";
import { photoFor } from "../counsellorPhotos";

const SPECIALTIES = [
  "Anxiety & Stress",
  "Relationships & Family",
  "Depression",
  "Addiction & Recovery",
  "Grief & Loss",
];

export function Landing() {
  const { setIdentity } = useIdentity();
  const navigate = useNavigate();
  const [role, setRole] = useState<Role | null>(null);
  const [existing, setExisting] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [specialty, setSpecialty] = useState(SPECIALTIES[0]);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const panelRef = useRef<HTMLDivElement | null>(null);

  function scrollToPanel() {
    panelRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  useEffect(() => {
    if (!role) return;
    setLoading(true);
    const load = role === "client" ? api.listClients() : api.listCounsellors();
    load
      .then(setExisting)
      .catch(() => setExisting([]))
      .finally(() => setLoading(false));
  }, [role]);

  function chooseExisting(user: User) {
    setIdentity(user);
    navigate(role === "client" ? "/client" : "/counsellor");
  }

  async function createIdentity(e: React.FormEvent) {
    e.preventDefault();
    if (!role || !name.trim() || !email.trim()) return;
    setCreating(true);
    setError(null);
    try {
      const user = await api.createUser({
        name: name.trim(),
        email: email.trim(),
        role,
        specialty: role === "counsellor" ? specialty : undefined,
      });
      setIdentity(user);
      navigate(role === "client" ? "/client" : "/counsellor");
    } catch {
      setError("Couldn't create that profile — try a different email.");
    } finally {
      setCreating(false);
    }
  }

  return (
    <div className="page">
      <div className="container">
        <div className="landing-hero-section">
          <div className="landing-intro">
            <span className="eyebrow">Haven &middot; pitch demo</span>
            <h1 className="landing-title">
              Somebody to talk to,
              <br />
              <em>whenever it's time.</em>
            </h1>
            <p className="landing-copy muted">
              Haven connects clients with licensed counsellors two ways: book a session in
              advance, or tap <strong>Talk Now</strong> and get matched with an available
              counsellor in moments. This preview walks through both.
            </p>

            <button className="btn btn-clay hero-cta" onClick={scrollToPanel}>
              Get started
              <ChevronDown size={16} strokeWidth={2.2} />
            </button>
          </div>

          <div className="landing-hero-image">
            <div className="hero-visual">
              <img src="/images/phone-call-hero.webp" alt="Live counselling video call on a phone" />
              <span className="hero-live-chip">
                <span className="hero-live-dot" />
                Live session
              </span>
            </div>
          </div>
        </div>

        <div className="landing-panel-wrap" id="get-started" ref={panelRef}>
        <div className="landing-panel card">
          {!role ? (
            <>
              <h2 style={{ fontSize: "1.3rem", marginBottom: 4 }}>Who's joining?</h2>
              <p className="muted" style={{ marginBottom: 20 }}>
                No password needed for this preview — just pick a side.
              </p>
              <div className="role-options">
                <button className="role-card" onClick={() => setRole("client")}>
                  <span className="role-card-icon">
                    <MessageCircleHeart size={18} strokeWidth={1.8} />
                  </span>
                  <span>
                    <span className="role-card-title">I'm a client</span>
                    <span className="muted" style={{ fontSize: "0.85rem" }}>
                      Book a session or talk to someone right now
                    </span>
                  </span>
                </button>
                <button className="role-card" onClick={() => setRole("counsellor")}>
                  <span className="role-card-icon">
                    <Stethoscope size={18} strokeWidth={1.8} />
                  </span>
                  <span>
                    <span className="role-card-title">I'm a counsellor</span>
                    <span className="muted" style={{ fontSize: "0.85rem" }}>
                      Manage availability and see your sessions
                    </span>
                  </span>
                </button>
              </div>
            </>
          ) : (
            <>
              <button className="back-link" onClick={() => setRole(null)}>
                <ArrowLeft size={14} strokeWidth={2} />
                Back
              </button>
              <h2 style={{ fontSize: "1.3rem", marginBottom: 4 }}>
                {role === "client" ? "Continue as a client" : "Continue as a counsellor"}
              </h2>
              <p className="muted" style={{ marginBottom: 16 }}>
                Pick an existing demo profile, or create a new one.
              </p>

              {loading ? (
                <p className="muted">Loading profiles…</p>
              ) : existing.length > 0 ? (
                <div className="profile-list">
                  {existing.map((user) => {
                    const photo = photoFor(user.email);
                    return (
                      <button key={user.id} className="profile-row" onClick={() => chooseExisting(user)}>
                        {photo ? (
                          <img src={photo} alt="" className="profile-row-photo" />
                        ) : (
                          <span className="identity-avatar" style={{ background: "var(--teal-600)" }}>
                            {user.name
                              .split(" ")
                              .map((p) => p[0])
                              .slice(0, 2)
                              .join("")}
                          </span>
                        )}
                        <span style={{ textAlign: "left" }}>
                          <span style={{ display: "block", fontWeight: 600 }}>{user.name}</span>
                          {user.specialty && (
                            <span className="muted" style={{ fontSize: "0.8rem" }}>
                              {user.specialty}
                            </span>
                          )}
                        </span>
                      </button>
                    );
                  })}
                </div>
              ) : null}

              <div className="divider">
                <span>or create new</span>
              </div>

              <form onSubmit={createIdentity} className="stack-form">
                <div className="field">
                  <label>Name</label>
                  <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Jamie Park" required />
                </div>
                <div className="field">
                  <label>Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="jamie@example.com"
                    required
                  />
                </div>
                {role === "counsellor" && (
                  <div className="field">
                    <label>Specialty</label>
                    <select value={specialty} onChange={(e) => setSpecialty(e.target.value)}>
                      {SPECIALTIES.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
                {error && <p style={{ color: "var(--rose-600)", fontSize: "0.85rem" }}>{error}</p>}
                <button type="submit" className="btn btn-primary btn-block" disabled={creating}>
                  {creating ? "Creating…" : "Continue"}
                </button>
              </form>
            </>
          )}
        </div>
        </div>
      </div>
    </div>
  );
}

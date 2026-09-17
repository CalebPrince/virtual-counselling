import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ChevronDown,
  Clock,
  Lock,
  MessageCircleHeart,
  ShieldCheck,
  Stethoscope,
  Video,
} from "lucide-react";
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
  const [team, setTeam] = useState<User[]>([]);
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

  useEffect(() => {
    api.listCounsellors().then(setTeam).catch(() => setTeam([]));
  }, []);

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
      </div>

      <div className="trust-bar">
        <div className="container trust-grid">
          <span className="trust-item">
            <ShieldCheck size={18} strokeWidth={2} />
            Licensed counsellors
          </span>
          <span className="trust-item">
            <Lock size={18} strokeWidth={2} />
            Confidential &amp; secure
          </span>
          <span className="trust-item">
            <Clock size={18} strokeWidth={2} />
            Matched in minutes
          </span>
          <span className="trust-item">
            <Video size={18} strokeWidth={2} />
            Video sessions, any device
          </span>
        </div>
      </div>

      <div className="container">
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

        <section className="marketing-section" id="how-it-works">
          <div className="marketing-head">
            <span className="eyebrow">How Haven works</span>
            <h2>Three steps, no waiting weeks for an opening.</h2>
            <p className="muted">
              From "I need to talk" to actually talking — usually in under a minute for an
              instant match.
            </p>
          </div>
          <div className="steps">
            <div className="step-card">
              <span className="step-num">1</span>
              <h3>Tell us what's going on</h3>
              <p>
                A short check-in: what you'd like to talk about, and how you're feeling right
                now. Skip it if you'd rather not say.
              </p>
              <div className="step-tags">
                <span className="tag">Anxiety &amp; Stress</span>
                <span className="tag">Relationships</span>
                <span className="tag">Grief</span>
              </div>
            </div>
            <div className="step-card">
              <span className="step-num">2</span>
              <h3>Get matched, or pick your own</h3>
              <p>
                Tap <strong>Talk Now</strong> and we'll connect you with the next available
                counsellor who fits — or browse profiles and book a specific time.
              </p>
              <div className="step-tags">
                <span className="tag">Instant match</span>
                <span className="tag">Scheduled booking</span>
              </div>
            </div>
            <div className="step-card">
              <span className="step-num">3</span>
              <h3>Talk it through</h3>
              <p>
                Your session opens right in the Haven app — just a private room for the two of
                you, ready when you are.
              </p>
              <div className="step-tags">
                <span className="tag">Video session</span>
                <span className="tag">Private &amp; secure</span>
              </div>
            </div>
          </div>
        </section>

        <section className="marketing-section" style={{ paddingTop: 0 }}>
          <div className="marketing-head">
            <span className="eyebrow">Haven vs. the usual route</span>
            <h2>Waiting weeks for an appointment isn't a plan.</h2>
          </div>
          <div className="compare-wrap">
            <table className="compare">
              <thead>
                <tr>
                  <th>&nbsp;</th>
                  <th>Haven</th>
                  <th>Typical in-person therapy</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Time to first session</td>
                  <td>
                    <span className="yes-pill">Minutes, via Talk Now</span>
                  </td>
                  <td>
                    <span className="no-pill">Often a 2–4 week wait</span>
                  </td>
                </tr>
                <tr>
                  <td>Browse counsellors by specialty first</td>
                  <td>
                    <span className="yes-pill">Yes</span>
                  </td>
                  <td>
                    <span className="no-pill">Rarely offered upfront</span>
                  </td>
                </tr>
                <tr>
                  <td>Session from any device, no commute</td>
                  <td>
                    <span className="yes-pill">Yes</span>
                  </td>
                  <td>
                    <span className="no-pill">In-person only, usually</span>
                  </td>
                </tr>
                <tr>
                  <td>Switch counsellors without starting over</td>
                  <td>
                    <span className="yes-pill">Yes</span>
                  </td>
                  <td>
                    <span className="no-pill">Awkward, often discouraged</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {team.length > 0 && (
          <section className="marketing-section" id="counsellors" style={{ paddingTop: 0 }}>
            <div className="marketing-head">
              <span className="eyebrow">Meet the team</span>
              <h2>Licensed counsellors across five specialties.</h2>
              <p className="muted">
                A preview of who's on Haven today — real specialties, real availability status.
              </p>
            </div>
            <div className="counsellor-strip">
              {team.map((c) => {
                const photo = photoFor(c.email);
                const initials = c.name
                  .replace("Dr. ", "")
                  .split(" ")
                  .map((p) => p[0])
                  .slice(0, 2)
                  .join("");
                return (
                  <div className="counsellor-mini" key={c.id}>
                    {photo ? (
                      <img src={photo} alt={c.name} loading="lazy" />
                    ) : (
                      <span className="counsellor-mini-avatar">{initials}</span>
                    )}
                    <div className="counsellor-mini-body">
                      <h4>{c.name}</h4>
                      <span className="eyebrow">{c.specialty}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        <section className="marketing-section" style={{ paddingTop: 0 }}>
          <div className="marketing-head center">
            <span className="eyebrow">From the preview</span>
            <h2>What early testers said</h2>
            <p className="muted">
              Feedback from the Haven preview — illustrative, from our demo client profiles.
            </p>
          </div>
          <div className="testimonial-grid">
            <div className="testimonial-card">
              <p className="testimonial-quote">
                "I tapped Talk Now on a Tuesday night and was on a call in under two minutes. I
                didn't expect that."
              </p>
              <div className="testimonial-who">
                <span className="identity-avatar" style={{ background: "var(--clay-500)" }}>
                  JL
                </span>
                <div>
                  <div className="testimonial-who-name">Jordan Lee</div>
                  <div className="testimonial-who-role">Haven preview client</div>
                </div>
              </div>
            </div>
            <div className="testimonial-card">
              <p className="testimonial-quote">
                "Being able to see specialties and bios before booking made picking a counsellor
                feel less random."
              </p>
              <div className="testimonial-who">
                <span className="identity-avatar" style={{ background: "var(--clay-500)" }}>
                  SR
                </span>
                <div>
                  <div className="testimonial-who-name">Sam Rivera</div>
                  <div className="testimonial-who-role">Haven preview client</div>
                </div>
              </div>
            </div>
            <div className="testimonial-card">
              <p className="testimonial-quote">
                "No account walls, no waiting room — the session just opened right up. That
                alone lowered the bar to actually show up."
              </p>
              <div className="testimonial-who">
                <span className="identity-avatar" style={{ background: "var(--clay-500)" }}>
                  JL
                </span>
                <div>
                  <div className="testimonial-who-name">Jordan Lee</div>
                  <div className="testimonial-who-role">Haven preview client</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="marketing-section" id="faq" style={{ paddingTop: 0 }}>
          <div className="marketing-head">
            <span className="eyebrow">Questions</span>
            <h2>Before you get started</h2>
          </div>
          <div className="faq-list">
            <details className="faq-item">
              <summary>
                Are Haven counsellors licensed?
                <ChevronDown className="faq-chevron" size={16} strokeWidth={2} />
              </summary>
              <p>
                Yes — every counsellor on Haven is a licensed professional, shown with their
                specialty and years of experience before you book.
              </p>
            </details>
            <details className="faq-item">
              <summary>
                How fast can I talk to someone?
                <ChevronDown className="faq-chevron" size={16} strokeWidth={2} />
              </summary>
              <p>
                Tap Talk Now and you're matched with the next available counsellor, typically
                within a minute. Prefer to plan ahead? Book a specific time with any counsellor
                instead.
              </p>
            </details>
            <details className="faq-item">
              <summary>
                Is what I share confidential?
                <ChevronDown className="faq-chevron" size={16} strokeWidth={2} />
              </summary>
              <p>
                Sessions are private between you and your counsellor. Nothing is shared beyond
                what's needed to run the session itself.
              </p>
            </details>
            <details className="faq-item">
              <summary>
                Can I switch counsellors later?
                <ChevronDown className="faq-chevron" size={16} strokeWidth={2} />
              </summary>
              <p>
                Any time. Browse by specialty and book someone new whenever it makes sense —
                there's no lock-in to one counsellor.
              </p>
            </details>
          </div>
        </section>

        <section className="marketing-section" style={{ paddingTop: 0 }}>
          <div className="final-cta">
            <h2>Ready to get started?</h2>
            <p>Book ahead, or tap Talk Now and get matched in minutes.</p>
            <div className="final-cta-actions">
              <button className="btn btn-clay" onClick={scrollToPanel}>
                Get started
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

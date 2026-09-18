import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, MessageCircleHeart, Stethoscope } from "lucide-react";
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

const COUNSELLORS = [
  {
    photo: "/images/counsellor-kwame.webp",
    name: "Dr. Kofi Boateng",
    role: "Licensed Counsellor · Ghana",
    tags: ["Anxiety", "Relationships"],
    availability: "Available this week",
  },
  {
    photo: "/images/counsellor-amara.webp",
    name: "Dr. Ama Mensah",
    role: "Clinical Psychologist · Ghana",
    tags: ["Stress", "Self-worth"],
    availability: "Available tomorrow",
  },
  {
    photo: "/images/counsellor-naledi.webp",
    name: "Naledi Khumalo",
    role: "Family Therapist · South Africa",
    tags: ["Family", "Transitions"],
    availability: "Available Friday",
  },
  {
    photo: "/images/counsellor-tunde.webp",
    name: "Tunde Afolabi",
    role: "Recovery Counsellor · Nigeria",
    tags: ["Recovery", "Men's health"],
    availability: "Available this week",
  },
];

/** Reveal-on-scroll for elements carrying the .lv-reveal class, matching the reference design's fade-up entrance. */
function useScrollReveal(active: boolean) {
  useEffect(() => {
    if (!active) return;
    const els = document.querySelectorAll(".lv-reveal");
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) entry.target.classList.add("lv-visible");
        }
      },
      { threshold: 0.12 },
    );
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [active]);
}

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
  const quoteRef = useRef<HTMLQuoteElement | null>(null);

  useScrollReveal(true);

  function scrollToPanel() {
    panelRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function pulseQuote() {
    quoteRef.current?.animate(
      [
        { opacity: 0.35, transform: "translateY(4px)" },
        { opacity: 1, transform: "none" },
      ],
      { duration: 350 },
    );
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
      setError("Couldn't create that profile, try a different email.");
    } finally {
      setCreating(false);
    }
  }

  return (
    <div className="lv-page">
      <section className="lv-hero" id="top">
        <div className="lv-hero-copy lv-reveal">
          <div className="lv-kicker">Private online counselling</div>
          <h1>
            A softer place to
            <br />
            <em>work through it.</em>
          </h1>
          <p>
            Talk with a qualified counsellor who understands your world. Private, culturally
            aware support, <strong>available 24/7</strong>, wherever you are.
          </p>
          <div className="lv-hero-actions">
            <button className="lv-button" onClick={scrollToPanel}>
              Find my counsellor <span>↗</span>
            </button>
            <a
              className="lv-text-link"
              href="#how-it-works"
              onClick={(e) => {
                e.preventDefault();
                document.getElementById("how-it-works")?.scrollIntoView({ behavior: "smooth", block: "start" });
              }}
            >
              See how Haven works <span>↓</span>
            </a>
          </div>
          <div className="lv-mini-proof">
            <div className="lv-avatar-stack">
              <span>KA</span>
              <span>AM</span>
              <span>NK</span>
            </div>
            <div>
              <strong>4.9 out of 5</strong>
              <small>from early Haven members</small>
            </div>
          </div>
        </div>
        <div className="lv-hero-visual lv-reveal" aria-label="Haven live video support on a mobile phone">
          <img src="/images/haven-live-call.png" alt="A client holding a phone during a private Haven video call" />
          <div className="lv-live-pill">
            <span /> Live session
          </div>
          <div className="lv-privacy-pill">Encrypted live call</div>
        </div>
      </section>

      <section className="lv-trust-bar" aria-label="Trust indicators">
        <p>Support that feels safe, not clinical.</p>
        <div className="lv-trust-bar-grid">
          <span>
            <b>✓</b> Qualified counsellors
          </span>
          <span>
            <b>✓</b> Secure sessions
          </span>
          <span>
            <b>✓</b> Support available <strong>24/7</strong>
          </span>
          <span>
            <b>✓</b> Built with African lives in mind
          </span>
        </div>
      </section>

      <section className="lv-section" id="how-it-works">
        <div className="lv-section-heading lv-reveal">
          <span className="lv-kicker lv-center">How Haven works</span>
          <h2>Getting support can be simple.</h2>
          <p>Start at your pace. You're always in control of who you speak to and when.</p>
        </div>
        <div className="lv-steps">
          <article className="lv-step lv-reveal">
            <span className="lv-step-number">01</span>
            <div className="lv-step-icon">✦</div>
            <h3>Tell us what matters</h3>
            <p>Answer a few thoughtful questions about what you're going through and what you need.</p>
          </article>
          <article className="lv-step lv-featured lv-reveal">
            <span className="lv-step-number">02</span>
            <div className="lv-step-icon">⌘</div>
            <h3>Meet your match</h3>
            <p>Explore counsellors selected around your goals, preferences, language and schedule.</p>
          </article>
          <article className="lv-step lv-reveal">
            <span className="lv-step-number">03</span>
            <div className="lv-step-icon">◌</div>
            <h3>Talk your way</h3>
            <p>Connect by secure video, voice or messaging, from your own comfortable space.</p>
          </article>
        </div>
      </section>

      <section className="lv-section">
        <div className="lv-section-heading lv-reveal">
          <span className="lv-kicker lv-center">Why it's different</span>
          <h2>Virtual vs. in-person.</h2>
          <p>Same qualified care, without the waiting room.</p>
        </div>
        <div className="lv-compare-wrap lv-reveal">
          <table className="lv-compare">
            <thead>
              <tr>
                <th />
                <th className="lv-compare-highlight">Haven (virtual)</th>
                <th>In-person</th>
              </tr>
            </thead>
            <tbody>
              {[
                ["A counsellor licensed in your country", true, true],
                ["Talk to someone from anywhere", true, false],
                [
                  <>
                    Message your counsellor <strong>24/7</strong>
                  </>,
                  true,
                  false,
                ],
                ["Evening and weekend availability", true, false],
                ["Switch counsellors any time, no awkwardness", true, false],
                ["No commute, parking or travel time lost", true, false],
              ].map(([label, haven, inPerson], i) => (
                <tr key={i}>
                  <td>{label}</td>
                  <td className="lv-compare-highlight">
                    <span className={`lv-compare-mark ${haven ? "lv-yes" : "lv-no"}`}>{haven ? "✓" : "✕"}</span>
                  </td>
                  <td>
                    <span className={`lv-compare-mark ${inPerson ? "lv-yes" : "lv-no"}`}>{inPerson ? "✓" : "✕"}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="lv-match-section" id="discover">
        <div className="lv-match-panel lv-reveal">
          <span className="lv-kicker lv-light">A match that makes sense</span>
          <h2>More than a profile. A person you can open up to.</h2>
          <p>
            Good therapy begins with feeling understood. Haven considers your goals, lived
            experience and practical needs, then gives you real choice.
          </p>
          <ul>
            <li>
              <span>01</span>Choose focus areas that matter to you
            </li>
            <li>
              <span>02</span>Set language and cultural preferences
            </li>
            <li>
              <span>03</span>Review profiles before you decide
            </li>
            <li>
              <span>04</span>Switch counsellors without awkwardness
            </li>
          </ul>
          <button className="lv-button lv-button-cream" onClick={() => document.getElementById("counsellors")?.scrollIntoView({ behavior: "smooth", block: "start" })}>
            Meet our counsellors
          </button>
        </div>
        <div className="lv-match-visual lv-reveal">
          <div className="lv-match-orbit">
            {COUNSELLORS.map((c, i) => (
              <div key={c.name} className={`lv-orbit-photo lv-p${i + 1}`}>
                <img src={c.photo} alt="" />
              </div>
            ))}
            <div className="lv-match-center">
              <span>92%</span>
              <small>match fit</small>
            </div>
          </div>
        </div>
      </section>

      <section className="lv-section">
        <div className="lv-section-heading lv-left lv-reveal">
          <span className="lv-kicker">Made for real life</span>
          <h2>Care that bends around your day.</h2>
        </div>
        <div className="lv-benefit-grid">
          <article className="lv-benefit-card lv-terracotta lv-reveal">
            <span className="lv-feature-symbol">◒</span>
            <h3>Sessions that fit</h3>
            <p>Book evenings, weekends or quiet moments between everything else.</p>
          </article>
          <article className="lv-benefit-card lv-sage lv-reveal">
            <span className="lv-feature-symbol">◎</span>
            <h3>Ways to connect</h3>
            <p>Choose video, voice or secure messages based on what feels right today.</p>
          </article>
          <article className="lv-benefit-card lv-cream lv-reveal">
            <span className="lv-feature-symbol">◇</span>
            <h3>Clear, upfront costs</h3>
            <p>Know what you'll pay before you book. No hidden fees or long commitments.</p>
          </article>
          <article className="lv-benefit-card lv-navy lv-reveal">
            <span className="lv-feature-symbol">⌁</span>
            <h3>Continuity that helps</h3>
            <p>Keep your notes, goals and conversations together as you move forward.</p>
          </article>
        </div>
      </section>

      <section className="lv-app-section">
        <div className="lv-phone-wrap lv-reveal" aria-label="Haven app preview">
          <div className="lv-phone">
            <div className="lv-phone-top" />
            <div className="lv-app-head">
              <span className="lv-tiny-mark">H</span>
              <span>Good afternoon, Ama</span>
              <span>•••</span>
            </div>
            <div className="lv-app-body">
              <small>HOW ARE YOU FEELING?</small>
              <h3>
                Take a moment
                <br />
                to check in.
              </h3>
              <div className="lv-moods">
                <span>
                  ☀<b>Good</b>
                </span>
                <span>
                  ◐<b>Okay</b>
                </span>
                <span>
                  ◌<b>Low</b>
                </span>
                <span>
                  ≈<b>Anxious</b>
                </span>
              </div>
              <div className="lv-session-card">
                <small>NEXT SESSION</small>
                <strong>Dr. Ama Mensah</strong>
                <span>Today · 6:30 PM</span>
                <button type="button">Join session</button>
              </div>
            </div>
            <div className="lv-app-nav">
              <span>
                ⌂<b>Home</b>
              </span>
              <span>
                ◫<b>Sessions</b>
              </span>
              <span>
                ○<b>Journal</b>
              </span>
              <span>
                ◇<b>You</b>
              </span>
            </div>
          </div>
        </div>
        <div className="lv-app-copy lv-reveal">
          <span className="lv-kicker">Your space, in your pocket</span>
          <h2>Support between sessions, too.</h2>
          <p>Therapy is one part of the journey. Use Haven to prepare for sessions, notice patterns and keep gentle momentum.</p>
          <div className="lv-app-features">
            <div>
              <span>✎</span>
              <p>
                <strong>Private journal</strong>
                <small>Capture thoughts when they come.</small>
              </p>
            </div>
            <div>
              <span>⌁</span>
              <p>
                <strong>Session reminders</strong>
                <small>Helpful nudges, never pressure.</small>
              </p>
            </div>
            <div>
              <span>↗</span>
              <p>
                <strong>Simple progress notes</strong>
                <small>See what's shifting over time.</small>
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="lv-section" id="counsellors">
        <div className="lv-section-heading lv-reveal">
          <span className="lv-kicker lv-center">People, not just profiles</span>
          <h2>Qualified. Thoughtful. Human.</h2>
          <p>
            Every Haven counsellor is carefully reviewed for professional training, experience
            and a genuine commitment to compassionate care.
          </p>
        </div>
        <div className="lv-profile-grid">
          {COUNSELLORS.map((c) => (
            <article className="lv-profile-card lv-reveal" key={c.name}>
              <div className="lv-profile-photo">
                <img src={c.photo} alt={c.name} />
                <span>{c.availability}</span>
              </div>
              <div className="lv-profile-info">
                <h3>{c.name}</h3>
                <p>{c.role}</p>
                <div>
                  {c.tags.map((tag) => (
                    <span key={tag}>{tag}</span>
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>
        <button className="lv-text-link lv-centered" onClick={scrollToPanel}>
          Browse all counsellors <span>→</span>
        </button>
      </section>

      <section className="lv-safety" id="safety">
        <div className="lv-safety-art lv-reveal">
          <div className="lv-shield">
            <span>H</span>
          </div>
          <div className="lv-orbit-ring lv-o1" />
          <div className="lv-orbit-ring lv-o2" />
          <span className="lv-lock-dot lv-d1" />
          <span className="lv-lock-dot lv-d2" />
        </div>
        <div className="lv-safety-copy lv-reveal">
          <span className="lv-kicker lv-light">Privacy is part of care</span>
          <h2 style={{ color: "#fff" }}>What you share stays in your safe space.</h2>
          <p>
            Haven is designed to protect your privacy from the moment you join. Your
            conversations are encrypted, your information is handled with care, and you decide
            what to share.
          </p>
          <div className="lv-safety-grid">
            <div>
              <strong>Encrypted</strong>
              <small>Secure video, voice and messaging</small>
            </div>
            <div>
              <strong>Confidential</strong>
              <small>Clear professional boundaries</small>
            </div>
            <div>
              <strong>Your choice</strong>
              <small>Control your profile and preferences</small>
            </div>
            <div>
              <strong>Vetted</strong>
              <small>Credentials checked before joining</small>
            </div>
          </div>
          <a
            className="lv-light-link"
            href="#faq"
            onClick={(e) => {
              e.preventDefault();
              document.getElementById("faq")?.scrollIntoView({ behavior: "smooth", block: "start" });
            }}
          >
            Read our safety promise →
          </a>
        </div>
      </section>

      <section className="lv-testimonial-section">
        <div className="lv-quote-mark">"</div>
        <blockquote ref={quoteRef}>
          "Haven made asking for help feel less like admitting something was wrong, and more like
          choosing to take care of myself."
        </blockquote>
        <div className="lv-quote-person">
          <strong>Sarah, 29</strong>
          <span>Haven member · Accra</span>
        </div>
        <div className="lv-quote-nav">
          <button type="button" aria-label="Previous testimonial" onClick={pulseQuote}>
            ←
          </button>
          <button type="button" aria-label="Next testimonial" onClick={pulseQuote}>
            →
          </button>
        </div>
      </section>

      <section className="lv-section" id="faq">
        <div className="lv-faq">
          <div className="lv-faq-intro lv-reveal">
            <span className="lv-kicker">Questions, answered</span>
            <h2>A little clarity before you begin.</h2>
            <p>
              Still wondering about something? <a href="mailto:hello@haven.care">Talk to our care team.</a>
            </p>
          </div>
          <div className="lv-faq-list lv-reveal">
            <details open>
              <summary>
                Who are Haven's counsellors?<span>+</span>
              </summary>
              <p>
                Haven works with trained, experienced mental-health professionals. We review
                credentials, professional standing and areas of practice before a counsellor
                joins the platform.
              </p>
            </details>
            <details>
              <summary>
                How does matching work?<span>+</span>
              </summary>
              <p>
                Your answers help us suggest professionals whose expertise, availability,
                language and approach fit your needs. You can review profiles and choose for
                yourself.
              </p>
            </details>
            <details>
              <summary>
                Is online counselling private?<span>+</span>
              </summary>
              <p>
                Yes. Sessions and messages use secure systems, and counsellors follow
                professional confidentiality standards. We explain any legal safety exceptions
                clearly.
              </p>
            </details>
            <details>
              <summary>
                Can I change my counsellor?<span>+</span>
              </summary>
              <p>
                Absolutely. The relationship matters, and you can explore another match without
                needing to justify your choice.
              </p>
            </details>
            <details>
              <summary>
                Is Haven for emergencies?<span>+</span>
              </summary>
              <p>
                No. Haven is not an emergency service. If you or someone else is in immediate
                danger, contact local emergency services or go to the nearest hospital.
              </p>
            </details>
          </div>
        </div>
      </section>

      <section className="lv-final-cta" id="start">
        <div className="lv-cta-ring lv-r1" />
        <div className="lv-cta-ring lv-r2" />
        <div className="lv-final-cta-inner lv-reveal">
          <span className="lv-kicker lv-center">Your next step can be small</span>
          <h2>You don't have to carry it alone.</h2>
          <p>Take a few minutes to tell us what you need. We'll help you find someone who feels right.</p>
          <button className="lv-button lv-button-dark" onClick={scrollToPanel}>
            Find my counsellor <span>↗</span>
          </button>
          <small>No commitment. Your answers stay private.</small>

          <div className="lv-panel-shell" id="get-started" ref={panelRef}>
            <div className="landing-panel card">
              {!role ? (
                <>
                  <h2 style={{ fontSize: "1.3rem", marginBottom: 4, color: "var(--lv-navy)" }}>Who's joining?</h2>
                  <p className="muted" style={{ marginBottom: 20 }}>
                    No password needed for this preview, just pick a side.
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
                      <span className="role-card-icon role-card-icon--clay">
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
                  <h2 style={{ fontSize: "1.3rem", marginBottom: 4, color: "var(--lv-navy)" }}>
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
                              <span className="identity-avatar" style={{ background: "var(--lv-terra)" }}>
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
                    <button type="submit" className="lv-button lv-button-dark btn-block" disabled={creating}>
                      {creating ? "Creating…" : "Continue"}
                    </button>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

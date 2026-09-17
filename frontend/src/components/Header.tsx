import { Link, useLocation, useNavigate } from "react-router-dom";
import { useIdentity } from "../context/IdentityContext";

const NAV_LINKS = ["How it works", "For counsellors", "Pricing", "FAQ"];

function scrollToGetStarted() {
  document.getElementById("get-started")?.scrollIntoView({ behavior: "smooth", block: "start" });
}

export function Header() {
  const { identity, setIdentity } = useIdentity();
  const navigate = useNavigate();
  const location = useLocation();
  const onLanding = location.pathname === "/";

  const initials = identity
    ? identity.name
        .split(" ")
        .map((p) => p[0])
        .slice(0, 2)
        .join("")
        .toUpperCase()
    : "";

  return (
    <header className="topbar">
      <div className="container topbar-inner">
        <Link to="/" className="brand">
          <span className="brand-mark">
            <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M9 20c0-5.5 3.5-9 7-9s7 3.5 7 9c0 2-1.5 3-3 3-1 0-1.5-.6-1.5-1.5V17c0-1.2-1-2-2.5-2s-2.5.8-2.5 2v4.5c0 .9-.5 1.5-1.5 1.5-1.5 0-3-1-3-3z"
                fill="#E8C9A5"
              />
            </svg>
          </span>
          Haven
        </Link>

        {onLanding && (
          <nav className="main-nav">
            {NAV_LINKS.map((label) => (
              <a key={label} href="#" className="main-nav-link" onClick={(e) => e.preventDefault()}>
                {label}
              </a>
            ))}
          </nav>
        )}

        <div className="topbar-actions">
          {onLanding && (
            <button className="btn btn-clay btn-sm" onClick={scrollToGetStarted}>
              Get started
            </button>
          )}

          {identity && (
            <div className="identity-chip">
              <span className="identity-avatar">{initials}</span>
              <div>
                <div style={{ fontWeight: 600 }}>{identity.name}</div>
                <div className="muted" style={{ fontSize: "0.72rem", textTransform: "capitalize" }}>
                  {identity.role}
                </div>
              </div>
              <button
                onClick={() => {
                  setIdentity(null);
                  navigate("/");
                }}
              >
                Switch
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

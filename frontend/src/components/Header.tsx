import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { useIdentity } from "../context/IdentityContext";

const NAV_LINKS = [
  { label: "How it works", href: "#how-it-works" },
  { label: "For counsellors", href: "#counsellors" },
  { label: "Pricing", href: "#pricing" },
  { label: "FAQ", href: "#faq" },
];

function scrollToSection(href: string) {
  document.querySelector(href)?.scrollIntoView({ behavior: "smooth", block: "start" });
}

function scrollToGetStarted() {
  document.getElementById("get-started")?.scrollIntoView({ behavior: "smooth", block: "start" });
}

export function Header() {
  const { identity, setIdentity } = useIdentity();
  const navigate = useNavigate();
  const location = useLocation();
  const onLanding = location.pathname === "/";
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Close the drawer on route change and lock body scroll while it's open.
  useEffect(() => setDrawerOpen(false), [location.pathname]);
  useEffect(() => {
    document.body.style.overflow = drawerOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [drawerOpen]);

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
            {NAV_LINKS.map(({ label, href }) => (
              <a
                key={label}
                href={href}
                className="main-nav-link"
                onClick={(e) => {
                  e.preventDefault();
                  scrollToSection(href);
                }}
              >
                {label}
              </a>
            ))}
          </nav>
        )}

        <div className="topbar-actions">
          {onLanding && (
            <button className="btn btn-clay btn-sm nav-desktop-only" onClick={scrollToGetStarted}>
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

          {onLanding && (
            <button
              className="menu-toggle"
              aria-label={drawerOpen ? "Close menu" : "Open menu"}
              aria-expanded={drawerOpen}
              onClick={() => setDrawerOpen((open) => !open)}
            >
              {drawerOpen ? <X size={22} strokeWidth={2} /> : <Menu size={22} strokeWidth={2} />}
            </button>
          )}
        </div>
      </div>

      {onLanding && (
        <>
          <div
            className={`nav-drawer-backdrop${drawerOpen ? " open" : ""}`}
            onClick={() => setDrawerOpen(false)}
            aria-hidden="true"
          />
          <nav className={`nav-drawer${drawerOpen ? " open" : ""}`} aria-hidden={!drawerOpen}>
            {NAV_LINKS.map(({ label, href }) => (
              <a
                key={label}
                href={href}
                className="nav-drawer-link"
                onClick={(e) => {
                  e.preventDefault();
                  setDrawerOpen(false);
                  scrollToSection(href);
                }}
              >
                {label}
              </a>
            ))}
            <button
              className="btn btn-clay btn-block"
              onClick={() => {
                setDrawerOpen(false);
                scrollToGetStarted();
              }}
            >
              Get started
            </button>
          </nav>
        </>
      )}
    </header>
  );
}

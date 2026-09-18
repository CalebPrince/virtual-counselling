import { useLocation } from "react-router-dom";

function scrollToSection(href: string) {
  document.querySelector(href)?.scrollIntoView({ behavior: "smooth", block: "start" });
}

const SOCIAL_LINKS: { label: string; icon: (props: { size: number }) => React.ReactElement }[] = [
  {
    label: "Facebook",
    icon: ({ size }) => (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M22 12a10 10 0 1 0-11.56 9.88v-6.99H7.9V12h2.54V9.8c0-2.5 1.49-3.89 3.77-3.89 1.1 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56V12h2.78l-.45 2.89h-2.33v6.99A10 10 0 0 0 22 12Z" />
      </svg>
    ),
  },
  {
    label: "Instagram",
    icon: ({ size }) => (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
        <rect x="2.5" y="2.5" width="19" height="19" rx="5" />
        <circle cx="12" cy="12" r="4.6" />
        <circle cx="17.4" cy="6.6" r="1.1" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  {
    label: "WhatsApp",
    icon: ({ size }) => (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M12 2.2a9.8 9.8 0 0 0-8.4 14.8L2.2 21.8l4.9-1.35A9.8 9.8 0 1 0 12 2.2Zm5.55 13.93c-.23.66-1.35 1.26-1.9 1.34-.5.08-1.1.11-1.78-.11a16.4 16.4 0 0 1-1.63-.6c-2.87-1.24-4.74-4.15-4.88-4.34-.14-.2-1.17-1.55-1.17-2.96 0-1.4.74-2.09.99-2.38.26-.28.56-.35.75-.35h.55c.18 0 .42-.03.65.5.24.55.83 1.9.9 2.04.07.14.12.31.02.5-.1.19-.15.3-.29.47-.15.16-.31.36-.44.49-.15.14-.3.3-.13.6.17.28.75 1.24 1.62 2.02 1.11 1 2.05 1.3 2.34 1.45.29.14.46.12.63-.07.18-.19.75-.87.95-1.17.2-.3.4-.24.68-.14.28.1 1.78.84 2.09 1 .3.14.5.21.58.33.08.13.08.72-.15 1.38Z" />
      </svg>
    ),
  },
  {
    label: "X",
    icon: ({ size }) => (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M13.6 10.62 20.9 2h-1.73l-6.34 7.47L7.35 2H2l7.66 11.16L2 22h1.73l6.7-7.9L15.65 22H21l-7.4-11.38Zm-2.37 2.8-.78-1.11L4.3 3.3h2.65l5 7.1.78 1.11L18.7 20.7h-2.65l-5.26-7.28Z" />
      </svg>
    ),
  },
  {
    label: "LinkedIn",
    icon: ({ size }) => (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3 9h4v12H3V9Zm7 0h3.8v1.7h.06c.53-.94 1.83-1.94 3.76-1.94 4.02 0 4.76 2.55 4.76 5.87V21h-4v-5.6c0-1.34-.02-3.06-1.94-3.06-1.94 0-2.24 1.44-2.24 2.96V21h-4V9Z" />
      </svg>
    ),
  },
];

export function Footer() {
  const location = useLocation();
  if (location.pathname !== "/") return null;

  return (
    <footer className="site-footer">
      <div className="container footer-inner">
        <div className="footer-brand">
          <span className="brand">
            <span className="brand-mark" aria-hidden="true">
              <i />
              <i />
            </span>
            Haven
          </span>
          <p className="muted footer-tagline">
            A calm, private way to find support that understands you. A product pitch demo, not a
            real clinical service.
          </p>
        </div>

        <div className="footer-links">
          <span className="footer-links-title">Product</span>
          <a
            href="#how-it-works"
            onClick={(e) => {
              e.preventDefault();
              scrollToSection("#how-it-works");
            }}
          >
            How it works
          </a>
          <a
            href="#counsellors"
            onClick={(e) => {
              e.preventDefault();
              scrollToSection("#counsellors");
            }}
          >
            Counsellors
          </a>
          <a
            href="#safety"
            onClick={(e) => {
              e.preventDefault();
              scrollToSection("#safety");
            }}
          >
            Safety
          </a>
        </div>

        <div className="footer-links">
          <span className="footer-links-title">Support</span>
          <a
            href="#faq"
            onClick={(e) => {
              e.preventDefault();
              scrollToSection("#faq");
            }}
          >
            FAQ
          </a>
          <a
            href="#get-started"
            onClick={(e) => {
              e.preventDefault();
              scrollToSection("#get-started");
            }}
          >
            Get started
          </a>
        </div>
      </div>

      <div className="container footer-bottom">
        <span className="muted">&copy; {new Date().getFullYear()} Haven. Built as a pitch demo.</span>
        <div className="footer-social">
          {SOCIAL_LINKS.map(({ label, icon: Icon }) => (
            <a key={label} href="#top" className="footer-social-link" aria-label={label}>
              <Icon size={16} />
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}

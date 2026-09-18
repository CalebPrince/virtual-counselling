import { useLocation } from "react-router-dom";

function scrollToSection(href: string) {
  document.querySelector(href)?.scrollIntoView({ behavior: "smooth", block: "start" });
}

export function Footer() {
  const location = useLocation();
  if (location.pathname !== "/") return null;

  return (
    <footer className="site-footer">
      <div className="container footer-inner">
        <div className="footer-brand">
          <span className="brand">
            <span className="brand-mark">
              <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M9 20c0-5.5 3.5-9 7-9s7 3.5 7 9c0 2-1.5 3-3 3-1 0-1.5-.6-1.5-1.5V17c0-1.2-1-2-2.5-2s-2.5.8-2.5 2v4.5c0 .9-.5 1.5-1.5 1.5-1.5 0-3-1-3-3z"
                  fill="#E8C9A5"
                />
              </svg>
            </span>
            Haven
          </span>
          <p className="muted footer-tagline">
            Somebody to talk to, whenever it's time. A product pitch demo — not a real clinical
            service.
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
            For counsellors
          </a>
          <a
            href="#pricing"
            onClick={(e) => {
              e.preventDefault();
              scrollToSection("#pricing");
            }}
          >
            Pricing
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
      </div>
    </footer>
  );
}

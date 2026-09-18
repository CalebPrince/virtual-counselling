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
      </div>
    </footer>
  );
}

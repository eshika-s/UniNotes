import { Link } from "react-router-dom";

function Footer() {
  const links = {
    Product: [
      { label: "Browse Notes", to: "/notes" },
      { label: "Upload Notes", to: "/upload" },
      { label: "Dashboard", to: "/dashboard" },
      { label: "Courses", to: "/courses" }
    ],
    Institutions: [
      { label: "IIM Ahmedabad", to: "/notes?university=IIM%20Ahmedabad" },
      { label: "IIT Delhi", to: "/notes?university=IIT%20Delhi" },
      { label: "IIT Bombay", to: "/notes?university=IIT%20Bombay" },
      { label: "BITS Pilani", to: "/notes?university=BITS%20Pilani" }
    ],
    Company: [
      { label: "About Us", to: "#" },
      { label: "Privacy Policy", to: "#" },
      { label: "Terms of Service", to: "#" },
      { label: "Contact Us", to: "#" }
    ]
  };

  const socials = [
    {
      name: "LinkedIn",
      color: "var(--primary)",
      icon: (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
          <path d="M20.447 20.452H16.89v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a1.976 1.976 0 01-1.972-1.972 1.976 1.976 0 011.972-1.971 1.976 1.976 0 011.971 1.971 1.976 1.976 0 01-1.971 1.972zm1.75 13.019H3.585V9h3.502v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
        </svg>
      )
    },
    {
      name: "Twitter",
      color: "var(--primary)",
      icon: (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
          <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z" />
        </svg>
      )
    },
    {
      name: "Instagram",
      color: "var(--primary)",
      icon: (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="2" width="20" height="20" rx="0" ry="0" /><path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z" /><line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
        </svg>
      )
    }
  ];

  return (
    <footer style={{
      background: "var(--accent)",
      borderTop: "1px solid rgba(255, 255, 255, 0.06)",
      marginTop: "0px",
      position: "relative",
      zIndex: 10
    }}>
      {/* Main Footer Block */}
      <div className="container" style={{ padding: "4rem 4rem 2rem" }}>
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "3rem",
          marginBottom: "3rem"
        }}>
          {/* Brand Column */}
          <div style={{ flex: "2 1 280px" }}>
            <Link to="/home" style={{ textDecoration: "none" }}>
              <h2 style={{ margin: "0 0 1rem", fontSize: "1.4rem", fontWeight: 850, letterSpacing: "-0.5px" }}>
                <span style={{ color: "#ffffff" }}>Uni</span>
                <span style={{ color: "var(--primary)" }}>Notes</span>
              </h2>
            </Link>
            <p style={{ color: "var(--text-muted)", fontSize: "0.88rem", lineHeight: 1.7, maxWidth: "300px", marginBottom: "1.5rem", margin: "0 0 1.5rem" }}>
              India's leading platform for sharing and discovering high-quality academic notes from premier institutions.
            </p>
            {/* Social Icons Row */}
            <div style={{ display: "flex", gap: "0.6rem" }}>
              {socials.map((s, i) => (
                <div
                  key={i}
                  title={s.name}
                  style={{
                    width: "34px",
                    height: "34px",
                    borderRadius: "0px",
                    background: "rgba(255, 255, 255, 0.04)",
                    border: "1px solid rgba(255, 255, 255, 0.07)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "var(--text-muted)",
                    cursor: "pointer",
                    transition: "all 0.15s ease"
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.background = "var(--primary-subtle)";
                    e.currentTarget.style.borderColor = "var(--primary)";
                    e.currentTarget.style.color = "var(--primary)";
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.background = "rgba(255, 255, 255, 0.04)";
                    e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.07)";
                    e.currentTarget.style.color = "var(--text-muted)";
                  }}
                >
                  {s.icon}
                </div>
              ))}
            </div>
          </div>

          {/* Nav Link Columns */}
          {Object.entries(links).map(([section, items]) => (
            <div key={section}>
              <h4 style={{ color: "#ffffff", fontSize: "0.78rem", fontWeight: 700, marginBottom: "1.2rem", letterSpacing: "0.08em", textTransform: "uppercase" }}>
                {section}
              </h4>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "0.65rem" }}>
                {items.map((item, i) => (
                  <li key={i}>
                    {item.to.startsWith("#") ? (
                      <a
                        href={item.to}
                        style={{ color: "var(--text-muted)", fontSize: "0.85rem", textDecoration: "none", transition: "color 0.15s ease" }}
                        onMouseEnter={e => e.target.style.color = "var(--primary)"}
                        onMouseLeave={e => e.target.style.color = "var(--text-muted)"}
                      >
                        {item.label}
                      </a>
                    ) : (
                      <Link
                        to={item.to}
                        style={{ color: "var(--text-muted)", fontSize: "0.85rem", textDecoration: "none", transition: "color 0.15s ease" }}
                        onMouseEnter={e => e.target.style.color = "var(--primary)"}
                        onMouseLeave={e => e.target.style.color = "var(--text-muted)"}
                      >
                        {item.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Compliance Bar */}
        <div style={{
          borderTop: "1px solid rgba(255, 255, 255, 0.06)",
          paddingTop: "1.5rem",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "1rem"
        }}>
          <p style={{ color: "#494d5f", fontSize: "0.82rem", margin: 0 }}>
            © {new Date().getFullYear()} UniNotes. All rights reserved. Built for Indian students.
          </p>
          <div style={{ display: "flex", gap: "1.5rem" }}>
            {["Privacy", "Terms", "Cookies"].map((t, i) => (
              <a
                key={i}
                href="#"
                style={{ color: "#494d5f", fontSize: "0.82rem", textDecoration: "none", transition: "color 0.15s ease" }}
                onMouseEnter={e => e.target.style.color = "#ffffff"}
                onMouseLeave={e => e.target.style.color = "#494d5f"}
              >
                {t}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;

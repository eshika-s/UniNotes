function Footer() {
  const links = {
    Product: ["Browse Notes", "Upload Notes", "Dashboard", "Courses"],
    Institutions: ["IIT Delhi", "IIT Bombay", "IIM Ahmedabad", "BITS Pilani"],
    Company: ["About Us", "Privacy Policy", "Terms of Service", "Contact"],
  };

  const socials = [
    {
      name: "LinkedIn",
      color: "#60a5fa",
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
          <path d="M20.447 20.452H16.89v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a1.976 1.976 0 01-1.972-1.972 1.976 1.976 0 011.972-1.971 1.976 1.976 0 011.971 1.971 1.976 1.976 0 01-1.971 1.972zm1.75 13.019H3.585V9h3.502v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
        </svg>
      ),
    },
    {
      name: "Twitter",
      color: "#38bdf8",
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
          <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z" />
        </svg>
      ),
    },
    {
      name: "Instagram",
      color: "#f472b6",
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="2" width="20" height="20" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z" /><line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
        </svg>
      ),
    },
    {
      name: "YouTube",
      color: "#f87171",
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
          <path d="M22.54 6.42a2.78 2.78 0 00-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 00-1.95 1.96A29 29 0 001 12a29 29 0 00.46 5.58A2.78 2.78 0 003.41 19.6C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 001.95-1.95A29 29 0 0023 12a29 29 0 00-.46-5.58zM9.75 15.5V8.5l6.5 3.5-6.5 3.5z" />
        </svg>
      ),
    },
  ];

  return (
    <footer style={{
      background: "#000000",
      borderTop: "1px solid rgba(255,255,255,0.05)",
      marginTop: "2rem",
    }}>
      {/* Main footer content */}
      <div className="container" style={{ padding: "4rem 2rem 2rem" }}>
        <div style={{
          display: "grid",
          gridTemplateColumns: "2fr 1fr 1fr 1fr",
          gap: "3rem",
          marginBottom: "3rem",
        }}>
          {/* Brand column */}
          <div>
            <h2 style={{ margin: "0 0 1rem", fontSize: "1.6rem", fontWeight: 900, letterSpacing: "-0.5px" }}>
              <span style={{ color: "#e95e86" }}>Uni</span>
              <span style={{ color: "#ffffff" }}>Notes</span>
            </h2>
            <p style={{ color: "#475569", fontSize: "0.9rem", lineHeight: 1.8, maxWidth: "280px", marginBottom: "1.5rem" }}>
              India's leading platform for sharing and discovering high-quality academic notes from premier institutions.
            </p>
            {/* Social icons */}
            <div style={{ display: "flex", gap: "0.6rem" }}>
              {socials.map((s, i) => (
                <div
                  key={i}
                  title={s.name}
                  style={{
                    width: "36px", height: "36px",
                    borderRadius: "10px",
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(255,255,255,0.07)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    color: s.color,
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.background = `${s.color}18`;
                    e.currentTarget.style.borderColor = `${s.color}40`;
                    e.currentTarget.style.transform = "translateY(-2px)";
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.background = "rgba(255,255,255,0.04)";
                    e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)";
                    e.currentTarget.style.transform = "translateY(0)";
                  }}
                >
                  {s.icon}
                </div>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(links).map(([section, items]) => (
            <div key={section}>
              <h4 style={{ color: "#f1f5f9", fontSize: "0.8rem", fontWeight: 700, marginBottom: "1.2rem", letterSpacing: "0.1em", textTransform: "uppercase" }}>
                {section}
              </h4>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "0.6rem" }}>
                {items.map((item, i) => (
                  <li key={i}>
                    <a
                      href="#"
                      style={{ color: "#475569", fontSize: "0.875rem", textDecoration: "none", transition: "color 0.2s" }}
                      onMouseEnter={e => e.target.style.color = "#e95e86"}
                      onMouseLeave={e => e.target.style.color = "#475569"}
                    >
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div style={{
          borderTop: "1px solid rgba(255,255,255,0.05)",
          paddingTop: "1.5rem",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "1rem",
        }}>
          <p style={{ color: "#334155", fontSize: "0.82rem", margin: 0 }}>
            © {new Date().getFullYear()} UniNotes. All rights reserved. Built with ❤️ for Indian students.
          </p>
          <div style={{ display: "flex", gap: "1.5rem" }}>
            {["Privacy", "Terms", "Cookies"].map((t, i) => (
              <a
                key={i}
                href="#"
                style={{ color: "#334155", fontSize: "0.82rem", textDecoration: "none", transition: "color 0.2s" }}
                onMouseEnter={e => e.target.style.color = "#94a3b8"}
                onMouseLeave={e => e.target.style.color = "#334155"}
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

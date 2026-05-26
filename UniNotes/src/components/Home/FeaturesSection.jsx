import { Link } from "react-router-dom";

export default function FeaturesSection() {
  const features = [
    {
      title: "Filter by semester & branch",
      desc: "Don’t scroll through irrelevant notes. Find exactly what your syllabus needs.",
      linkText: "See it work →",
      linkTo: "/notes",
      iconBg: "rgba(37, 99, 235, 0.08)",
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
          <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
        </svg>
      )
    },
    {
      title: "Upload your own notes",
      desc: "Help juniors and build a contributor profile. Your work has a home here.",
      linkText: "Upload now →",
      linkTo: "/upload",
      iconBg: "rgba(22, 163, 74, 0.08)",
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <polyline points="17 8 12 3 7 8" />
          <line x1="12" y1="3" x2="12" y2="15" />
        </svg>
      )
    },
    {
      title: "Preview before downloading",
      desc: "Read the first few pages before you commit. No more downloading junk.",
      linkText: "Try browsing →",
      linkTo: "/notes",
      iconBg: "var(--primary-subtle)",
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
          <circle cx="12" cy="12" r="3" />
        </svg>
      )
    }
  ];

  return (
    <div className="container" style={{ marginTop: "6rem", marginBottom: "4rem" }}>
      {/* Header */}
      <div style={{ textAlign: "left", marginBottom: "3rem" }}>
        <p style={{
          fontSize: "0.72rem",
          fontWeight: 700,
          color: "var(--text-muted)",
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          marginBottom: "0.6rem"
        }}>
          WHAT YOU GET
        </p>
        <h2 style={{
          fontSize: "clamp(1.8rem, 3.5vw, 2.2rem)",
          fontWeight: 800,
          margin: "0 0 0.5rem",
          color: "var(--text)",
          letterSpacing: "-0.5px"
        }}>
          Built around how students actually study
        </h2>
        <p style={{ color: "var(--text-muted)", fontSize: "0.92rem", margin: 0 }}>
          Not another generic notes app. Every feature has a reason.
        </p>
      </div>

      {/* Cards Grid */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
        gap: "1.25rem"
      }}>
        {features.map((f, i) => (
          <Link to={f.linkTo} key={i} style={{ textDecoration: "none" }}>
            <div
              className="card"
              style={{
                padding: "2rem 1.75rem",
                borderRadius: "0px",
                height: "100%",
                display: "flex",
                flexDirection: "column",
                gap: "0.85rem",
                background: "var(--bg-card)"
              }}
            >
              {/* Icon Box */}
              <div style={{
                width: "36px",
                height: "36px",
                borderRadius: "0px",
                background: f.iconBg,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0
              }}>
                {f.icon}
              </div>

              {/* Text */}
              <h3 style={{ fontSize: "1.1rem", fontWeight: 700, color: "var(--text)", margin: 0 }}>
                {f.title}
              </h3>
              <p style={{ color: "var(--text-muted)", fontSize: "0.85rem", lineHeight: 1.6, flex: 1, margin: 0 }}>
                {f.desc}
              </p>

              {/* Action Link */}
              <span style={{ color: "var(--primary)", fontSize: "0.82rem", fontWeight: 600, display: "flex", alignItems: "center" }}>
                {f.linkText}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

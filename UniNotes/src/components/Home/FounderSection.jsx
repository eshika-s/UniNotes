import { Link } from "react-router-dom";

export default function FounderSection() {
  const steps = [
    {
      num: "01",
      title: "Search your subject",
      desc: "Type a subject name or filter by institution and semester."
    },
    {
      num: "02",
      title: "Preview the notes",
      desc: "Read a few pages inline before downloading anything."
    },
    {
      num: "03",
      title: "Download or contribute",
      desc: "Free to download. Upload your own to help others and build your profile."
    }
  ];

  return (
    <div className="container" style={{ marginTop: "6rem", marginBottom: "6rem" }}>
      {/* ── How It Works Section ────────────────────────────────────────── */}
      <div style={{ textAlign: "left", marginBottom: "4rem" }}>
        <p style={{
          fontSize: "0.72rem",
          fontWeight: 700,
          color: "var(--text-muted)",
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          marginBottom: "0.6rem"
        }}>
          HOW IT WORKS
        </p>
        <h2 style={{
          fontSize: "clamp(1.8rem, 3.5vw, 2.2rem)",
          fontWeight: 800,
          margin: 0,
          color: "var(--text)",
          letterSpacing: "-0.5px"
        }}>
          Three steps, no fluff
        </h2>
      </div>

      {/* Steps Grid */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
        gap: "2.5rem",
        marginBottom: "6rem"
      }}>
        {steps.map((step, i) => (
          <div key={i} style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
            {/* Number */}
            <div style={{
              fontSize: "1.4rem",
              fontWeight: 800,
              color: "var(--primary)",
              fontFamily: "Inter, sans-serif"
            }}>
              {step.num}
            </div>

            {/* Title */}
            <h3 style={{
              fontSize: "1.1rem",
              fontWeight: 700,
              color: "var(--text)",
              margin: 0
            }}>
              {step.title}
            </h3>

            {/* Description */}
            <p style={{
              color: "var(--text-muted)",
              fontSize: "0.88rem",
              lineHeight: 1.65,
              margin: 0
            }}>
              {step.desc}
            </p>
          </div>
        ))}
      </div>

      {/* ── Call To Action Banner ───────────────────────────────────────── */}
      <div style={{
        position: "relative",
        background: "#FDF4F0",
        borderTop: "1px solid rgba(193, 68, 14, 0.15)",
        borderBottom: "1px solid rgba(193, 68, 14, 0.15)",
        borderRadius: "0px",
        padding: "4rem 4rem",
        margin: "6rem -4rem -6rem",
        overflow: "hidden"
      }}>
        <div style={{
          position: "relative",
          zIndex: 2,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "2rem"
        }}>
          <div className="mobile-full-width" style={{ maxWidth: "580px" }}>
            <h2 style={{
              fontSize: "clamp(1.6rem, 3.5vw, 2.2rem)",
              fontWeight: 850,
              margin: "0 0 0.5rem 0",
              color: "var(--accent)",
              letterSpacing: "-0.8px"
            }}>
              Have good notes? Share them.
            </h2>
            <p style={{
              fontSize: "0.95rem",
              color: "var(--text-muted)",
              lineHeight: 1.6,
              margin: 0
            }}>
              Upload once, help hundreds of students studying the same syllabus.
            </p>
          </div>

          <Link to="/upload" style={{ textDecoration: "none" }}>
            <button
              className="btn"
              style={{
                background: "var(--primary)",
                color: "#ffffff",
                padding: "0.85rem 1.8rem",
                borderRadius: "0px",
                fontWeight: 600,
                fontSize: "0.9rem",
                display: "inline-flex",
                alignItems: "center",
                gap: "0.5rem",
                cursor: "pointer",
                border: "none",
                transition: "all 0.15s ease",
                boxShadow: "0 4px 14px var(--primary-glow)"
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = "var(--primary-hover)";
                e.currentTarget.style.transform = "translateY(-1px)";
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = "var(--primary)";
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              Upload your notes
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
              </svg>
            </button>
          </Link>
        </div>

        {/* Decorative subtle gradient reflection inside the banner */}
        <div style={{
          position: "absolute",
          top: "-50%",
          right: "-10%",
          width: "300px",
          height: "300px",
          background: "radial-gradient(circle, rgba(193, 68, 14, 0.04) 0%, transparent 70%)",
          borderRadius: "50%",
          pointerEvents: "none"
        }} />
      </div>
    </div>
  );
}

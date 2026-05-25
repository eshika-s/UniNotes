import { Link } from "react-router-dom";
import { useState } from "react";

const features = [
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" strokeWidth="2.5" />
      </svg>
    ),
    label: "Manage Notes",
    title: "Your Personal Notes Hub",
    desc: "Organise, sync and access your own notes from anywhere in a beautiful dashboard.",
    link: "/dashboard",
    color: "#e95e86",
    glow: "rgba(233,94,134,0.2)",
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
      </svg>
    ),
    label: "Browse & Discover",
    title: "Best Notes, Curated",
    desc: "Search premium notes from IITs, IIMs, and top Indian institutions in seconds.",
    link: "/notes",
    color: "#6366f1",
    glow: "rgba(99,102,241,0.2)",
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12" />
      </svg>
    ),
    label: "Upload & Share",
    title: "Contribute & Grow",
    desc: "Share your knowledge. Upload your notes and help thousands of students nationwide.",
    link: "/upload",
    color: "#f59e0b",
    glow: "rgba(245,158,11,0.2)",
  },
];

export default function FeaturesSection() {
  return (
    <>
      {/* ── Subscribe Banner ── */}
      <div className="container" style={{ position: "relative", zIndex: 10, marginTop: "0rem", paddingTop: "2rem" }}>
        <div style={{
          position: "relative",
          borderRadius: "28px",
          padding: "3.5rem 4rem",
          overflow: "hidden",
          background: "linear-gradient(135deg, #1a0a2e 0%, #16213e 50%, #0f3460 100%)",
          border: "1px solid rgba(99,102,241,0.25)",
          boxShadow: "0 20px 60px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.05)",
        }}>
          {/* Glowing blobs inside banner */}
          <div style={{
            position: "absolute", top: "-60px", left: "-60px",
            width: "300px", height: "300px",
            background: "radial-gradient(circle, rgba(233,94,134,0.25) 0%, transparent 70%)",
            pointerEvents: "none"
          }} />
          <div style={{
            position: "absolute", bottom: "-80px", right: "200px",
            width: "350px", height: "350px",
            background: "radial-gradient(circle, rgba(99,102,241,0.2) 0%, transparent 70%)",
            pointerEvents: "none"
          }} />

          <div style={{ position: "relative", zIndex: 2, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "2rem" }}>
            <div className="mobile-full-width" style={{ maxWidth: "520px" }}>
              <div className="badge badge-primary" style={{ marginBottom: "1rem" }}>
                📬 Stay Updated
              </div>
              <h2 style={{ fontSize: "2.2rem", fontWeight: 800, margin: "0 0 0.75rem", color: "#fff", lineHeight: 1.2 }}>
                Looking for the Best Notes?
              </h2>
              <p style={{ fontSize: "1rem", color: "#94a3b8", marginBottom: "2rem", lineHeight: 1.7 }}>
                Get notified when new premium notes land from top institutions — straight to your inbox.
              </p>

              <div className="mobile-flex-col" style={{ display: "flex", gap: "0.6rem" }}>
                <input
                  type="email"
                  className="mobile-input"
                  placeholder="Your email address"
                  style={{
                    padding: "0.85rem 1.5rem",
                    borderRadius: "999px",
                    border: "1px solid rgba(255,255,255,0.12)",
                    outline: "none",
                    width: "260px",
                    backgroundColor: "rgba(255,255,255,0.07)",
                    color: "white",
                    fontSize: "0.9rem",
                    backdropFilter: "blur(8px)",
                  }}
                />
                <button className="btn btn-primary" style={{ padding: "0.85rem 1.8rem" }}>
                  Subscribe
                </button>
              </div>
            </div>

            {/* Right: Decorative notebook */}
            <div className="hide-on-mobile" style={{ position: "relative" }}>
              <div style={{
                width: "200px", height: "270px",
                backgroundColor: "#f8fafc",
                borderRadius: "14px",
                boxShadow: "0 30px 60px rgba(0,0,0,0.5)",
                transform: "rotate(-4deg)",
                display: "flex",
                flexDirection: "column",
                overflow: "hidden",
              }}>
                <div style={{ height: "12px", background: "linear-gradient(90deg, #e95e86, #6366f1)", borderRadius: "14px 14px 0 0" }} />
                <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "6px", padding: "1rem" }}>
                  <h2 style={{ fontSize: "1.6rem", fontWeight: 900, margin: 0 }}>
                    <span style={{ color: "#e95e86" }}>Uni</span>
                    <span style={{ color: "#111827" }}>Notes</span>
                  </h2>
                  <div style={{ width: "40px", height: "2px", background: "linear-gradient(90deg,#e95e86,#6366f1)", borderRadius: "99px" }} />
                  {[...Array(5)].map((_, i) => (
                    <div key={i} style={{ width: "80%", height: "8px", background: "#f1f5f9", borderRadius: "4px", opacity: 1 - i * 0.15 }} />
                  ))}
                </div>
              </div>
              {/* Send button bubble */}
              <div style={{
                position: "absolute", bottom: "3rem", right: "-1.2rem",
                width: "44px", height: "44px",
                background: "linear-gradient(135deg, #e95e86, #6366f1)",
                borderRadius: "50%",
                display: "flex", alignItems: "center", justifyContent: "center",
                boxShadow: "0 6px 20px rgba(233,94,134,0.5)"
              }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Top Features ── */}
      <div className="container" style={{ marginTop: "7rem", textAlign: "center" }}>
        {/* Section header */}
        <div className="badge badge-primary" style={{ marginBottom: "1rem" }}>✦ What We Offer</div>
        <h2 style={{ fontSize: "clamp(1.8rem, 4vw, 2.8rem)", fontWeight: 800, marginBottom: "1rem", letterSpacing: "-0.5px" }}>
          Everything You Need to{" "}
          <span style={{ color: "#e95e86" }}>Excel</span>
        </h2>
        <p style={{ color: "#64748b", maxWidth: "520px", margin: "0 auto 4rem", fontSize: "1.05rem", lineHeight: 1.7 }}>
          From browsing to uploading — UniNotes gives you a complete study ecosystem.
        </p>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1.5rem", textAlign: "left" }}>
          {features.map((f, i) => (
            <FeatureCard key={i} feature={f} />
          ))}
        </div>
      </div>
    </>
  );
}

function FeatureCard({ feature }) {
  const [hovered, setHovered] = useState(false);

  return (
    <Link to={feature.link} style={{ textDecoration: "none", color: "inherit" }}>
      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          background: hovered
            ? `linear-gradient(145deg, rgba(${feature.color === "#e95e86" ? "233,94,134" : feature.color === "#6366f1" ? "99,102,241" : "245,158,11"},0.08) 0%, rgba(13,13,24,1) 100%)`
            : "linear-gradient(145deg, #0d0d18 0%, #0a0a14 100%)",
          border: `1px solid ${hovered ? feature.color + "55" : "rgba(255,255,255,0.06)"}`,
          borderRadius: "20px",
          padding: "2rem",
          cursor: "pointer",
          transition: "all 0.3s ease",
          transform: hovered ? "translateY(-6px)" : "translateY(0)",
          boxShadow: hovered ? `0 20px 50px ${feature.glow}` : "none",
          display: "flex",
          flexDirection: "column",
          gap: "1rem",
          height: "100%",
        }}
      >
        {/* Icon box */}
        <div style={{
          width: "56px", height: "56px",
          borderRadius: "14px",
          background: `${feature.color}18`,
          border: `1px solid ${feature.color}33`,
          display: "flex", alignItems: "center", justifyContent: "center",
          color: feature.color,
          transition: "all 0.3s ease",
          boxShadow: hovered ? `0 0 20px ${feature.glow}` : "none",
        }}>
          {feature.icon}
        </div>

        <div className="badge" style={{
          background: `${feature.color}12`,
          border: `1px solid ${feature.color}25`,
          color: feature.color,
          fontSize: "0.7rem",
          alignSelf: "flex-start"
        }}>
          {feature.label}
        </div>

        <h3 style={{ fontSize: "1.2rem", fontWeight: 700, color: "#f1f5f9", lineHeight: 1.3 }}>
          {feature.title}
        </h3>
        <p style={{ color: "#64748b", fontSize: "0.9rem", lineHeight: 1.7, flex: 1 }}>{feature.desc}</p>

        <div style={{
          display: "flex", alignItems: "center", gap: "0.4rem",
          color: feature.color, fontSize: "0.85rem", fontWeight: 600,
          opacity: hovered ? 1 : 0.5,
          transition: "all 0.3s ease"
        }}>
          Explore
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
          </svg>
        </div>
      </div>
    </Link>
  );
}

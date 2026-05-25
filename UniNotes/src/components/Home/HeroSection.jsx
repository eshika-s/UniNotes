import { Link } from "react-router-dom";
import { SparkleIcon, LightBulbIcon, PenIcon, DocumentIcon, OpenBookIcon, MagicWandIcon } from "./Icons";
import { useEffect, useRef } from "react";

const floatingItems = [
  { icon: <SparkleIcon />, style: { top: "18%", left: "8%" }, color: "#e95e86", delay: "0s", size: 1 },
  { icon: <LightBulbIcon />, style: { top: "38%", left: "5%" }, color: "#93c5fd", delay: "1s", size: 1.2 },
  { icon: <PenIcon />, style: { top: "68%", left: "12%" }, color: "#fcd34d", delay: "2s", size: 0.9 },
  { icon: <DocumentIcon />, style: { top: "50%", right: "8%" }, color: "#fb923c", delay: "0.5s", size: 1.1 },
  { icon: <OpenBookIcon />, style: { top: "22%", right: "12%" }, color: "#a78bfa", delay: "1.5s", size: 1 },
  { icon: <MagicWandIcon />, style: { top: "75%", right: "18%" }, color: "#6ee7b7", delay: "2.5s", size: 0.85 },
];

export default function HeroSection() {
  const titleRef = useRef(null);

  return (
    <div
      className="mobile-hero"
      style={{
        position: "relative",
        padding: "9rem 20px 7rem",
        textAlign: "center",
        overflow: "hidden",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {/* Ambient gradient blobs */}
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none", overflow: "hidden"
      }}>
        <div style={{
          position: "absolute", top: "10%", left: "20%",
          width: "500px", height: "500px",
          background: "radial-gradient(circle, rgba(233,94,134,0.12) 0%, transparent 70%)",
          borderRadius: "50%", filter: "blur(40px)"
        }} />
        <div style={{
          position: "absolute", bottom: "15%", right: "15%",
          width: "400px", height: "400px",
          background: "radial-gradient(circle, rgba(99,102,241,0.1) 0%, transparent 70%)",
          borderRadius: "50%", filter: "blur(40px)"
        }} />
        {/* Grid lines subtle */}
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: "linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)",
          backgroundSize: "60px 60px"
        }} />
      </div>

      {/* Floating Icons */}
      <div className="hide-on-mobile" style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
        {floatingItems.map((item, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              ...item.style,
              color: item.color,
              opacity: 0.55,
              animation: `float 5s ease-in-out ${item.delay} infinite`,
              transform: `scale(${item.size})`,
              filter: `drop-shadow(0 0 8px ${item.color}55)`,
            }}
          >
            {item.icon}
          </div>
        ))}
      </div>

      {/* Badge */}
      <div className="badge badge-primary scale-in" style={{ marginBottom: "1.5rem" }}>
        <svg width="10" height="10" viewBox="0 0 10 10" fill="currentColor">
          <circle cx="5" cy="5" r="5" opacity="0.5" />
          <circle cx="5" cy="5" r="2.5" />
        </svg>
        India's #1 Student Notes Platform
      </div>

      {/* Main heading */}
      <h1
        ref={titleRef}
        className="fade-in-up"
        style={{
          fontSize: "clamp(3.5rem, 8vw, 6.5rem)",
          fontWeight: 900,
          letterSpacing: "-2px",
          lineHeight: 1.05,
          marginBottom: "1.5rem",
          maxWidth: "900px",
        }}
      >
        <span style={{ color: "#ffffff" }}>Uni</span>
        <span style={{ color: "#e95e86", filter: "drop-shadow(0 0 30px rgba(233,94,134,0.5))" }}>Notes</span>
      </h1>

      {/* Subheading */}
      <p
        className="fade-in-up"
        style={{
          color: "#94a3b8",
          fontSize: "clamp(1rem, 2.5vw, 1.3rem)",
          maxWidth: "600px",
          marginBottom: "0.75rem",
          fontWeight: 400,
          lineHeight: 1.7,
          animationDelay: "0.15s"
        }}
      >
        Discover, share and ace your exams with premium notes from top institutions across India.
      </p>

      {/* Stats row */}
      <div
        className="fade-in-up hide-on-mobile"
        style={{
          display: "flex",
          gap: "2.5rem",
          marginBottom: "3rem",
          marginTop: "1rem",
          animationDelay: "0.3s"
        }}
      >
        {[
          { val: "10K+", label: "Notes" },
          { val: "50+", label: "Institutions" },
          { val: "5K+", label: "Students" },
        ].map((s, i) => (
          <div key={i} style={{ textAlign: "center" }}>
            <div style={{ fontSize: "1.6rem", fontWeight: 800, color: "#ffffff" }}>{s.val}</div>
            <div style={{ fontSize: "0.75rem", color: "#64748b", fontWeight: 500, letterSpacing: "0.08em", textTransform: "uppercase" }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* CTA Buttons */}
      <div
        className="fade-in-up"
        style={{ display: "flex", gap: "1rem", flexWrap: "wrap", justifyContent: "center", animationDelay: "0.4s" }}
      >
        <Link to="/notes">
          <button className="btn btn-primary" style={{ fontSize: "1rem", padding: "0.9rem 2.5rem" }}>
            Browse Notes
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
            </svg>
          </button>
        </Link>
        <Link to="/courses">
          <button className="btn btn-outline" style={{ fontSize: "1rem", padding: "0.9rem 2.5rem" }}>
            Explore Courses
          </button>
        </Link>
      </div>

      {/* Scroll indicator */}
      <div
        className="hide-on-mobile"
        style={{
          position: "absolute",
          bottom: "2.5rem",
          left: "50%",
          transform: "translateX(-50%)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "0.4rem",
          opacity: 0.35,
          animation: "float 2.5s ease-in-out infinite"
        }}
      >
        <div style={{ fontSize: "0.65rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "#64748b" }}>scroll</div>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2">
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </div>
    </div>
  );
}

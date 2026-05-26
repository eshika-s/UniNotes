import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import API from "../../services/api";

export default function HeroSection() {
  const [stats, setStats] = useState({ totalNotes: 43, totalUniversities: 13, totalUsers: 9 });

  useEffect(() => {
    API.get('/api/stats')
      .then(res => {
        if (res.data) {
          setStats({
            totalNotes: res.data.totalNotes || 43,
            totalUniversities: res.data.totalUniversities || 13,
            totalUsers: res.data.totalUsers || 9
          });
        }
      })
      .catch(() => {});
  }, []);

  return (
    <div
      className="mobile-hero"
      style={{
        position: "relative",
        padding: "8rem 4rem 4rem",
        overflow: "hidden",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "var(--bg)"
      }}
    >
      {/* Background soft mesh gradients */}
      <div style={{ position: "absolute", inset: 0, pointerEvents: "none", overflow: "hidden" }}>
        <div style={{
          position: "absolute",
          top: "-20%", left: "-10%",
          width: "60%", height: "100%",
          background: "radial-gradient(circle, rgba(193, 68, 14, 0.04) 0%, transparent 70%)",
        }} />
        <div style={{
          position: "absolute",
          bottom: "10%", right: "-10%",
          width: "60%", height: "80%",
          background: "radial-gradient(circle, rgba(28, 20, 16, 0.03) 0%, transparent 70%)",
        }} />
      </div>

      {/* Grid container */}
      <div
        className="mobile-flex-col"
        style={{
          position: "relative",
          zIndex: 10,
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "4rem",
          width: "100%",
          maxWidth: "100%",
          flexWrap: "wrap"
        }}
      >
        {/* Left Column: Text Content & Actions */}
        <div style={{ flex: "1 1 500px", maxWidth: "580px" }}>
          {/* Eyebrow badge */}
          <div style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.4rem",
            padding: "0.35rem 0.9rem",
            borderRadius: "0px",
            background: "var(--primary-subtle)",
            border: "1px solid rgba(193, 68, 14, 0.25)",
            color: "var(--primary)",
            fontSize: "0.78rem",
            fontWeight: 600,
            letterSpacing: "0.01em",
            marginBottom: "1.75rem",
          }}>
            <span style={{ width: "6px", height: "6px", borderRadius: "0px", background: "var(--primary)", display: "inline-block" }} />
            For Indian engineering students
          </div>

          {/* Heading */}
          <h1 style={{
            fontSize: "clamp(2.5rem, 5.5vw, 4.2rem)",
            fontWeight: 800,
            lineHeight: 1.1,
            letterSpacing: "-1.5px",
            color: "var(--text)",
            marginBottom: "1.5rem",
            fontFamily: "Inter, system-ui, sans-serif"
          }}>
            Notes from students who <span style={{ color: "var(--primary)" }}>actually</span> scored.
          </h1>

          {/* Subheading */}
          <p style={{
            color: "var(--text-muted)",
            fontSize: "1.02rem",
            lineHeight: 1.65,
            marginBottom: "2rem",
            maxWidth: "500px"
          }}>
            Real notes from real students at IITs, NITs, and BITS — not generic PDFs. Browse by subject, semester, or institution.
          </p>

          {/* CTA buttons */}
          <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
            <Link to="/notes" style={{ textDecoration: "none" }}>
              <button
                className="btn btn-primary"
                style={{
                  padding: "0.75rem 1.6rem",
                  borderRadius: "0px",
                  fontSize: "0.88rem",
                  fontWeight: 600,
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  cursor: "pointer",
                  boxShadow: "0 2px 12px var(--primary-glow)"
                }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
                Browse notes
              </button>
            </Link>
            <Link to="/upload" style={{ textDecoration: "none" }}>
              <button
                className="btn btn-outline"
                style={{
                  padding: "0.75rem 1.6rem",
                  borderRadius: "0px",
                  border: "1px solid var(--border)",
                  color: "var(--text)",
                  fontSize: "0.88rem",
                  fontWeight: 600,
                  cursor: "pointer",
                  transition: "all 0.15s ease"
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = "var(--primary)";
                  e.currentTarget.style.color = "var(--primary)";
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = "var(--border)";
                  e.currentTarget.style.color = "var(--text)";
                }}
              >
                Upload yours
              </button>
            </Link>
          </div>

          {/* Overlapping Avatars row */}
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginTop: "2rem" }}>
            <div style={{ display: "flex", alignItems: "center" }}>
              {[
                { label: "RS", bg: "#2563eb" },
                { label: "PM", bg: "#16a34a" },
                { label: "AK", bg: "#b91c1c" },
                { label: "SN", bg: "#6d28d9" }
              ].map((av, i) => (
                <div
                  key={i}
                  style={{
                    width: "28px",
                    height: "28px",
                    borderRadius: "0px",
                    background: av.bg,
                    border: "2px solid var(--bg)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "0.62rem",
                    fontWeight: 700,
                    color: "white",
                    marginLeft: i > 0 ? "-8px" : "0",
                    zIndex: 4 - i
                  }}
                >
                  {av.label}
                </div>
              ))}
            </div>
            <span style={{ fontSize: "0.82rem", color: "var(--text-muted)", fontWeight: 400 }}>
              <strong style={{ color: "var(--text)", fontWeight: 600 }}>{stats.totalNotes} notes</strong> shared by {stats.totalUsers} students so far — growing daily
            </span>
          </div>
        </div>

        {/* Right Column: Platform Preview Panel */}
        <div style={{ flex: "1 1 380px", maxWidth: "440px", width: "100%" }}>
          <div style={{
            background: "var(--bg-card)",
            border: "1px solid var(--border)",
            borderRadius: "0px",
            padding: "1.75rem",
            boxShadow: "var(--shadow-lg)"
          }}>
            {/* Header */}
            <div style={{ fontSize: "0.72rem", fontWeight: 700, color: "var(--text-muted)", letterSpacing: "0.08em", marginBottom: "1.25rem" }}>
              LIVE FROM THE PLATFORM
            </div>

            {/* Note items */}
            <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem", marginBottom: "1.25rem" }}>
              {[
                { title: "DSA — IIM Ahmedabad Notes", tag: "CS", author: "Rohan Gupta · CS201" },
                { title: "DBMS & SQL Quick Reference", tag: "DB", author: "Aman Kumar · G.L Bajaj" },
                { title: "Aptitude & Critical Thinking", tag: "APT", author: "Eshika Shukla · IIT Bhubaneswar" }
              ].map((note, i) => (
                <div
                  key={i}
                  style={{
                    background: "rgba(28, 20, 16, 0.03)",
                    border: "1px solid rgba(28, 20, 16, 0.05)",
                    borderRadius: "0px",
                    padding: "0.85rem 1rem",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center"
                  }}
                >
                  <div>
                    <h4 style={{ margin: 0, fontSize: "0.85rem", fontWeight: 600, color: "var(--text)" }}>{note.title}</h4>
                    <p style={{ margin: "0.2rem 0 0", fontSize: "0.72rem", color: "var(--text-muted)" }}>{note.author}</p>
                  </div>
                  <span style={{
                    background: "var(--primary-subtle)",
                    border: "1px solid rgba(193, 68, 14, 0.15)",
                    color: "var(--primary)",
                    padding: "2px 7px",
                    borderRadius: "0px",
                    fontSize: "0.68rem",
                    fontWeight: 700
                  }}>
                    {note.tag}
                  </span>
                </div>
              ))}
            </div>

            {/* Platform Stats Row */}
            <div style={{ display: "flex", gap: "0.6rem", marginBottom: "1rem" }}>
              {[
                { val: stats.totalNotes, label: "notes" },
                { val: stats.totalUniversities, label: "institutions" },
                { val: stats.totalUsers, label: "students" }
              ].map((stat, i) => (
                <div
                  key={i}
                  style={{
                    background: "rgba(28, 20, 16, 0.03)",
                    border: "1px solid rgba(28, 20, 16, 0.05)",
                    borderRadius: "0px",
                    padding: "0.6rem 0.2rem",
                    textAlign: "center",
                    flex: 1
                  }}
                >
                  <h4 style={{ margin: 0, fontSize: "1.2rem", fontWeight: 700, color: "var(--text)" }}>{stat.val}</h4>
                  <p style={{ margin: 0, fontSize: "0.62rem", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.04em" }}>{stat.label}</p>
                </div>
              ))}
            </div>

            {/* Bottom Caption */}
            <div style={{ textAlign: "center", fontSize: "0.72rem", color: "var(--text-muted)" }}>
              ↑ Show a real preview of your app, not just numbers
            </div>
          </div>
        </div>
      </div>

      {/* Down arrow icon pointer */}
      <div style={{
        position: "absolute",
        bottom: "1.5rem",
        left: "50%",
        transform: "translateX(-50%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "36px",
        height: "36px",
        borderRadius: "0px",
        border: "1px solid var(--border)",
        color: "var(--text-muted)",
        background: "var(--bg-card)"
      }}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <line x1="12" y1="5" x2="12" y2="19" /><polyline points="19 12 12 19 5 12" />
        </svg>
      </div>
    </div>
  );
}

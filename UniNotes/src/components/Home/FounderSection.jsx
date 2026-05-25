import { useState } from "react";

export default function FounderSection() {
  return (
    <div className="container" style={{ marginTop: "8rem", marginBottom: "6rem" }}>

      {/* Section label */}
      <div style={{ textAlign: "center", marginBottom: "3rem" }}>
        <div className="badge badge-primary" style={{ marginBottom: "1rem" }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
          </svg>
          Meet the Author
        </div>
        <div className="divider" />
      </div>

      {/* Card */}
      <div
        className="mobile-flex-col"
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "stretch",
          background: "linear-gradient(145deg, #0d0d18 0%, #111827 100%)",
          borderRadius: "28px",
          overflow: "hidden",
          border: "1px solid rgba(255,255,255,0.06)",
          boxShadow: "0 30px 80px rgba(0,0,0,0.7), 0 0 0 1px rgba(233,94,134,0.07)",
          flexWrap: "wrap",
          position: "relative",
        }}
      >
        {/* Pink accent line top */}
        <div style={{
          position: "absolute", top: 0, left: 0, right: 0,
          height: "3px",
          background: "linear-gradient(90deg, #e95e86, #6366f1, transparent)",
          borderRadius: "28px 28px 0 0",
          zIndex: 2,
        }} />

        {/* Ambient blob inside card */}
        <div style={{
          position: "absolute", top: "-100px", right: "-100px",
          width: "400px", height: "400px",
          background: "radial-gradient(circle, rgba(233,94,134,0.06) 0%, transparent 70%)",
          pointerEvents: "none",
        }} />

        {/* Left Side: Image */}
        <div className="founder-img-container">
          <img
            src="/founder2.jpeg"
            alt="Eshika Shukla"
            className="mobile-founder-img"
            style={{ width: "100%", height: "100%", display: "block", objectFit: "cover", objectPosition: "top" }}
          />
          {/* Gradient overlay */}
          <div style={{
            position: "absolute", inset: 0,
            background: "linear-gradient(to right, transparent 60%, #0d0d18 100%), linear-gradient(to top, rgba(13,13,24,0.8) 0%, transparent 40%)",
          }} />
        </div>

        {/* Right Side: Content */}
        <div
          className="mobile-founder-content"
          style={{
            flex: "1 1 62%",
            padding: "4rem 5rem",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            position: "relative",
            zIndex: 1,
          }}
        >
          {/* Quote icon */}
          <svg width="44" height="44" viewBox="0 0 24 24" fill="rgba(233,94,134,0.2)" style={{ marginBottom: "1.5rem" }}>
            <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
          </svg>

          <p style={{
            color: "#94a3b8",
            fontSize: "1.1rem",
            lineHeight: 1.85,
            marginBottom: "2.5rem",
            fontStyle: "italic",
            maxWidth: "560px",
            borderLeft: "3px solid rgba(233,94,134,0.4)",
            paddingLeft: "1.5rem",
          }}>
            As the founder of UniNotes, I play a key role in shaping the platform's vision and strategy. My focus is on product development, ensuring a seamless note-sharing experience for all students across Indian institutions.
          </p>

          {/* Name */}
          <div style={{ marginBottom: "2rem" }}>
            <h4 style={{ margin: "0 0 0.3rem", fontSize: "1.7rem", fontWeight: 800, color: "#ffffff", letterSpacing: "-0.5px" }}>
              Eshika Shukla
            </h4>
            <p style={{ color: "#e95e86", fontSize: "0.9rem", margin: 0, fontWeight: 600, letterSpacing: "0.04em", textTransform: "uppercase" }}>
              Founder & CEO, UniNotes
            </p>
          </div>

          {/* Divider */}
          <div style={{ width: "100%", height: "1px", background: "rgba(255,255,255,0.06)", marginBottom: "2rem" }} />

          {/* Contact links */}
          <div style={{ display: "flex", gap: "0.8rem", flexWrap: "wrap" }}>
            <SocialLink
              href="https://www.linkedin.com/in/eshika-shukla"
              color="#60a5fa"
              bg="rgba(10,102,194,0.12)"
              border="rgba(10,102,194,0.3)"
              hoverBg="rgba(10,102,194,0.25)"
              icon={
                <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.447 20.452H16.89v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a1.976 1.976 0 01-1.972-1.972 1.976 1.976 0 011.972-1.971 1.976 1.976 0 011.971 1.971 1.976 1.976 0 01-1.971 1.972zm1.75 13.019H3.585V9h3.502v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              }
              label="LinkedIn"
            />
            <SocialLink
              href="mailto:eshika081@gmail.com"
              color="#e95e86"
              bg="rgba(233,94,134,0.1)"
              border="rgba(233,94,134,0.3)"
              hoverBg="rgba(233,94,134,0.22)"
              icon={
                <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
                </svg>
              }
              label="Email"
            />
            <SocialLink
              href="tel:+917500901646"
              color="#10b981"
              bg="rgba(16,185,129,0.1)"
              border="rgba(16,185,129,0.3)"
              hoverBg="rgba(16,185,129,0.22)"
              icon={
                <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M6.62 10.79a15.05 15.05 0 006.59 6.59l2.2-2.2a1 1 0 011.01-.24c1.12.37 2.32.57 3.55.57a1 1 0 011 1V20a1 1 0 01-1 1C9.39 21 3 14.61 3 7a1 1 0 011-1h3.5a1 1 0 011 1c0 1.24.2 2.43.57 3.55a1 1 0 01-.25 1.01l-2.2 2.23z" />
                </svg>
              }
              label="Call"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function SocialLink({ href, color, bg, border, hoverBg, icon, label }) {
  const [hovered, setHovered] = useState(false);

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "0.5rem",
        background: hovered ? hoverBg : bg,
        border: `1px solid ${hovered ? color : border}`,
        borderRadius: "999px",
        padding: "0.55rem 1.3rem",
        color,
        fontSize: "0.87rem",
        fontWeight: 600,
        textDecoration: "none",
        transition: "all 0.22s ease",
        transform: hovered ? "translateY(-2px)" : "none",
        boxShadow: hovered ? `0 6px 16px ${bg}` : "none",
      }}
    >
      {icon}
      {label}
    </a>
  );
}

import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import API from "../../services/api";

const STATIC_UNIS = [
  "IIM Ahmedabad", "IIT Delhi", "IIT Bombay", "G.L Bajaj",
  "NMIMS", "Amity University", "LPU", "Sharda University",
  "BITS Pilani", "VIT Vellore", "Delhi University", "NIT Trichy",
];

export default function InstitutionsSection() {
  const navigate = useNavigate();
  const [searchInput, setSearchInput] = useState("");
  const [uniList, setUniList] = useState(STATIC_UNIS);
  const [focused, setFocused] = useState(false);

  useEffect(() => {
    API.get('/api/universities')
      .then(res => {
        const uniqueNames = [...new Set(res.data.map(u => u.name))];
        if (uniqueNames.length) setUniList(uniqueNames);
      })
      .catch(() => {});
  }, []);

  const handleSearch = () => {
    if (searchInput.trim()) {
      navigate(`/notes?university=${encodeURIComponent(searchInput.trim())}`);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSearch();
  };

  return (
    <div className="container" style={{ marginTop: "7rem", textAlign: "center" }}>
      {/* Section header */}
      <div className="badge badge-primary" style={{ marginBottom: "1rem" }}>🏛️ Top Institutions</div>
      <h2 style={{
        fontSize: "clamp(1.8rem, 4vw, 2.8rem)",
        fontWeight: 800,
        maxWidth: "720px",
        margin: "0 auto 1rem",
        letterSpacing: "-0.5px",
        lineHeight: 1.2,
      }}>
        Notes from India's{" "}
        <span style={{ color: "#e95e86" }}>Premier Institutions</span>
      </h2>
      <p style={{ color: "#64748b", maxWidth: "500px", margin: "0 auto 3rem", fontSize: "1rem", lineHeight: 1.7 }}>
        From IITs to private universities — find notes curated by top-performing students.
      </p>

      {/* Search bar */}
      <div style={{
        maxWidth: "560px",
        margin: "0 auto 3rem",
        display: "flex",
        alignItems: "center",
        background: focused ? "rgba(233,94,134,0.05)" : "rgba(255,255,255,0.04)",
        border: `1px solid ${focused ? "rgba(233,94,134,0.5)" : "rgba(255,255,255,0.1)"}`,
        borderRadius: "999px",
        padding: "0.4rem 0.6rem 0.4rem 1.2rem",
        transition: "all 0.3s ease",
        boxShadow: focused ? "0 0 0 3px rgba(233,94,134,0.08)" : "none",
      }}>
        <svg style={{ color: focused ? "#e95e86" : "#475569", marginRight: "0.8rem", flexShrink: 0, transition: "color 0.3s" }}
          width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        <input
          list="uni-home-options"
          type="text"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder="Search institution, subject..."
          style={{
            border: "none", outline: "none", width: "100%",
            color: "#f1f5f9", fontSize: "0.95rem",
            background: "transparent", fontFamily: "inherit"
          }}
        />
        <datalist id="uni-home-options">
          {uniList.map((u, idx) => <option key={idx} value={u} />)}
        </datalist>
        <button
          onClick={handleSearch}
          className="btn btn-primary"
          style={{ padding: "0.6rem 1.4rem", fontSize: "0.85rem", flexShrink: 0 }}
        >
          Search
        </button>
      </div>

      {/* Grid */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))",
        gap: "1rem",
        textAlign: "left"
      }}>
        {STATIC_UNIS.map((name, i) => (
          <UniCard key={i} name={name} index={i} />
        ))}
      </div>
    </div>
  );
}

const uniColors = [
  "#e95e86", "#6366f1", "#f59e0b", "#10b981",
  "#3b82f6", "#8b5cf6", "#ef4444", "#14b8a6",
  "#f97316", "#06b6d4", "#84cc16", "#ec4899",
];

function UniCard({ name, index }) {
  const navigate = useNavigate();
  const [hovered, setHovered] = useState(false);
  const color = uniColors[index % uniColors.length];
  const initials = name.split(" ").map(w => w[0]).join("").substring(0, 2).toUpperCase();

  return (
    <div
      onClick={() => navigate(`/notes?university=${encodeURIComponent(name)}`)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: hovered ? `${color}12` : "rgba(255,255,255,0.03)",
        border: `1px solid ${hovered ? color + "44" : "rgba(255,255,255,0.06)"}`,
        borderRadius: "16px",
        padding: "1.25rem 1rem",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "0.75rem",
        cursor: "pointer",
        transition: "all 0.25s ease",
        transform: hovered ? "translateY(-4px)" : "translateY(0)",
        boxShadow: hovered ? `0 12px 30px ${color}22` : "none",
        minHeight: "110px",
      }}
    >
      {/* Avatar */}
      <div style={{
        width: "44px", height: "44px",
        borderRadius: "12px",
        background: `${color}20`,
        border: `1px solid ${color}40`,
        display: "flex", alignItems: "center", justifyContent: "center",
        color,
        fontSize: "0.95rem",
        fontWeight: 800,
        transition: "all 0.25s ease",
        boxShadow: hovered ? `0 0 16px ${color}40` : "none",
      }}>
        {initials}
      </div>
      <p style={{
        margin: 0,
        fontSize: "0.8rem",
        fontWeight: 600,
        color: hovered ? "#f1f5f9" : "#94a3b8",
        textAlign: "center",
        lineHeight: 1.3,
        transition: "color 0.25s ease"
      }}>
        {name}
      </p>
    </div>
  );
}

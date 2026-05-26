export default function UniversityLogos() {
  const unis = [
    "IIT DELHI",
    "IIM AHMEDABAD",
    "BITS PILANI",
    "IIT BOMBAY",
    "NIT TRICHY",
    "IIIT HYDERABAD",
    "DTU DELHI"
  ];

  return (
    <div style={{
      width: "100%",
      background: "var(--bg-card)",
      borderTop: "1px solid var(--border)",
      borderBottom: "1px solid var(--border)",
      padding: "1.5rem 4rem",
      overflow: "hidden"
    }}>
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexWrap: "wrap",
        gap: "2rem",
        width: "100%"
      }}>
        {/* Eyebrow Label */}
        <span style={{
          fontSize: "0.68rem",
          fontWeight: 700,
          color: "var(--text-muted)",
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          whiteSpace: "nowrap"
        }}>
          Trusted by students from
        </span>

        {/* Logo Text List */}
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: "2.5rem",
          flexWrap: "wrap"
        }}>
          {unis.map((name, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: "2.5rem" }}>
              <span style={{
                fontSize: "0.85rem",
                fontWeight: 750,
                color: "var(--text-dim)",
                letterSpacing: "0.04em",
                fontFamily: "Inter, sans-serif"
              }}>
                {name}
              </span>
              {i < unis.length - 1 && (
                <span style={{ color: "rgba(193, 68, 14, 0.2)", fontWeight: 300, fontSize: "0.9rem" }}>/</span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import API from "../../services/api";

export default function InstitutionsSection() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({ totalNotes: 43 });

  useEffect(() => {
    API.get('/api/stats')
      .then(res => {
        if (res.data && res.data.totalNotes) {
          setStats({ totalNotes: res.data.totalNotes });
        }
      })
      .catch(() => {});
  }, []);

  const sampleNotes = [
    {
      code: "CS201",
      title: "Data Structures & Algorithms",
      meta: "IIM Ahmedabad · Sem 3",
      authorInitials: "RG",
      authorBg: "#2563eb",
      authorName: "Rohan G.",
      subjectQuery: "Data Structures & Algorithms"
    },
    {
      code: "CS303",
      title: "DBMS & SQL Quick Notes",
      meta: "G.L Bajaj · Sem 5",
      authorInitials: "AK",
      authorBg: "#16a34a",
      authorName: "Aman K.",
      subjectQuery: "Database Management"
    },
    {
      code: "APT",
      title: "Aptitude & Critical Thinking",
      meta: "IIT Bhubaneswar · Sem 2",
      authorInitials: "ES",
      authorBg: "var(--primary)",
      authorName: "Eshika S.",
      subjectQuery: "Aptitude & Critical Thinking"
    }
  ];

  return (
    <div className="container" style={{ marginTop: "6rem", marginBottom: "4rem" }}>
      {/* Header Row */}
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-end",
        marginBottom: "2.5rem",
        flexWrap: "wrap",
        gap: "1.5rem"
      }}>
        <div style={{ textAlign: "left" }}>
          <p style={{
            fontSize: "0.72rem",
            fontWeight: 700,
            color: "var(--text-muted)",
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            marginBottom: "0.6rem"
          }}>
            REAL NOTES, REAL STUDENTS
          </p>
          <h2 style={{
            fontSize: "clamp(1.8rem, 3.5vw, 2.2rem)",
            fontWeight: 800,
            margin: 0,
            color: "var(--text)",
            letterSpacing: "-0.5px"
          }}>
            What's on the platform right now
          </h2>
        </div>
        <Link to="/notes" style={{
          color: "var(--primary)",
          fontSize: "0.9rem",
          fontWeight: 600,
          textDecoration: "none",
          transition: "color 0.15s"
        }}
          onMouseEnter={e => e.currentTarget.style.color = "var(--primary-hover)"}
          onMouseLeave={e => e.currentTarget.style.color = "var(--primary)"}
        >
          Browse all {stats.totalNotes} →
        </Link>
      </div>

      {/* Grid containing the cards */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
        gap: "1.25rem"
      }}>
        {sampleNotes.map((note, i) => (
          <div
            key={i}
            className="card"
            style={{
              padding: "1.5rem",
              borderRadius: "0px",
              background: "var(--bg-card)",
              display: "flex",
              flexDirection: "column",
              height: "100%",
              cursor: "pointer"
            }}
            onClick={() => navigate(`/notes?subject=${encodeURIComponent(note.subjectQuery)}`)}
          >
            {/* Header Badge */}
            <div style={{ marginBottom: "1rem" }}>
              <span style={{
                background: "var(--primary-subtle)",
                border: "1px solid rgba(193, 68, 14, 0.15)",
                color: "var(--primary)",
                padding: "3px 8px",
                borderRadius: "0px",
                fontSize: "0.72rem",
                fontWeight: 700
              }}>
                {note.code}
              </span>
            </div>

            {/* Note Title */}
            <h3 style={{
              fontSize: "1.1rem",
              fontWeight: 700,
              color: "var(--text)",
              margin: "0 0 0.4rem 0",
              lineHeight: 1.35,
              flex: 1
            }}>
              {note.title}
            </h3>

            {/* Info Subtext */}
            <p style={{
              color: "var(--text-muted)",
              fontSize: "0.82rem",
              margin: "0 0 1.5rem 0"
            }}>
              {note.meta}
            </p>

            {/* Footer row */}
            <div style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              borderTop: "1px solid var(--border)",
              paddingTop: "1rem",
              marginTop: "auto"
            }}>
              {/* Contributor */}
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <div style={{
                  width: "26px",
                  height: "26px",
                  borderRadius: "0px",
                  background: note.authorBg,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "0.68rem",
                  fontWeight: 700,
                  color: "#ffffff"
                }}>
                  {note.authorInitials}
                </div>
                <span style={{
                  fontSize: "0.82rem",
                  color: "var(--text-muted)",
                  fontWeight: 500
                }}>
                  {note.authorName}
                </span>
              </div>

              {/* Action Button */}
              <span style={{
                color: "var(--primary)",
                fontSize: "0.82rem",
                fontWeight: 600,
                display: "flex",
                alignItems: "center",
                gap: "0.25rem"
              }}>
                ↓ PDF
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

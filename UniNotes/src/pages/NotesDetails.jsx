import { useParams, Link } from "react-router-dom";

function NotesDetails() {
  const { id } = useParams();

  return (
    <div className="container fade-in" style={{ maxWidth: '800px', margin: '0 auto', minHeight: '80vh', display: 'flex', flexDirection: 'column' }}>
      <div style={{ marginBottom: "2rem" }}>
        <Link to="/notes" style={{
          padding: "0.5rem 1rem",
          background: "var(--bg-card)",
          border: "1px solid var(--border)",
          borderRadius: "0px",
          display: "inline-flex",
          alignItems: "center",
          fontWeight: 600,
          color: "var(--text)",
          textDecoration: "none",
          boxShadow: "var(--shadow-sm)"
        }}>
          ← Back to Notes
        </Link>
      </div>

      <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', padding: '3rem', borderRadius: '0px', flex: 1, boxShadow: 'var(--shadow-lg)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' }}>
          <div>
            <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem', color: 'var(--text)' }}>Document Loading...</h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>ID: {id}</p>
          </div>
          <span style={{
            background: 'var(--primary)',
            color: 'white',
            padding: '4px 12px',
            borderRadius: '0px',
            fontSize: '0.85rem',
            fontWeight: 700
          }}>PDF</span>
        </div>

        <div style={{
          width: '100%',
          height: '400px',
          background: 'var(--bg-2)',
          borderRadius: '0px',
          border: '1px dashed var(--border)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--text-muted)'
        }}>
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: '1rem', opacity: 0.5 }}>
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
            <polyline points="14 2 14 8 20 8"></polyline>
            <line x1="16" y1="13" x2="8" y2="13"></line>
            <line x1="16" y1="17" x2="8" y2="17"></line>
            <polyline points="10 9 9 9 8 9"></polyline>
          </svg>
          <p>Document Viewer Integration Coming Soon</p>
        </div>
      </div>
    </div>
  );
}

export default NotesDetails;

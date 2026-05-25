import { useParams, Link } from "react-router-dom";

function NotesDetails() {
  const { id } = useParams();

  return (
    <div className="container fade-in" style={{ maxWidth: '800px', margin: '0 auto', minHeight: '80vh', display: 'flex', flexDirection: 'column' }}>
      <div style={{ marginBottom: "2rem" }}>
        <Link to="/notes" style={{
          padding: "0.5rem 1rem",
          background: "rgba(255,255,255,0.1)",
          borderRadius: "8px",
          display: "inline-flex",
          alignItems: "center",
          fontWeight: 600,
          color: "#f8fafc",
          textDecoration: "none"
        }}>
          ← Back to Notes
        </Link>
      </div>

      <div className="glass-panel" style={{ padding: '3rem', borderRadius: '16px', flex: 1 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' }}>
          <div>
            <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem', color: '#f8fafc' }}>Document Loading...</h1>
            <p style={{ color: '#94a3b8', fontSize: '1.1rem' }}>ID: {id}</p>
          </div>
          <span style={{
            background: 'var(--primary-color)',
            color: 'white',
            padding: '4px 12px',
            borderRadius: '999px',
            fontSize: '0.85rem',
            fontWeight: 700
          }}>PDF</span>
        </div>

        <div style={{
          width: '100%',
          height: '400px',
          background: 'rgba(0,0,0,0.3)',
          borderRadius: '12px',
          border: '1px dashed var(--border-color)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#64748b'
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

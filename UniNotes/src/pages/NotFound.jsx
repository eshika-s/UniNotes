import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div style={{
      minHeight: '100vh',
      width: '100%',
      backgroundColor: 'var(--bg)',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      fontFamily: 'Inter, sans-serif',
      padding: '2rem'
    }}>
      <div style={{
        textAlign: 'center',
        maxWidth: '400px',
        width: '100%',
      }}>
        {/* 404 */}
        <h1 style={{
          fontSize: '6rem',
          fontWeight: 900,
          margin: 0,
          color: 'var(--primary)',
          lineHeight: 1,
          letterSpacing: '-0.04em'
        }}>
          404
        </h1>

        <h2 style={{
          color: 'var(--text)',
          fontSize: '1.4rem',
          fontWeight: 700,
          marginTop: '1rem',
          marginBottom: '0.75rem'
        }}>
          Page not found
        </h2>

        <p style={{
          color: 'var(--text-muted)',
          fontSize: '0.92rem',
          lineHeight: 1.6,
          margin: '0 0 2rem 0',
        }}>
          The page you're looking for doesn't exist or has been moved.
        </p>

        <Link
          to="/home"
          className="btn btn-primary"
        >
          ← Back to Home
        </Link>
      </div>
    </div>
  );
}

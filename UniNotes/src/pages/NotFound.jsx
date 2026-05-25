import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div style={{
      minHeight: '100vh',
      width: '100%',
      backgroundColor: '#000000',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      fontFamily: 'Inter, sans-serif',
      position: 'relative',
      overflow: 'hidden',
      padding: '2rem'
    }}>
      {/* Dynamic BG elements */}
      <div style={{
        position: 'absolute',
        top: '20%',
        left: '10%',
        width: '300px',
        height: '300px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(233, 94, 134, 0.08) 0%, transparent 70%)',
        filter: 'blur(40px)',
        pointerEvents: 'none'
      }} />
      <div style={{
        position: 'absolute',
        bottom: '15%',
        right: '10%',
        width: '400px',
        height: '400px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(90, 103, 216, 0.08) 0%, transparent 70%)',
        filter: 'blur(50px)',
        pointerEvents: 'none'
      }} />

      {/* Floating Sparkle / Pen / Document Icons in background */}
      <div style={{
        position: 'absolute',
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        opacity: 0.25
      }}>
        <div style={{ position: 'absolute', top: '15%', right: '20%', fontSize: '2.5rem', animation: 'floatAnimation 6s ease-in-out infinite' }}>📚</div>
        <div style={{ position: 'absolute', bottom: '25%', left: '15%', fontSize: '2rem', animation: 'floatAnimation 8s ease-in-out infinite' }}>✏️</div>
        <div style={{ position: 'absolute', top: '45%', left: '25%', fontSize: '2.2rem', animation: 'floatAnimation 7s ease-in-out infinite' }}>🎓</div>
        <div style={{ position: 'absolute', bottom: '35%', right: '25%', fontSize: '1.8rem', animation: 'floatAnimation 9s ease-in-out infinite' }}>✨</div>
      </div>

      <div style={{
        background: 'rgba(255, 255, 255, 0.03)',
        backdropFilter: 'blur(24px)',
        webkitBackdropFilter: 'blur(24px)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: '32px',
        padding: '4rem 3rem',
        textAlign: 'center',
        maxWidth: '520px',
        width: '100%',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.9), 0 0 50px rgba(233, 94, 134, 0.05)',
        zIndex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
      }}>
        {/* Massive 404 */}
        <h1 style={{
          fontSize: '8rem',
          fontWeight: 900,
          margin: 0,
          background: 'linear-gradient(135deg, #e95e86 0%, #fca5a5 100%)',
          webkitBackgroundClip: 'text',
          webkitTextFillColor: 'transparent',
          lineHeight: 1,
          letterSpacing: '-0.04em'
        }}>
          404
        </h1>

        <h2 style={{
          color: '#ffffff',
          fontSize: '1.75rem',
          fontWeight: 700,
          marginTop: '1.5rem',
          marginBottom: '1rem'
        }}>
          Lost in Space?
        </h2>

        <p style={{
          color: '#9ca3af',
          fontSize: '1rem',
          lineHeight: 1.6,
          margin: '0 0 2.5rem 0',
          maxWidth: '380px'
        }}>
          The notes or page you are looking for might have been moved, deleted, or never existed in our semester syllabus.
        </p>

        <Link
          to="/home"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.8rem 2.2rem',
            background: '#e95e86',
            color: '#ffffff',
            borderRadius: '999px',
            fontSize: '1rem',
            fontWeight: 600,
            textDecoration: 'none',
            boxShadow: '0 8px 24px rgba(233, 94, 134, 0.35), inset 0 -4px 0 rgba(0,0,0,0.15)',
            transition: 'transform 0.2s, background 0.2s, box-shadow 0.2s'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = '#d94872';
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 12px 30px rgba(233, 94, 134, 0.5)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = '#e95e86';
            e.currentTarget.style.transform = 'none';
            e.currentTarget.style.boxShadow = '0 8px 24px rgba(233, 94, 134, 0.35)';
          }}
        >
          <span>🏠</span> Back to Home
        </Link>
      </div>

      <style>{`
        @keyframes floatAnimation {
          0% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(8deg); }
          100% { transform: translateY(0px) rotate(0deg); }
        }
      `}</style>
    </div>
  );
}

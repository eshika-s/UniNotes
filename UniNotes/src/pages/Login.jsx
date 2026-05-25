import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../services/api";
import { useToast } from "../context/ToastContext";

function Login() {
  const { showToast } = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await API.post('/api/auth/login', { email, password });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));

      showToast(`Welcome back, ${res.data.user.name}!`, "success");
      navigate('/home');
    } catch (err) {
      showToast(err.response?.data?.message || 'Login failed. Check your credentials.', "error");
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    if (!email) {
      showToast("Email address is required.", "warning");
      return;
    }
    setLoading(true);

    try {
      const res = await API.post('/api/auth/forgot-password', { email });
      showToast(res.data.message, "success");
      setIsForgotPassword(false);
    } catch (err) {
      showToast(err.response?.data?.message || 'Reset request failed.', "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh', width: '100vw', display: 'flex', justifyContent: 'center', alignItems: 'center',
      backgroundColor: '#000000', position: 'fixed', top: 0, left: 0, zIndex: 1000, overflowY: 'auto', fontFamily: 'Inter, sans-serif',
      padding: '2rem 1rem'
    }}>
      {renderFloatingIcons()}

      <Link to="/home" style={{ position: 'absolute', top: '2rem', left: '2rem', color: '#a1a1aa', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem', zIndex: 10, fontWeight: 500, transition: 'color 0.2s' }} onMouseOver={(e) => e.target.style.color = 'white'} onMouseOut={(e) => e.target.style.color = '#a1a1aa'}>
        ← Back to Home
      </Link>

      <div style={{
        width: '100%', maxWidth: '420px', background: 'rgba(30, 30, 35, 0.85)', backdropFilter: 'blur(20px)',
        border: '1px solid #e95e86', borderRadius: '24px', padding: '3rem 2.5rem',
        boxShadow: '0 0 40px rgba(233, 94, 134, 0.15), 0 25px 50px -12px rgba(0, 0, 0, 0.8)', zIndex: 1, color: 'white', display: 'flex', flexDirection: 'column',
        margin: '2rem 1rem'
      }}>
        {isForgotPassword ? (
          <>
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
              <h1 style={{ fontSize: '2rem', fontWeight: 800, margin: '0 0 0.5rem 0', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.2rem' }}>
                <span style={{ color: '#e95e86' }}>Reset</span>Password
              </h1>
              <p style={{ color: '#a1a1aa', margin: 0, fontSize: '0.95rem' }}>Enter your email to receive a recovery link.</p>
            </div>

            <form onSubmit={handleForgotPassword} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ fontSize: '0.85rem', fontWeight: 500, color: '#e4e4e7' }}>Email Address</label>
                <input type="email" placeholder="you@university.edu" value={email} onChange={(e) => setEmail(e.target.value)} required style={inputStyle} onFocus={handleFocus} onBlur={handleBlur} />
              </div>

              <button type="submit" disabled={loading} style={{ width: '100%', padding: '0.875rem', background: loading ? '#52525b' : '#e95e86', color: 'white', border: 'none', borderRadius: '10px', fontSize: '1rem', fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer', marginTop: '0.5rem', transition: 'background 0.2s, transform 0.1s' }} onMouseOver={(e) => !loading && (e.target.style.background = '#d94872')} onMouseOut={(e) => !loading && (e.target.style.background = '#e95e86')} onMouseDown={(e) => !loading && (e.target.style.transform = 'scale(0.98)')} onMouseUp={(e) => !loading && (e.target.style.transform = 'scale(1)')}>
                {loading ? 'Sending link...' : 'Send Recovery Link'}
              </button>

              <button type="button" onClick={() => setIsForgotPassword(false)} style={{ background: 'none', border: 'none', color: '#a1a1aa', cursor: 'pointer', fontSize: '0.9rem', fontWeight: 500, transition: 'color 0.2s', marginTop: '0.5rem' }} onMouseOver={(e) => e.target.style.color = 'white'} onMouseOut={(e) => e.target.style.color = '#a1a1aa'}>
                Back to Sign In
              </button>
            </form>
          </>
        ) : (
          <>
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
              <h1 style={{ fontSize: '2rem', fontWeight: 800, margin: '0 0 0.5rem 0', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.2rem' }}>
                <span style={{ color: '#e95e86' }}>Uni</span>Notes
              </h1>
              <p style={{ color: '#a1a1aa', margin: 0, fontSize: '0.95rem' }}>Welcome back! Please enter your details.</p>
            </div>

            <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ fontSize: '0.85rem', fontWeight: 500, color: '#e4e4e7' }}>Email Address</label>
                <input type="email" placeholder="you@university.edu" value={email} onChange={(e) => setEmail(e.target.value)} required style={inputStyle} onFocus={handleFocus} onBlur={handleBlur} />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ fontSize: '0.85rem', fontWeight: 500, color: '#e4e4e7' }}>Password</label>
                <div style={{ position: 'relative' }}>
                  <input type={showPassword ? "text" : "password"} placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required style={{ ...inputStyle, paddingRight: '4rem' }} onFocus={handleFocus} onBlur={handleBlur} />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#a1a1aa', cursor: 'pointer', padding: 0 }}>
                    {showPassword ? 'Hide' : 'Show'}
                  </button>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: '#a1a1aa', cursor: 'pointer' }}>
                  <input type="checkbox" style={{ accentColor: '#e95e86', cursor: 'pointer', width: '16px', height: '16px' }} /> Remember me
                </label>
                <button type="button" onClick={() => setIsForgotPassword(true)} style={{ background: 'none', border: 'none', fontSize: '0.85rem', color: '#e95e86', textDecoration: 'none', cursor: 'pointer', padding: 0 }}>Forgot password?</button>
              </div>

              <button type="submit" disabled={loading} style={{ width: '100%', padding: '0.875rem', background: loading ? '#52525b' : '#e95e86', color: 'white', border: 'none', borderRadius: '10px', fontSize: '1rem', fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer', marginTop: '0.5rem', transition: 'background 0.2s, transform 0.1s' }} onMouseOver={(e) => !loading && (e.target.style.background = '#d94872')} onMouseOut={(e) => !loading && (e.target.style.background = '#e95e86')} onMouseDown={(e) => !loading && (e.target.style.transform = 'scale(0.98)')} onMouseUp={(e) => !loading && (e.target.style.transform = 'scale(1)')}>
                {loading ? 'Signing in...' : 'Sign in'}
              </button>
            </form>

            <p style={{ textAlign: 'center', marginTop: '2rem', fontSize: '0.9rem', color: '#a1a1aa' }}>
              Don't have an account? <Link to="/register" style={{ color: 'white', textDecoration: 'none', fontWeight: 600 }}>Sign up</Link>
            </p>
          </>
        )}
      </div>

      <style>{`
        @keyframes float {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
      `}</style>
    </div>
  );
}

const inputStyle = {
  width: '100%', background: 'rgba(0, 0, 0, 0.3)', border: '1px solid rgba(255, 255, 255, 0.1)',
  borderRadius: '10px', padding: '0.875rem 1rem', color: 'white', outline: 'none',
  transition: 'border-color 0.2s', boxSizing: 'border-box'
};

const handleFocus = (e) => e.target.style.borderColor = '#e95e86';
const handleBlur = (e) => e.target.style.borderColor = 'rgba(255,255,255,0.1)';

const renderFloatingIcons = () => {
  return (
    <>
      <div style={{ position: 'absolute', top: '15%', left: '25%', color: '#818cf8', opacity: 0.8 }}>
        <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2l3 7 7 3-7 3-3 7-3-7-7-3 7-3z" />
        </svg>
      </div>
      <div style={{ position: 'absolute', top: '40%', right: '18%', color: '#fca5a5', opacity: 0.8, transform: 'rotate(15deg)' }}>
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
          <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
        </svg>
      </div>
      <div style={{ position: 'absolute', top: '35%', left: '15%', color: '#93c5fd', opacity: 0.8, transform: 'rotate(-10deg)' }}>
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9 18h6" />
          <path d="M10 22h4" />
          <path d="M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0 0 18 8 6 6 0 0 0 6 8c0 1.45.62 2.84 1.5 3.5.76.76 1.23 1.52 1.41 2.5" />
        </svg>
      </div>
      <div style={{ position: 'absolute', bottom: '30%', left: '30%', color: '#fcd34d', opacity: 0.8, transform: 'rotate(45deg)' }}>
        <svg width="35" height="35" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 19l7-7 3 3-7 7-3-3z" />
          <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z" />
          <path d="M2 2l7.586 7.586" />
          <circle cx="11" cy="11" r="2" />
        </svg>
      </div>
      <div style={{ position: 'absolute', bottom: '25%', right: '35%', color: '#fb923c', opacity: 0.8, transform: 'rotate(-15deg)' }}>
        <svg width="35" height="35" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
        </svg>
      </div>
      <div style={{ position: 'absolute', bottom: '20%', right: '15%', color: '#8b5cf6', opacity: 0.9 }}>
        <svg width="45" height="45" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2v4" />
          <path d="M12 18v4" />
          <path d="M4.93 4.93l2.83 2.83" />
          <path d="M16.24 16.24l2.83 2.83" />
          <path d="M2 12h4" />
          <path d="M18 12h4" />
          <path d="M4.93 19.07l2.83-2.83" />
          <path d="M16.24 7.76l2.83-2.83" />
        </svg>
      </div>
      <div style={{ position: 'absolute', bottom: '15%', left: '15%', color: '#fdba74', opacity: 0.8, transform: 'rotate(-30deg)' }}>
        <svg width="45" height="45" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
          <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
        </svg>
      </div>
      <div style={{ position: 'absolute', bottom: '10%', right: '30%', color: '#818cf8', opacity: 0.8, transform: 'rotate(20deg)' }}>
        <svg width="50" height="50" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M15 4V2" />
          <path d="M15 16v-2" />
          <path d="M8 9h2" />
          <path d="M20 9h2" />
          <path d="M17.8 11.8L19 13" />
          <path d="M15 9h0" />
          <path d="M17.8 6.2L19 5" />
          <path d="M3 21l9-9" />
          <path d="M12.2 6.2L11 5" />
        </svg>
      </div>
      <div style={{ position: 'absolute', top: '25%', left: '8%', color: '#a78bfa', opacity: 0.8, transform: 'rotate(15deg)' }}>
        <svg width="25" height="25" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 19l7-7 3 3-7 7-3-3z" />
          <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z" />
          <path d="M2 2l7.586 7.586" />
        </svg>
      </div>
      <div style={{ position: 'absolute', bottom: '10%', right: '5%', color: '#a78bfa', opacity: 0.7, transform: 'rotate(15deg)' }}>
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9 18h6" />
          <path d="M10 22h4" />
          <path d="M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0 0 18 8 6 6 0 0 0 6 8c0 1.45.62 2.84 1.5 3.5.76.76 1.23 1.52 1.41 2.5" />
        </svg>
      </div>
    </>
  );
};

export default Login;
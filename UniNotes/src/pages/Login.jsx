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

  const handleGoogleLogin = () => {
    showToast("Google Authentication integration coming soon!", "info");
  };

  return (
    <div style={{
      minHeight: '100vh', width: '100vw', display: 'flex', flexDirection: 'column',
      justifyContent: 'center', alignItems: 'center', backgroundColor: 'var(--bg)',
      fontFamily: 'Inter, sans-serif', position: 'relative', padding: '5rem 1rem 3rem'
    }}>
      {/* Top Header Bar */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: '4.5rem',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '0 2rem', borderBottom: '1px solid var(--border)', zIndex: 10
      }}>
        <Link to="/home" style={{ textDecoration: 'none' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0 }}>
            <span style={{ color: 'var(--primary)' }}>Uni</span>
            <span style={{ color: 'var(--accent)' }}>Notes</span>
          </h2>
        </Link>
        <span style={{ fontSize: '0.88rem', color: 'var(--text-muted)', fontWeight: 500 }}>
          Don't have an account?{' '}
          <Link to="/register" style={{ color: 'var(--primary)', textDecoration: 'none', fontWeight: 600 }}>
            Sign up free
          </Link>
        </span>
      </div>

      {/* Subtle background gradient */}
      <div style={{
        position: 'absolute', top: '15%', left: '30%',
        width: '500px', height: '500px',
        background: 'radial-gradient(circle, rgba(193, 68, 14, 0.04) 0%, transparent 65%)',
        pointerEvents: 'none',
      }} />

      {/* Main Form Container */}
      <div style={{
        width: '100%', maxWidth: '400px', background: 'var(--bg-card)',
        border: '1px solid var(--border)', borderRadius: '0px', padding: '2.5rem 2rem',
        zIndex: 1, color: 'var(--text)', display: 'flex', flexDirection: 'column',
        boxShadow: 'var(--shadow-lg)'
      }}>
        {isForgotPassword ? (
          <>
            <div style={{ marginBottom: '1.75rem', textAlign: 'center' }}>
              <h1 style={{ fontSize: '1.5rem', fontWeight: 800, margin: '0 0 0.35rem 0', color: 'var(--text)' }}>
                Reset password
              </h1>
              <p style={{ color: 'var(--text-muted)', margin: 0, fontSize: '0.88rem' }}>Enter your email to receive a recovery link.</p>
            </div>

            <form onSubmit={handleForgotPassword} style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
              <div>
                <label className="form-label">Email address</label>
                <input type="email" placeholder="you@university.edu" value={email} onChange={(e) => setEmail(e.target.value)} required className="form-input" />
              </div>

              <button type="submit" disabled={loading} style={btnStyle(loading)}>
                {loading ? 'Sending...' : 'Send Recovery Link'}
              </button>

              <button type="button" onClick={() => setIsForgotPassword(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 500, transition: 'color 0.15s', marginTop: '0.25rem' }} onMouseOver={(e) => e.target.style.color = 'var(--text)'} onMouseOut={(e) => e.target.style.color = 'var(--text-muted)'}>
                Back to sign in
              </button>
            </form>
          </>
        ) : (
          <>
            <div style={{ marginBottom: '1.75rem', textAlign: 'center' }}>
              <h1 style={{ fontSize: '1.75rem', fontWeight: 800, margin: '0 0 0.35rem 0', color: 'var(--text)', letterSpacing: '-0.3px' }}>
                Welcome back
              </h1>
              <p style={{ color: 'var(--text-muted)', margin: 0, fontSize: '0.88rem' }}>Log in to access your notes and uploads.</p>
            </div>

            {/* Google OAuth Button */}
            <button type="button" onClick={handleGoogleLogin} style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem',
              width: '100%', padding: '0.75rem', background: 'var(--bg)', border: '1px solid var(--border)',
              borderRadius: '0px', fontSize: '0.9rem', fontWeight: 600, color: 'var(--text)',
              cursor: 'pointer', transition: 'background 0.15s', fontFamily: 'inherit'
            }} onMouseOver={(e) => e.currentTarget.style.background = 'var(--bg-card-2)'} onMouseOut={(e) => e.currentTarget.style.background = 'var(--bg)'}>
              <svg width="18" height="18" viewBox="0 0 24 24">
                <path fill="#EA4335" d="M12 5.04c1.66 0 3.2.57 4.38 1.69l3.27-3.27C17.67 1.54 14.98 1 12 1 7.35 1 3.37 3.65 1.41 7.55l3.84 2.98C6.18 7.23 8.87 5.04 12 5.04z" />
                <path fill="#4285F4" d="M23.49 12.27c0-.81-.07-1.59-.2-2.36H12v4.51h6.43c-.28 1.44-1.09 2.67-2.3 3.49l3.58 2.78c2.1-1.94 3.3-4.8 3.3-8.42z" />
                <path fill="#FBBC05" d="M5.25 14.53c-.24-.72-.38-1.49-.38-2.28 0-.79.14-1.56.38-2.28L1.41 7.27C.51 9.07 0 11.08 0 13.2c0 2.12.51 4.13 1.41 5.93l3.84-2.93z" />
                <path fill="#34A853" d="M12 23c3.24 0 5.97-1.08 7.96-2.91l-3.58-2.78c-1 .67-2.28 1.07-3.78 1.07-3.13 0-5.82-2.19-6.76-5.49L1 16.82C2.96 20.72 6.94 23 12 23z" />
              </svg>
              Continue with Google
            </button>

            {/* Divider */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', margin: '1.25rem 0', color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: 500 }}>
              <div style={{ flex: 1, height: '1px', background: 'var(--border)' }} />
              or
              <div style={{ flex: 1, height: '1px', background: 'var(--border)' }} />
            </div>

            <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
              <div>
                <label className="form-label">Email address</label>
                <input type="email" placeholder="you@university.edu" value={email} onChange={(e) => setEmail(e.target.value)} required className="form-input" />
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                  <label className="form-label" style={{ margin: 0 }}>Password</label>
                  <button type="button" onClick={() => setIsForgotPassword(true)} style={{ background: 'none', border: 'none', fontSize: '0.82rem', color: 'var(--primary)', cursor: 'pointer', padding: 0, fontWeight: 500 }}>
                    Forgot password?
                  </button>
                </div>
                <div style={{ position: 'relative' }}>
                  <input type={showPassword ? "text" : "password"} placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required className="form-input" style={{ paddingRight: '3.5rem' }} />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} style={{
                    position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)',
                    background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer',
                    padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center'
                  }}>
                    {showPassword ? (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>
                    ) : (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                    )}
                  </button>
                </div>
              </div>

              <button type="submit" disabled={loading} style={btnStyle(loading)}>
                {loading ? 'Logging in...' : 'Log in'}
              </button>
            </form>

            <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 500 }}>
              New here? <Link to="/register" style={{ color: 'var(--primary)', textDecoration: 'none', fontWeight: 600 }}>Create a free account</Link>
            </p>
          </>
        )}
      </div>

      {/* Footer text */}
      <span style={{ position: 'absolute', bottom: '2rem', fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 500 }}>
        By logging in you agree to <span style={{ textDecoration: 'underline', cursor: 'pointer' }}>Terms</span> and <span style={{ textDecoration: 'underline', cursor: 'pointer' }}>Privacy Policy</span>
      </span>
    </div>
  );
}

const btnStyle = (loading) => ({
  width: '100%', padding: '0.75rem', background: loading ? 'var(--bg-card-2)' : 'var(--primary)',
  color: 'white', border: 'none', borderRadius: '0px', fontSize: '0.95rem',
  fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer', marginTop: '0.25rem',
  transition: 'background 0.15s', fontFamily: 'inherit',
});

export default Login;
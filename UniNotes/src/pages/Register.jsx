import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../services/api";
import { useToast } from "../context/ToastContext";

function Register() {
  const { showToast } = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [university, setUniversity] = useState("");
  const [semester, setSemester] = useState("");
  const [bio, setBio] = useState("");

  const [loading, setLoading] = useState(false);
  const [universityList, setUniversityList] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    API.get('/api/universities')
      .then(res => {
        const uniqueNames = [...new Set(res.data.map(u => u.name))];
        setUniversityList(uniqueNames);
      })
      .catch(err => console.error("Error fetching universities:", err));
  }, []);

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!name || !email || !password || !university) {
      showToast("Please fill in all required fields.", "warning");
      return;
    }
    if (password.length < 6) {
      showToast("Password must be at least 6 characters.", "warning");
      return;
    }
    setLoading(true);

    try {
      const res = await API.post('/api/auth/register', { name, email, password });

      // We also update user profile with extra details immediately.
      localStorage.setItem('token', res.data.token);

      try {
        await API.put('/api/profile/me', { university, semester, bio }, {
          headers: { 'x-auth-token': res.data.token } // Send token explicitly on first call
        });
      } catch (profileErr) {
        console.error("Profile update failed during registration", profileErr);
      }

      // Re-fetch updated user info if needed or just set as is
      localStorage.setItem('user', JSON.stringify({ ...res.data.user, university, semester, bio }));

      showToast(`Account created successfully! Welcome, ${name}!`, "success");
      navigate('/home');
    } catch (err) {
      showToast(err.response?.data?.message || 'Registration failed. Check details.', "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh', width: '100vw', display: 'flex', justifyContent: 'center', alignItems: 'center',
      backgroundColor: 'var(--bg)', position: 'fixed', top: 0, left: 0, zIndex: 1000, overflowY: 'auto', fontFamily: 'Inter, sans-serif',
      padding: '2rem 1rem'
    }}>
      {/* Subtle background gradient */}
      <div style={{
        position: 'absolute', top: '20%', right: '25%',
        width: '500px', height: '500px',
        background: 'radial-gradient(circle, rgba(193, 68, 14, 0.04) 0%, transparent 65%)',
        pointerEvents: 'none',
      }} />

      <Link to="/home" style={{ position: 'absolute', top: '2rem', left: '2rem', color: 'var(--text-muted)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem', zIndex: 10, fontWeight: 500, fontSize: '0.88rem', transition: 'color 0.15s' }} onMouseOver={(e) => e.currentTarget.style.color = 'var(--text)'} onMouseOut={(e) => e.currentTarget.style.color = 'var(--text-muted)'}>
        ← Back
      </Link>

      <div style={{
        width: '100%', maxWidth: '460px', background: 'var(--bg-card)',
        border: '1px solid var(--border)', borderRadius: '0px', padding: '2.25rem 2rem',
        zIndex: 1, color: 'var(--text)', display: 'flex', flexDirection: 'column',
        margin: '3rem 1rem', boxShadow: 'var(--shadow-lg)'
      }}>
        <div style={{ marginBottom: '1.5rem' }}>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700, margin: '0 0 0.35rem 0', color: 'var(--text)' }}>
            Create an account
          </h1>
          <p style={{ color: 'var(--text-muted)', margin: 0, fontSize: '0.88rem' }}>Join the community and share your notes.</p>
        </div>

        <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>

          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <div style={{ flex: 1 }}>
              <label className="form-label">Full Name *</label>
              <input type="text" placeholder="Your name" value={name} onChange={(e) => setName(e.target.value)} required className="form-input" />
            </div>
            <div style={{ flex: 1 }}>
              <label className="form-label">Semester</label>
              <select value={semester} onChange={(e) => setSemester(e.target.value)} className="form-select" style={{ color: semester ? 'var(--text)' : 'var(--text-muted)' }}>
                <option value="" disabled>Select</option>
                <option value="1">1st Semester</option>
                <option value="2">2nd Semester</option>
                <option value="3">3rd Semester</option>
                <option value="4">4th Semester</option>
                <option value="5">5th Semester</option>
                <option value="6">6th Semester</option>
                <option value="7">7th Semester</option>
                <option value="8">8th Semester</option>
              </select>
            </div>
          </div>

          <div>
            <label className="form-label">Email *</label>
            <input type="email" placeholder="you@university.edu" value={email} onChange={(e) => setEmail(e.target.value)} required className="form-input" />
          </div>

          <div>
            <label className="form-label">University *</label>
            <input list="uni-register-options" placeholder="e.g. Delhi University" value={university} onChange={(e) => setUniversity(e.target.value)} required className="form-input" />
            <datalist id="uni-register-options">
              {universityList.map((uni, idx) => (
                <option key={idx} value={uni} />
              ))}
            </datalist>
          </div>

          <div>
            <label className="form-label">Short Bio</label>
            <textarea placeholder="Computer Science student..." value={bio} onChange={(e) => setBio(e.target.value)} className="form-input" style={{ resize: 'vertical', minHeight: '56px' }} />
          </div>

          <div>
            <label className="form-label">Password *</label>
            <div style={{ position: 'relative' }}>
              <input type={showPassword ? "text" : "password"} placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required className="form-input" style={{ paddingRight: '3.5rem' }} />
              <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: 0, fontSize: '0.78rem', fontWeight: 500 }}>
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
          </div>

          <button type="submit" disabled={loading} style={{
            width: '100%', padding: '0.75rem', background: loading ? 'var(--bg-card-2)' : 'var(--primary)',
            color: 'white', border: 'none', borderRadius: '0px', fontSize: '0.9rem',
            fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer', marginTop: '0.25rem',
            transition: 'background 0.15s', fontFamily: 'inherit',
          }}>
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '1.25rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          Already have an account? <Link to="/login" style={{ color: 'var(--primary)', textDecoration: 'none', fontWeight: 600 }}>Sign in</Link>
        </p>
      </div>
    </div>
  );
}

export default Register;

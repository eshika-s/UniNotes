import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import API, { API_BASE_URL } from "../services/api";
import { useToast } from "../context/ToastContext";

const SEMESTERS = ["1", "2", "3", "4", "5", "6", "7", "8"];

function Profile() {
  const { showToast } = useToast();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [myNotes, setMyNotes] = useState([]);

  const [form, setForm] = useState({
    name: "", university: "", semester: "", bio: "", linkedin: ""
  });

  useEffect(() => {
    Promise.all([
      API.get('/api/profile/me'),
      API.get('/api/notes'),
    ]).then(([profileRes, notesRes]) => {
      const p = profileRes.data;
      setProfile(p);
      setForm({
        name: p.name || "",
        university: p.university || "",
        semester: p.semester || "",
        bio: p.bio || "",
        linkedin: p.linkedin || "",
      });
      setMyNotes(notesRes.data);
    }).catch(err => {
      console.error(err);
      showToast("Failed to load profile. Please try logging in again.", "error");
    }).finally(() => setLoading(false));
  }, []);

  const handleChange = e => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.name) {
      showToast("Full Name is a required field.", "warning");
      return;
    }
    setSaving(true);
    try {
      const res = await API.put('/api/profile/me', form);
      setProfile(res.data);
      // Update localStorage user too
      const stored = (() => { try { return JSON.parse(localStorage.getItem('user')) || {}; } catch { return {}; } })();
      localStorage.setItem('user', JSON.stringify({ ...stored, name: res.data.name, university: res.data.university }));
      showToast("Profile updated successfully!", "success");
    } catch (err) {
      showToast(err.response?.data?.message || "Failed to update profile.", "error");
    } finally {
      setSaving(false);
    }
  };

  const initials = profile?.name
    ? profile.name.split(' ').map(w => w[0]).join('').substring(0, 2).toUpperCase()
    : 'U';

  if (loading) return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text-muted)" }}>
      <p>Loading profile...</p>
    </div>
  );

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", paddingBottom: "4rem" }}>

      {/* Header */}
      <div style={{
        borderBottom: "1px solid var(--border)",
        padding: "2.5rem 2rem 2rem",
        textAlign: "center",
        position: "relative",
      }}>
        {/* Avatar */}
        <div style={{
          width: "72px", height: "72px", borderRadius: "16px", margin: "0 auto 0.75rem",
          background: "var(--primary)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: "1.5rem", fontWeight: 800, color: "white",
          position: "relative",
        }}>
          {initials}
        </div>

        <h1 style={{ fontSize: "1.5rem", fontWeight: 700, margin: "0 0 0.2rem", color: "var(--text)" }}>
          {profile?.name || "Your Profile"}
        </h1>
        <p style={{ color: "var(--text-muted)", margin: "0 0 0.4rem", fontSize: "0.85rem" }}>{profile?.email}</p>
        {profile?.university && (
          <span style={{ fontSize: "0.72rem", fontWeight: 600, color: "var(--primary)", background: "var(--primary-subtle)", border: "1px solid rgba(193, 68, 14, 0.2)", padding: "0.2rem 0.6rem", borderRadius: "6px" }}>
            {profile.university}
          </span>
        )}
      </div>

      <div className="container" style={{ paddingTop: "2rem" }}>
        <div className="profile-grid">

          {/* Edit form */}
          <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", padding: "2rem", borderRadius: "16px", position: "relative" }}>
            <h2 style={{ fontSize: "1.15rem", fontWeight: 700, color: "var(--text)", marginBottom: "1.5rem" }}>
              Edit Profile
            </h2>

            <form onSubmit={handleSave} style={{ display: "flex", flexDirection: "column", gap: "1.1rem" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
                <div>
                  <label className="form-label">Full Name *</label>
                  <input type="text" name="name" value={form.name} onChange={handleChange} placeholder="Your full name" className="form-input" />
                </div>
                <div>
                  <label className="form-label">Semester</label>
                  <select name="semester" value={form.semester} onChange={handleChange} className="form-select">
                    <option value="">Select...</option>
                    {SEMESTERS.map(s => <option key={s} value={s}>Semester {s}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label className="form-label">University / College</label>
                <input type="text" name="university" value={form.university} onChange={handleChange} placeholder="e.g. IIT Delhi" className="form-input" />
              </div>

              <div>
                <label className="form-label">LinkedIn URL</label>
                <input type="url" name="linkedin" value={form.linkedin} onChange={handleChange} placeholder="https://linkedin.com/in/your-profile" className="form-input" />
              </div>

              <div>
                <label className="form-label">Short Bio</label>
                <textarea
                  name="bio" value={form.bio} onChange={handleChange}
                  placeholder="Your interests, specialisations..."
                  rows={3}
                  className="form-input"
                  style={{ resize: "vertical", minHeight: "80px" }}
                />
              </div>

              <button type="submit" disabled={saving} style={{
                padding: "0.75rem", background: saving ? "var(--border)" : "var(--primary)",
                color: "white", border: "none", borderRadius: "10px",
                fontWeight: 600, fontSize: "0.9rem", cursor: saving ? "not-allowed" : "pointer",
                transition: "background 0.15s", fontFamily: 'inherit',
              }}>
                {saving ? "Saving..." : "Save Profile"}
              </button>
            </form>
          </div>

          {/* Sidebar */}
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>

            {/* Stats */}
            <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", padding: "1.25rem", borderRadius: "14px" }}>
              <h3 style={{ fontSize: "0.88rem", fontWeight: 600, color: "var(--text)", marginBottom: "1rem" }}>Activity</h3>
              {[
                { label: "Notes Uploaded", val: myNotes.length, color: "var(--primary)" },
                { label: "Member Since", val: profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' }) : "—", color: "var(--text)" },
              ].map((s, i) => (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0.5rem 0", borderBottom: i === 0 ? "1px solid var(--border)" : "none" }}>
                  <span style={{ color: "var(--text-muted)", fontSize: "0.82rem" }}>{s.label}</span>
                  <span style={{ color: s.color, fontWeight: 700, fontSize: "0.92rem" }}>{s.val}</span>
                </div>
              ))}
            </div>

            {/* Recent notes */}
            {myNotes.length > 0 && (
              <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", padding: "1.25rem", borderRadius: "14px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
                  <h3 style={{ fontSize: "0.88rem", fontWeight: 600, color: "var(--text)", margin: 0 }}>Recent Uploads</h3>
                  <Link to="/dashboard" style={{ fontSize: "0.72rem", color: "var(--primary)", textDecoration: "none", fontWeight: 600 }}>See all →</Link>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
                  {myNotes.slice(0, 4).map((n, i) => (
                    <div key={i} style={{ display: "flex", gap: "0.6rem", alignItems: "center" }}>
                      <div style={{ width: "6px", height: "6px", borderRadius: "2px", background: "var(--primary)", opacity: 0.5, flexShrink: 0 }} />
                      <div style={{ minWidth: 0 }}>
                        <div style={{ fontSize: "0.8rem", fontWeight: 600, color: "var(--text)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{n.title}</div>
                        <div style={{ fontSize: "0.68rem", color: "var(--text-muted)" }}>{n.university || "—"}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Quick links */}
            <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", padding: "1.25rem", borderRadius: "14px" }}>
              <h3 style={{ fontSize: "0.88rem", fontWeight: 600, color: "var(--text)", marginBottom: "0.75rem" }}>Quick Links</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.3rem" }}>
                {[
                  { label: "Upload a Note", to: "/upload" },
                  { label: "Browse Notes", to: "/notes" },
                  { label: "My Dashboard", to: "/dashboard" },
                ].map((l, i) => (
                  <Link key={i} to={l.to} style={{
                    color: "var(--text-muted)", textDecoration: "none", fontSize: "0.82rem", fontWeight: 500,
                    padding: "0.4rem 0.5rem", borderRadius: "6px", transition: "all 0.15s",
                    display: "block",
                  }}
                    onMouseEnter={e => { e.currentTarget.style.color = "var(--primary)"; e.currentTarget.style.background = "var(--primary-subtle)"; }}
                    onMouseLeave={e => { e.currentTarget.style.color = "var(--text-muted)"; e.currentTarget.style.background = "transparent"; }}>
                    {l.label} →
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;

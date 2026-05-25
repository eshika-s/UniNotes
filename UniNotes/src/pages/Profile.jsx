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
      showToast("Profile details updated successfully!", "success");
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
    <div style={{ minHeight: "100vh", background: "#000", display: "flex", alignItems: "center", justifyContent: "center", color: "#64748b" }}>
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: "3rem", marginBottom: "1rem", animation: "pulse 1.5s infinite" }}>👤</div>
        <p>Loading profile...</p>
      </div>
    </div>
  );

  return (
    <div style={{ minHeight: "100vh", background: "#000", paddingBottom: "4rem" }}>

      {/* Header */}
      <div style={{
        background: "linear-gradient(135deg, rgba(233,94,134,0.1) 0%, rgba(99,102,241,0.1) 100%)",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
        padding: "3rem 2rem 2.5rem",
        textAlign: "center",
        position: "relative",
        overflow: "hidden",
      }}>
        {/* Ambient blob */}
        <div style={{ position: "absolute", top: "-60px", left: "50%", transform: "translateX(-50%)", width: "400px", height: "300px", background: "radial-gradient(circle, rgba(233,94,134,0.1) 0%, transparent 70%)", pointerEvents: "none" }} />

        {/* Avatar */}
        <div style={{
          width: "90px", height: "90px", borderRadius: "50%", margin: "0 auto 1rem",
          background: "linear-gradient(135deg, #e95e86, #6366f1)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: "2rem", fontWeight: 800, color: "white",
          boxShadow: "0 0 0 4px rgba(233,94,134,0.3), 0 0 30px rgba(233,94,134,0.2)",
          position: "relative",
        }}>
          {initials}
        </div>

        <h1 style={{ fontSize: "1.8rem", fontWeight: 800, margin: "0 0 0.3rem", color: "#f1f5f9" }}>
          {profile?.name || "Your Profile"}
        </h1>
        <p style={{ color: "#64748b", margin: "0 0 0.5rem", fontSize: "0.9rem" }}>{profile?.email}</p>
        {profile?.university && (
          <span className="badge badge-primary">🏛️ {profile.university}</span>
        )}
      </div>

      <div className="container" style={{ paddingTop: "2.5rem" }}>
        <div className="profile-grid">

          {/* Edit form */}
          <div className="glass-panel" style={{ padding: "2.5rem", borderRadius: "20px", position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "3px", background: "linear-gradient(90deg, #e95e86, #6366f1)", borderRadius: "20px 20px 0 0" }} />

            <h2 style={{ fontSize: "1.3rem", fontWeight: 800, color: "#f1f5f9", marginBottom: "1.75rem" }}>
              Edit <span style={{ color: "#e95e86" }}>Profile</span>
            </h2>

            <form onSubmit={handleSave} style={{ display: "flex", flexDirection: "column", gap: "1.3rem" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <Field label="Full Name *" name="name" value={form.name} onChange={handleChange} placeholder="Your full name" />
                <div>
                  <label style={labelStyle}>Semester</label>
                  <select name="semester" value={form.semester} onChange={handleChange} style={inputStyle}>
                    <option value="">Select...</option>
                    {SEMESTERS.map(s => <option key={s} value={s}>Semester {s}</option>)}
                  </select>
                </div>
              </div>

              <Field label="University / College" name="university" value={form.university} onChange={handleChange} placeholder="e.g. IIT Delhi" />

              <Field label="LinkedIn URL" name="linkedin" value={form.linkedin} onChange={handleChange} placeholder="https://linkedin.com/in/your-profile" type="url" />

              <div>
                <label style={labelStyle}>Short Bio</label>
                <textarea
                  name="bio" value={form.bio} onChange={handleChange}
                  placeholder="Tell the community about yourself — your interests, specialisations..."
                  rows={4}
                  style={{ ...inputStyle, resize: "vertical", minHeight: "100px" }}
                  onFocus={e => e.target.style.borderColor = "#e95e86"}
                  onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.1)"}
                />
              </div>

              <button type="submit" disabled={saving} style={{
                padding: "0.9rem", background: saving ? "#334155" : "#e95e86",
                color: "white", border: "none", borderRadius: "12px",
                fontWeight: 700, fontSize: "1rem", cursor: saving ? "not-allowed" : "pointer",
                boxShadow: saving ? "none" : "0 4px 20px rgba(233,94,134,0.4)",
                transition: "all 0.2s",
              }}>
                {saving ? "Saving..." : "Save Profile"}
              </button>
            </form>
          </div>

          {/* Sidebar */}
          <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>

            {/* Stats card */}
            <div className="glass-panel" style={{ padding: "1.75rem", borderRadius: "18px" }}>
              <h3 style={{ fontSize: "1rem", fontWeight: 700, color: "#f1f5f9", marginBottom: "1.25rem" }}>Your Activity</h3>
              {[
                { label: "Notes Uploaded", val: myNotes.length, color: "#e95e86" },
                { label: "Member Since", val: profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' }) : "—", color: "#6366f1" },
              ].map((s, i) => (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0.7rem 0", borderBottom: i === 0 ? "1px solid rgba(255,255,255,0.06)" : "none" }}>
                  <span style={{ color: "#64748b", fontSize: "0.87rem" }}>{s.label}</span>
                  <span style={{ color: s.color, fontWeight: 700, fontSize: "1rem" }}>{s.val}</span>
                </div>
              ))}
            </div>

            {/* Recent notes */}
            {myNotes.length > 0 && (
              <div className="glass-panel" style={{ padding: "1.75rem", borderRadius: "18px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem" }}>
                  <h3 style={{ fontSize: "1rem", fontWeight: 700, color: "#f1f5f9", margin: 0 }}>Recent Uploads</h3>
                  <Link to="/dashboard" style={{ fontSize: "0.78rem", color: "#e95e86", textDecoration: "none", fontWeight: 600 }}>See all →</Link>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                  {myNotes.slice(0, 4).map((n, i) => (
                    <div key={i} style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
                      <div style={{ width: "34px", height: "34px", borderRadius: "8px", background: "rgba(233,94,134,0.12)", border: "1px solid rgba(233,94,134,0.25)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, color: "#e95e86", fontSize: "0.9rem" }}>
                        📄
                      </div>
                      <div style={{ minWidth: 0 }}>
                        <div style={{ fontSize: "0.83rem", fontWeight: 600, color: "#e2e8f0", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{n.title}</div>
                        <div style={{ fontSize: "0.72rem", color: "#475569" }}>{n.university || "—"}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Quick links */}
            <div className="glass-panel" style={{ padding: "1.5rem", borderRadius: "18px" }}>
              <h3 style={{ fontSize: "1rem", fontWeight: 700, color: "#f1f5f9", marginBottom: "1rem" }}>Quick Links</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
                {[
                  { label: "📤 Upload a Note", to: "/upload" },
                  { label: "📚 Browse Notes", to: "/notes" },
                  { label: "📊 My Dashboard", to: "/dashboard" },
                ].map((l, i) => (
                  <Link key={i} to={l.to} style={{
                    color: "#94a3b8", textDecoration: "none", fontSize: "0.87rem", fontWeight: 500,
                    padding: "0.5rem 0.75rem", borderRadius: "8px", transition: "all 0.2s",
                    display: "block",
                  }}
                    onMouseEnter={e => { e.currentTarget.style.color = "#e95e86"; e.currentTarget.style.background = "rgba(233,94,134,0.08)"; }}
                    onMouseLeave={e => { e.currentTarget.style.color = "#94a3b8"; e.currentTarget.style.background = "transparent"; }}>
                    {l.label}
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

function Field({ label, name, value, onChange, placeholder, type = "text" }) {
  return (
    <div>
      <label style={labelStyle}>{label}</label>
      <input
        type={type} name={name} value={value} onChange={onChange} placeholder={placeholder}
        style={inputStyle}
        onFocus={e => e.target.style.borderColor = "#e95e86"}
        onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.1)"}
      />
    </div>
  );
}

const labelStyle = { display: "block", marginBottom: "0.45rem", color: "#94a3b8", fontSize: "0.83rem", fontWeight: 500 };
const inputStyle = {
  width: "100%", padding: "0.8rem 1rem", borderRadius: "10px",
  background: "rgba(0,0,0,0.5)", border: "1px solid rgba(255,255,255,0.1)",
  color: "white", outline: "none", fontSize: "0.9rem", fontFamily: "inherit",
  transition: "border-color 0.2s", boxSizing: "border-box",
};

export default Profile;

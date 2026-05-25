import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import API, { API_BASE_URL } from "../services/api";
import { useToast } from "../context/ToastContext";

function Dashboard() {
  const { showToast } = useToast();
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortOrder, setSortOrder] = useState("newest");
  const [filterSubject, setFilterSubject] = useState("");
  const [stats, setStats] = useState({ totalNotes: 0, totalUniversities: 0, totalUsers: 0 });

  // Edit modal state
  const [editNote, setEditNote] = useState(null);
  const [editForm, setEditForm] = useState({ title: "", subject: "", university: "", description: "" });
  const [editLoading, setEditLoading] = useState(false);

  // Current user
  const user = (() => { try { return JSON.parse(localStorage.getItem('user')) || {}; } catch { return {}; } })();

  useEffect(() => {
    fetchNotes();
    API.get('/api/stats').then(r => setStats(r.data)).catch(() => {});
  }, []);

  const fetchNotes = async () => {
    try {
      setLoading(true);
      const res = await API.get('/api/notes');
      setNotes(res.data);
    } catch (err) {
      console.error('Error fetching notes:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this note? This cannot be undone.")) return;
    try {
      await API.delete(`/api/notes/${id}`);
      setNotes(prev => prev.filter(n => n._id !== id));
      showToast("Note deleted successfully.", "success");
    } catch (err) {
      showToast('Failed to delete note. Please try again.', "error");
    }
  };

  const openEdit = (note) => {
    setEditNote(note);
    setEditForm({
      title: note.title || "",
      subject: note.subject || "",
      university: note.university || "",
      description: note.description || note.content || "",
    });
  };

  const closeEdit = () => { setEditNote(null); };

  const handleEditSave = async () => {
    if (!editForm.title.trim()) {
      showToast("Title is required.", "warning");
      return;
    }
    setEditLoading(true);
    try {
      const res = await API.put(`/api/notes/${editNote._id}`, {
        title: editForm.title,
        subject: editForm.subject,
        university: editForm.university,
        description: editForm.description,
        content: editForm.description,
      });
      setNotes(prev => prev.map(n => n._id === editNote._id ? { ...n, ...res.data } : n));
      showToast("Note updated successfully!", "success");
      closeEdit();
    } catch (err) {
      showToast(err.response?.data?.message || "Failed to update note.", "error");
    } finally {
      setEditLoading(false);
    }
  };

  const filteredNotes = notes
    .filter(n => !filterSubject || (n.subject || "").toLowerCase().includes(filterSubject.toLowerCase()))
    .sort((a, b) => sortOrder === "newest"
      ? new Date(b.date) - new Date(a.date)
      : new Date(a.date) - new Date(b.date)
    );

  const initials = user.name
    ? user.name.split(' ').map(w => w[0]).join('').substring(0, 2).toUpperCase()
    : 'U';

  return (
    <div style={{ minHeight: "100vh", background: "#000", paddingBottom: "4rem" }}>

      {/* Page header */}
      <div style={{
        background: "linear-gradient(135deg, rgba(99,102,241,0.1) 0%, rgba(233,94,134,0.1) 100%)",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
        padding: "3rem 2rem 2.5rem",
      }}>
        <div className="container" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1.5rem" }}>
          <div>
            <div className="badge badge-primary" style={{ marginBottom: "0.75rem" }}>📊 Dashboard</div>
            <h1 style={{ fontSize: "2rem", fontWeight: 800, margin: 0, color: "#f1f5f9" }}>
              My <span style={{ color: "#e95e86" }}>Notes</span>
            </h1>
            <p style={{ color: "#64748b", margin: "0.4rem 0 0", fontSize: "0.9rem" }}>
              Manage, edit, and track your uploaded notes
            </p>
          </div>
          {/* Profile mini-card */}
          <div style={{
            display: "flex", alignItems: "center", gap: "1rem",
            background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: "16px", padding: "1rem 1.5rem",
          }}>
            <div style={{
              width: "48px", height: "48px", borderRadius: "50%", flexShrink: 0,
              background: "linear-gradient(135deg, #e95e86, #6366f1)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontWeight: 800, fontSize: "1rem", color: "white",
            }}>{initials}</div>
            <div>
              <div style={{ fontWeight: 700, fontSize: "0.95rem", color: "#f1f5f9" }}>{user.name || "User"}</div>
              <div style={{ fontSize: "0.78rem", color: "#64748b" }}>{user.email || ""}</div>
            </div>
            <Link to="/profile" style={{
              padding: "0.45rem 1rem", borderRadius: "999px", fontSize: "0.8rem", fontWeight: 600,
              background: "rgba(233,94,134,0.12)", border: "1px solid rgba(233,94,134,0.3)",
              color: "#e95e86", textDecoration: "none", whiteSpace: "nowrap",
            }}>
              Edit Profile
            </Link>
          </div>
        </div>
      </div>

      <div className="container" style={{ paddingTop: "2rem" }}>

        {/* Stats bar */}
        <div style={{
          display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
          gap: "1rem", marginBottom: "2rem",
        }}>
          {[
            { label: "My Uploads", value: notes.length, color: "#e95e86", icon: "📄" },
            { label: "Total Notes (Platform)", value: stats.totalNotes, color: "#6366f1", icon: "📚" },
            { label: "Institutions", value: stats.totalUniversities, color: "#10b981", icon: "🏛️" },
            { label: "Students", value: stats.totalUsers, color: "#f59e0b", icon: "👥" },
          ].map((s, i) => (
            <div key={i} style={{
              background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)",
              borderRadius: "14px", padding: "1.2rem 1.4rem",
              borderLeft: `3px solid ${s.color}`,
            }}>
              <div style={{ fontSize: "1.4rem", marginBottom: "0.4rem" }}>{s.icon}</div>
              <div style={{ fontSize: "1.6rem", fontWeight: 800, color: "#f1f5f9" }}>{s.value}</div>
              <div style={{ fontSize: "0.75rem", color: "#64748b", fontWeight: 500 }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Controls row */}
        <div className="glass-panel" style={{ padding: "1.2rem 1.5rem", borderRadius: "14px", marginBottom: "2rem", display: "flex", gap: "1rem", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", flex: 1 }}>
            <div style={{ flex: "1 1 180px" }}>
              <label style={{ display: "block", marginBottom: "0.4rem", color: "#94a3b8", fontSize: "0.8rem", fontWeight: 500 }}>Filter by Subject</label>
              <select value={filterSubject} onChange={(e) => setFilterSubject(e.target.value)}
                style={{ width: "100%", padding: "0.65rem 0.9rem", borderRadius: "10px", background: "rgba(0,0,0,0.5)", border: "1px solid rgba(255,255,255,0.1)", color: "white", outline: "none", fontSize: "0.9rem" }}>
                <option value="">All Subjects</option>
                {["Computer Science (CSE)", "Information Tech (IT)", "Mechanical Engg. (ME)", "Electronics (ECE)", "Civil Engg. (CE)", "Electrical (EE)", "Common"]
                  .map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div style={{ flex: "1 1 180px" }}>
              <label style={{ display: "block", marginBottom: "0.4rem", color: "#94a3b8", fontSize: "0.8rem", fontWeight: 500 }}>Sort By</label>
              <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}
                style={{ width: "100%", padding: "0.65rem 0.9rem", borderRadius: "10px", background: "rgba(0,0,0,0.5)", border: "1px solid rgba(255,255,255,0.1)", color: "white", outline: "none", fontSize: "0.9rem" }}>
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
              </select>
            </div>
          </div>
          <Link to="/upload" style={{
            display: "inline-flex", alignItems: "center", gap: "0.5rem",
            padding: "0.7rem 1.5rem", background: "#e95e86",
            color: "white", borderRadius: "10px", textDecoration: "none",
            fontWeight: 700, fontSize: "0.9rem",
            boxShadow: "0 4px 14px rgba(233,94,134,0.35)",
            transition: "all 0.2s",
          }}
            onMouseEnter={e => e.currentTarget.style.transform = "translateY(-2px)"}
            onMouseLeave={e => e.currentTarget.style.transform = "none"}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            Upload New
          </Link>
        </div>

        {/* Table */}
        {loading ? (
          <div style={{ textAlign: "center", padding: "4rem", color: "#64748b" }}>
            <div style={{ fontSize: "2.5rem", marginBottom: "1rem", animation: "pulse 1.5s infinite" }}>📚</div>
            <p>Loading your notes...</p>
          </div>
        ) : filteredNotes.length === 0 ? (
          <div style={{ textAlign: "center", padding: "5rem 2rem", background: "rgba(255,255,255,0.02)", borderRadius: "20px", border: "1px solid rgba(255,255,255,0.06)" }}>
            <div style={{ fontSize: "3.5rem", marginBottom: "1rem" }}>📝</div>
            <h3 style={{ color: "#f1f5f9", marginBottom: "0.5rem" }}>No notes yet</h3>
            <p style={{ color: "#64748b", marginBottom: "2rem" }}>Share your knowledge by uploading your first note!</p>
            <Link to="/upload" className="btn btn-primary">Upload Your First Note</Link>
          </div>
        ) : (
          <div style={{ overflowX: "auto", borderRadius: "16px", border: "1px solid rgba(255,255,255,0.07)" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", minWidth: "600px" }}>
              <thead>
                <tr style={{ background: "rgba(255,255,255,0.03)", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
                  {["Title", "Subject", "University", "Date", "Actions"].map((h, i) => (
                    <th key={i} style={{ padding: "1rem 1.2rem", color: "#64748b", fontSize: "0.78rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.07em", textAlign: i === 4 ? "right" : "left" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredNotes.map((note, idx) => (
                  <tr key={note._id} style={{ borderBottom: idx !== filteredNotes.length - 1 ? "1px solid rgba(255,255,255,0.05)" : "none", transition: "background 0.2s" }}
                    onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.02)"}
                    onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                    <td style={{ padding: "1rem 1.2rem", maxWidth: "220px" }}>
                      {note.fileUrl ? (
                        <a href={`${API_BASE_URL}${note.fileUrl}`} target="_blank" rel="noopener noreferrer"
                          style={{ color: "#e95e86", textDecoration: "none", fontWeight: 600, fontSize: "0.9rem", display: "flex", alignItems: "center", gap: "0.4rem" }}>
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                          <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{note.title}</span>
                        </a>
                      ) : (
                        <span style={{ color: "#f1f5f9", fontWeight: 600, fontSize: "0.9rem" }}>{note.title}</span>
                      )}
                    </td>
                    <td style={{ padding: "1rem 1.2rem", color: "#94a3b8", fontSize: "0.85rem", maxWidth: "160px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{note.subject || "—"}</td>
                    <td style={{ padding: "1rem 1.2rem", color: "#94a3b8", fontSize: "0.85rem" }}>{note.university || "—"}</td>
                    <td style={{ padding: "1rem 1.2rem", color: "#475569", fontSize: "0.82rem", whiteSpace: "nowrap" }}>
                      {new Date(note.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </td>
                    <td style={{ padding: "1rem 1.2rem", textAlign: "right" }}>
                      <div style={{ display: "flex", gap: "0.5rem", justifyContent: "flex-end" }}>
                        <button onClick={() => openEdit(note)} style={{
                          background: "rgba(99,102,241,0.15)", color: "#818cf8",
                          border: "1px solid rgba(99,102,241,0.3)", padding: "0.4rem 0.9rem",
                          borderRadius: "8px", cursor: "pointer", fontSize: "0.8rem", fontWeight: 600,
                          transition: "all 0.2s",
                        }}
                          onMouseEnter={e => e.currentTarget.style.background = "rgba(99,102,241,0.3)"}
                          onMouseLeave={e => e.currentTarget.style.background = "rgba(99,102,241,0.15)"}>
                          ✏️ Edit
                        </button>
                        <button onClick={() => handleDelete(note._id)} style={{
                          background: "rgba(239,68,68,0.12)", color: "#f87171",
                          border: "1px solid rgba(239,68,68,0.25)", padding: "0.4rem 0.9rem",
                          borderRadius: "8px", cursor: "pointer", fontSize: "0.8rem", fontWeight: 600,
                          transition: "all 0.2s",
                        }}
                          onMouseEnter={e => e.currentTarget.style.background = "rgba(239,68,68,0.25)"}
                          onMouseLeave={e => e.currentTarget.style.background = "rgba(239,68,68,0.12)"}>
                          🗑️ Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ── Edit Modal ── */}
      {editNote && (
        <div style={{
          position: "fixed", inset: 0, zIndex: 9999,
          background: "rgba(0,0,0,0.8)", backdropFilter: "blur(8px)",
          display: "flex", alignItems: "center", justifyContent: "center", padding: "1.5rem",
        }} onClick={closeEdit}>
          <div className="glass-panel fade-in" style={{
            width: "100%", maxWidth: "520px", borderRadius: "20px", padding: "2.5rem",
            position: "relative",
          }} onClick={e => e.stopPropagation()}>
            {/* top accent */}
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "3px", background: "linear-gradient(90deg, #e95e86, #6366f1)", borderRadius: "20px 20px 0 0" }} />
            <h3 style={{ fontSize: "1.4rem", fontWeight: 800, color: "#f1f5f9", marginBottom: "1.75rem" }}>
              Edit <span style={{ color: "#e95e86" }}>Note</span>
            </h3>

            <div style={{ display: "flex", flexDirection: "column", gap: "1.2rem" }}>
              {[
                { label: "Title *", key: "title", placeholder: "Note title" },
                { label: "Subject", key: "subject", placeholder: "e.g. Computer Science (CSE)" },
                { label: "University", key: "university", placeholder: "e.g. IIT Delhi" },
              ].map(f => (
                <div key={f.key}>
                  <label style={{ display: "block", marginBottom: "0.45rem", color: "#94a3b8", fontSize: "0.83rem", fontWeight: 500 }}>{f.label}</label>
                  <input
                    value={editForm[f.key]}
                    onChange={e => setEditForm(p => ({ ...p, [f.key]: e.target.value }))}
                    placeholder={f.placeholder}
                    style={{ width: "100%", padding: "0.8rem 1rem", borderRadius: "10px", background: "rgba(0,0,0,0.5)", border: "1px solid rgba(255,255,255,0.1)", color: "white", outline: "none", fontSize: "0.9rem", fontFamily: "inherit" }}
                    onFocus={e => e.target.style.borderColor = "#e95e86"}
                    onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.1)"}
                  />
                </div>
              ))}
              <div>
                <label style={{ display: "block", marginBottom: "0.45rem", color: "#94a3b8", fontSize: "0.83rem", fontWeight: 500 }}>Description</label>
                <textarea
                  value={editForm.description}
                  onChange={e => setEditForm(p => ({ ...p, description: e.target.value }))}
                  placeholder="What topics does this note cover?"
                  rows={3}
                  style={{ width: "100%", padding: "0.8rem 1rem", borderRadius: "10px", background: "rgba(0,0,0,0.5)", border: "1px solid rgba(255,255,255,0.1)", color: "white", outline: "none", fontSize: "0.9rem", resize: "vertical", fontFamily: "inherit" }}
                  onFocus={e => e.target.style.borderColor = "#e95e86"}
                  onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.1)"}
                />
              </div>
            </div>

            <div style={{ display: "flex", gap: "0.8rem", marginTop: "1.75rem" }}>
              <button onClick={closeEdit} style={{ flex: 1, padding: "0.8rem", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: "#94a3b8", borderRadius: "10px", cursor: "pointer", fontWeight: 600, fontSize: "0.9rem" }}>
                Cancel
              </button>
              <button onClick={handleEditSave} disabled={editLoading} style={{
                flex: 2, padding: "0.8rem", background: editLoading ? "#334155" : "#e95e86",
                border: "none", color: "white", borderRadius: "10px",
                cursor: editLoading ? "not-allowed" : "pointer", fontWeight: 700, fontSize: "0.9rem",
                boxShadow: editLoading ? "none" : "0 4px 14px rgba(233,94,134,0.4)",
              }}>
                {editLoading ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;

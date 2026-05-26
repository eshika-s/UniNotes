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
    <div style={{ minHeight: "100vh", background: "var(--bg)", paddingBottom: "4rem" }}>

      {/* Page header */}
      <div style={{
        borderBottom: "1px solid var(--border)",
        padding: "2.5rem 2rem 2rem",
      }}>
        <div className="container" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1.25rem" }}>
          <div>
            <h1 style={{ fontSize: "1.75rem", fontWeight: 800, margin: 0, color: "var(--text)" }}>
              Dashboard
            </h1>
            <p style={{ color: "var(--text-muted)", margin: "0.3rem 0 0", fontSize: "0.88rem" }}>
              Manage and track your uploaded notes
            </p>
          </div>
          <div style={{
            display: "flex", alignItems: "center", gap: "0.75rem",
            background: "var(--bg-card)", border: "1px solid var(--border)",
            borderRadius: "0px", padding: "0.75rem 1rem",
          }}>
            <div style={{
              width: "36px", height: "36px", borderRadius: "0px", flexShrink: 0,
              background: "var(--primary)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontWeight: 700, fontSize: "0.82rem", color: "white",
            }}>{initials}</div>
            <div>
              <div style={{ fontWeight: 600, fontSize: "0.88rem", color: "var(--text)" }}>{user.name || "User"}</div>
              <div style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>{user.email || ""}</div>
            </div>
            <Link to="/profile" style={{
              padding: "0.35rem 0.75rem", borderRadius: "0px", fontSize: "0.75rem", fontWeight: 600,
              background: "var(--primary-subtle)", border: "1px solid rgba(193, 68, 14, 0.15)",
              color: "var(--primary)", textDecoration: "none", whiteSpace: "nowrap",
            }}>
              Edit
            </Link>
          </div>
        </div>
      </div>

      <div className="container" style={{ paddingTop: "1.5rem" }}>

        {/* Stats */}
        <div style={{
          display: "flex", justifyContent: "space-between", alignItems: "center",
          gap: "1.5rem", flexWrap: "wrap", marginBottom: "2.5rem",
          background: "var(--bg-card)", border: "1px solid var(--border)",
          borderRadius: "0px", padding: "2rem", boxShadow: "var(--shadow-sm)"
        }}>
          {[
            { label: "My uploads", value: notes.length, color: "var(--primary)" },
            { label: "Platform notes", value: stats.totalNotes, color: "#2563eb" },
            { label: "Institutions", value: stats.totalUniversities, color: "#16a34a" },
            { label: "Students", value: stats.totalUsers, color: "#d97706" },
          ].map((s, i) => (
            <div key={i} style={{ flex: 1, minWidth: "120px", display: "flex", flexDirection: "column", gap: "0.2rem" }}>
              <div style={{ fontSize: "2rem", fontWeight: 800, color: "var(--text)", lineHeight: 1.1 }}>{s.value}</div>
              <div style={{ fontSize: "0.85rem", color: "var(--text-muted)", fontWeight: 500, marginBottom: "0.5rem" }}>{s.label}</div>
              <div style={{ width: "32px", height: "4px", background: s.color, borderRadius: "0px" }} />
            </div>
          ))}
        </div>

        {/* Controls */}
        <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", alignItems: "end", justifyContent: "space-between", marginBottom: "1.5rem" }}>
          <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", flex: 1 }}>
            <div style={{ flex: "1 1 160px" }}>
              <label className="form-label">Subject</label>
              <select value={filterSubject} onChange={(e) => setFilterSubject(e.target.value)} className="form-select">
                <option value="">All</option>
                {["Computer Science (CSE)", "Information Tech (IT)", "Mechanical Engg. (ME)", "Electronics (ECE)", "Civil Engg. (CE)", "Electrical (EE)", "Common"]
                  .map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div style={{ flex: "1 1 160px" }}>
              <label className="form-label">Sort</label>
              <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)} className="form-select">
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
              </select>
            </div>
          </div>
          <Link to="/upload" style={{
            display: "inline-flex", alignItems: "center", gap: "0.4rem",
            padding: "0.6rem 1.2rem", background: "var(--primary)",
            color: "white", borderRadius: "0px", textDecoration: "none",
            fontWeight: 600, fontSize: "0.85rem",
          }}>
            + Upload
          </Link>
        </div>

        {/* Table */}
        {loading ? (
          <div style={{ textAlign: "center", padding: "3.5rem", color: "var(--text-muted)" }}>
            <p>Loading your notes...</p>
          </div>
        ) : filteredNotes.length === 0 ? (
          <div style={{ textAlign: "center", padding: "4rem 2rem", background: "var(--bg-card)", borderRadius: "0px", border: "1px solid var(--border)" }}>
            <h3 style={{ color: "var(--text)", marginBottom: "0.4rem", fontSize: "1.1rem" }}>No notes yet</h3>
            <p style={{ color: "var(--text-muted)", marginBottom: "1.5rem", fontSize: "0.88rem" }}>Share your knowledge by uploading your first note!</p>
            <Link to="/upload" className="btn btn-primary" style={{ borderRadius: "0px" }}>Upload Your First Note</Link>
          </div>
        ) : (
          <div style={{ background: "var(--bg-card)", borderRadius: "0px", border: "1px solid var(--border)", overflow: "hidden" }}>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", minWidth: "580px" }}>
                <thead>
                  <tr style={{ background: "rgba(28, 20, 16, 0.02)", borderBottom: "1px solid var(--border)" }}>
                    {["Title", "Subject", "University", "Status", "Actions"].map((h, i) => (
                      <th key={i} style={{ padding: "0.85rem 1rem", color: "var(--text-muted)", fontSize: "0.72rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", textAlign: i === 4 ? "right" : "left" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredNotes.map((note, idx) => (
                    <tr key={note._id} style={{ borderBottom: idx !== filteredNotes.length - 1 ? "1px solid var(--border)" : "none", transition: "background 0.15s" }}
                      onMouseEnter={e => e.currentTarget.style.background = "rgba(28, 20, 16, 0.015)"}
                      onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                      <td style={{ padding: "0.85rem 1rem", maxWidth: "200px" }}>
                        {note.fileUrl ? (
                          <a href={`${API_BASE_URL}${note.fileUrl}`} target="_blank" rel="noopener noreferrer"
                            style={{ color: "var(--primary)", textDecoration: "none", fontWeight: 600, fontSize: "0.85rem" }}>
                            <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", display: "block" }}>{note.title}</span>
                          </a>
                        ) : (
                          <span style={{ color: "var(--text)", fontWeight: 600, fontSize: "0.85rem" }}>{note.title}</span>
                        )}
                      </td>
                      <td style={{ padding: "0.85rem 1rem" }}>
                        <span style={{
                          background: "rgba(28, 20, 16, 0.04)",
                          border: "1px solid var(--border)",
                          color: "var(--text)",
                          padding: "3px 8px",
                          borderRadius: "0px",
                          fontSize: "0.72rem",
                          fontWeight: 700
                        }}>
                          {note.subject ? note.subject.split(' ')[0] : "CSE"}
                        </span>
                      </td>
                      <td style={{ padding: "0.85rem 1rem", color: "var(--text-muted)", fontSize: "0.82rem" }}>{note.university || "—"}</td>
                      <td style={{ padding: "0.85rem 1rem" }}>
                        <span style={{
                          background: "rgba(16, 185, 129, 0.08)",
                          border: "1px solid rgba(16, 185, 129, 0.15)",
                          color: "#10b981",
                          padding: "3px 8px",
                          borderRadius: "0px",
                          fontSize: "0.72rem",
                          fontWeight: 700
                        }}>
                          Live
                        </span>
                      </td>
                      <td style={{ padding: "0.85rem 1rem", textAlign: "right" }}>
                        <div style={{ display: "flex", gap: "0.35rem", justifyContent: "flex-end" }}>
                          <button onClick={() => openEdit(note)} style={{
                            background: "var(--primary-subtle)", color: "var(--primary)",
                            border: "1px solid rgba(193, 68, 14, 0.15)", padding: "0.35rem 0.75rem",
                            borderRadius: "0px", cursor: "pointer", fontSize: "0.78rem", fontWeight: 600,
                            transition: "background 0.15s", fontFamily: 'inherit',
                          }}
                            onMouseEnter={e => e.currentTarget.style.background = "rgba(193, 68, 14, 0.12)"}
                            onMouseLeave={e => e.currentTarget.style.background = "var(--primary-subtle)"}>
                            Edit
                          </button>
                          <button onClick={() => handleDelete(note._id)} style={{
                            background: "rgba(239,68,68,0.06)", color: "#ef4444",
                            border: "1px solid rgba(239,68,68,0.15)", padding: "0.35rem 0.75rem",
                            borderRadius: "0px", cursor: "pointer", fontSize: "0.78rem", fontWeight: 600,
                            transition: "background 0.15s", fontFamily: 'inherit',
                          }}
                            onMouseEnter={e => e.currentTarget.style.background = "rgba(239,68,68,0.12)"}
                            onMouseLeave={e => e.currentTarget.style.background = "rgba(239,68,68,0.06)"}>
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Bottom Row inside card */}
            <div style={{ textAlign: "center", padding: "1.25rem", borderTop: "1px solid var(--border)" }}>
              <Link to="/upload" style={{ color: "var(--primary)", fontSize: "0.85rem", fontWeight: 600, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "0.25rem" }}
                onMouseEnter={e => e.currentTarget.style.textDecoration = "underline"}
                onMouseLeave={e => e.currentTarget.style.textDecoration = "none"}>
                You've uploaded {notes.length} {notes.length === 1 ? 'note' : 'notes'}. Upload more to help others →
              </Link>
            </div>
          </div>
        )}

        {/* Bottom Widgets Row */}
        <div style={{
          display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1.5rem",
          marginTop: "2rem"
        }}>
          {/* Quick Links Card */}
          <div style={{
            background: "var(--bg-card)", border: "1px solid var(--border)",
            borderRadius: "0px", padding: "2rem", boxShadow: "var(--shadow-sm)",
            display: "flex", flexDirection: "column", gap: "1.25rem"
          }}>
            <h3 style={{ fontSize: "1.1rem", fontWeight: 700, color: "var(--text)", margin: 0 }}>Quick links</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>
              <Link to="/upload" style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", color: "var(--primary)", textDecoration: "none", fontWeight: 600, fontSize: "0.9rem" }}
                onMouseEnter={e => e.currentTarget.style.opacity = 0.8}
                onMouseLeave={e => e.currentTarget.style.opacity = 1}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
                Upload a note
              </Link>
              <Link to="/notes" style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", color: "var(--primary)", textDecoration: "none", fontWeight: 600, fontSize: "0.9rem" }}
                onMouseEnter={e => e.currentTarget.style.opacity = 0.8}
                onMouseLeave={e => e.currentTarget.style.opacity = 1}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                Browse notes
              </Link>
              <Link to="/profile" style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", color: "var(--primary)", textDecoration: "none", fontWeight: 600, fontSize: "0.9rem" }}
                onMouseEnter={e => e.currentTarget.style.opacity = 0.8}
                onMouseLeave={e => e.currentTarget.style.opacity = 1}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                Edit profile
              </Link>
            </div>
          </div>

          {/* Contributor Progress Card */}
          <div style={{
            background: "var(--bg-card)", border: "1px solid var(--border)",
            borderRadius: "0px", padding: "2rem", boxShadow: "var(--shadow-sm)",
            display: "flex", flexDirection: "column", gap: "1.25rem"
          }}>
            <h3 style={{ fontSize: "1.1rem", fontWeight: 700, color: "var(--text)", margin: 0 }}>Contributor progress</h3>
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.88rem", fontWeight: 600, color: "var(--text)", marginBottom: "0.5rem" }}>
                <span>{notes.length} of 5 notes to reach <span style={{ color: "var(--primary)" }}>Contributor</span> rank</span>
              </div>
              {/* Progress bar container */}
              <div style={{ width: "100%", height: "8px", background: "var(--bg-card-2)", borderRadius: "999px", overflow: "hidden", marginBottom: "0.75rem" }}>
                <div style={{ width: `${Math.min((notes.length / 5) * 100, 100)}%`, height: "100%", background: "var(--primary)", borderRadius: "999px" }} />
              </div>
              <p style={{ margin: 0, fontSize: "0.82rem", color: "var(--text-muted)", fontWeight: 500 }}>
                Upload {Math.max(5 - notes.length, 0)} more notes to unlock your contributor badge.
              </p>
            </div>
          </div>
        </div>

      </div>

      {/* Edit Modal */}
      {editNote && (
        <div style={{
          position: "fixed", inset: 0, zIndex: 9999,
          background: "rgba(28,20,16,0.6)", backdropFilter: "blur(6px)",
          display: "flex", alignItems: "center", justifyContent: "center", padding: "1.5rem",
        }} onClick={closeEdit}>
          <div style={{
            background: "var(--bg-card)", border: "1px solid var(--border)",
            width: "100%", maxWidth: "480px", borderRadius: "0px", padding: "2rem",
            position: "relative",
          }} onClick={e => e.stopPropagation()}>
            <h3 style={{ fontSize: "1.2rem", fontWeight: 700, color: "var(--text)", marginBottom: "1.5rem" }}>
              Edit Note
            </h3>

            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {[
                { label: "Title *", key: "title", placeholder: "Note title" },
                { label: "Subject", key: "subject", placeholder: "e.g. Computer Science (CSE)" },
                { label: "University", key: "university", placeholder: "e.g. IIT Delhi" },
              ].map(f => (
                <div key={f.key}>
                  <label className="form-label">{f.label}</label>
                  <input
                    value={editForm[f.key]}
                    onChange={e => setEditForm(p => ({ ...p, [f.key]: e.target.value }))}
                    placeholder={f.placeholder}
                    className="form-input"
                  />
                </div>
              ))}
              <div>
                <label className="form-label">Description</label>
                <textarea
                  value={editForm.description}
                  onChange={e => setEditForm(p => ({ ...p, description: e.target.value }))}
                  placeholder="What topics does this note cover?"
                  rows={3}
                  className="form-input"
                  style={{ resize: "vertical" }}
                />
              </div>
            </div>

            <div style={{ display: "flex", gap: "0.6rem", marginTop: "1.5rem" }}>
              <button onClick={closeEdit} style={{ flex: 1, padding: "0.65rem", background: "rgba(28,20,16,0.03)", border: "1px solid rgba(28,20,16,0.05)", color: "var(--text-muted)", borderRadius: "0px", cursor: "pointer", fontWeight: 600, fontSize: "0.85rem", fontFamily: 'inherit' }}>
                Cancel
              </button>
              <button onClick={handleEditSave} disabled={editLoading} style={{
                flex: 2, padding: "0.65rem", background: editLoading ? "var(--border)" : "var(--primary)",
                border: "none", color: "white", borderRadius: "0px",
                cursor: editLoading ? "not-allowed" : "pointer", fontWeight: 600, fontSize: "0.85rem",
                fontFamily: 'inherit',
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

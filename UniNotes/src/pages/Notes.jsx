import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import NoteCard from "../components/NoteCard";
import API, { API_BASE_URL } from "../services/api";
import { useToast } from "../context/ToastContext";

const BRANCHES = [
  { label: "All Subjects", value: "" },
  { label: "💻 Computer Science", value: "Computer Science (CSE)" },
  { label: "🌐 Information Tech", value: "Information Tech (IT)" },
  { label: "⚙️ Mechanical", value: "Mechanical Engg. (ME)" },
  { label: "📡 Electronics", value: "Electronics (ECE)" },
  { label: "🏗️ Civil", value: "Civil Engg. (CE)" },
  { label: "⚡ Electrical", value: "Electrical (EE)" },
  { label: "📖 Common", value: "Common" },
];

function Notes() {
  const { showToast } = useToast();
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [subjectFilter, setSubjectFilter] = useState("");
  const [uniFilter, setUniFilter] = useState("");
  const [previewNote, setPreviewNote] = useState(null);
  const [universityList, setUniversityList] = useState([]);

  // Pagination states
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalNotes, setTotalNotes] = useState(0);

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const subjectQuery = searchParams.get("subject");
  const universityQuery = searchParams.get("university");

  // Get current user for checking liked status
  const currentUser = (() => { try { return JSON.parse(localStorage.getItem('user')) || {}; } catch { return {}; } })();

  // Setup search debouncing
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setPage(1); // Reset page on new search
    }, 450);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Handle URL search queries mapping
  useEffect(() => {
    if (subjectQuery) {
      setSubjectFilter(subjectQuery);
      setPage(1);
    }
    if (universityQuery) {
      setUniFilter(universityQuery);
      setPage(1);
    }
  }, [subjectQuery, universityQuery]);

  // Fetch static colleges once
  useEffect(() => {
    API.get('/api/universities')
      .then(res => {
        const uniqueNames = [...new Set(res.data.map(u => u.name))].sort();
        setUniversityList(uniqueNames);
      })
      .catch(() => {});
  }, []);

  // Fetch paginated global notes feed
  const fetchNotes = async (loadMore = false) => {
    if (!loadMore) setLoading(true);
    try {
      const res = await API.get('/api/notes/feed', {
        params: {
          search: debouncedSearch,
          subject: subjectFilter,
          university: uniFilter,
          page,
          limit: 9
        }
      });

      const formattedNotes = res.data.notes.map(note => ({
        ...note,
        id: note._id,
        previewUrl: note.fileUrl
          ? (note.fileUrl.startsWith('http') ? note.fileUrl : `${API_BASE_URL}${note.fileUrl}`)
          : null,
        time: new Date(note.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
      }));

      if (loadMore) {
        setNotes(prev => [...prev, ...formattedNotes]);
      } else {
        setNotes(formattedNotes);
      }
      setTotalPages(res.data.totalPages);
      setTotalNotes(res.data.totalNotes);
    } catch (err) {
      console.error("Error fetching notes feed", err);
      showToast("Failed to retrieve notes feed. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  // Fetch notes whenever debounced search, subjects, universities, or page changes
  useEffect(() => {
    fetchNotes(page > 1);
  }, [debouncedSearch, subjectFilter, uniFilter, page]);

  // Reset page when subject or university changes
  const handleSubjectChange = (val) => {
    setSubjectFilter(val);
    setPage(1);
  };

  const handleUniversityChange = (val) => {
    setUniFilter(val);
    setPage(1);
  };

  const handleLoadMore = () => {
    if (page < totalPages) {
      setPage(prev => prev + 1);
    }
  };

  const incrementDownload = async (note) => {
    try {
      const res = await API.post(`/api/notes/${note.id}/download`);
      setNotes(prev => prev.map(n => n.id === note.id ? { ...n, downloads: res.data.downloads } : n));
    } catch (err) {
      console.error("Failed to increment download counter", err);
    }
  };

  const handleLike = async (note, e) => {
    e.stopPropagation();
    const token = localStorage.getItem('token');
    if (!token) {
      showToast("You need to sign in to like notes!", "warning");
      return;
    }

    try {
      const res = await API.post(`/api/notes/${note.id}/like`);
      setNotes(prev => prev.map(n => n.id === note.id ? { ...n, likes: res.data.likes } : n));

      const hasLiked = res.data.likes.includes(currentUser.id);
      showToast(hasLiked ? "Added to liked notes ❤️" : "Removed from liked notes", "info");
    } catch (err) {
      showToast("Failed to toggle like status on this note.", "error");
    }
  };

  const handleDownload = (note, e) => {
    e.stopPropagation();
    if (!note.previewUrl) {
      showToast("No PDF attached to this note.", "warning");
      return;
    }
    
    incrementDownload(note);

    if (note.previewUrl.startsWith('http')) {
      window.open(note.previewUrl, '_blank', 'noopener,noreferrer');
      return;
    }

    const link = document.createElement("a");
    link.href = note.previewUrl;
    link.download = `${note.title.replace(/\s+/g, "_")}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePreviewOpen = (note) => {
    setPreviewNote(note);
    incrementDownload(note);
  };

  const isLiked = (note) => {
    if (!currentUser || !currentUser.id || !note.likes) return false;
    return note.likes.includes(currentUser.id);
  };

  return (
    <div style={{ minHeight: "100vh", background: "#000", paddingBottom: "4rem" }}>
      {/* Page Header */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(99,102,241,0.1) 0%, rgba(233,94,134,0.1) 100%)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        padding: '3rem 2rem 2rem',
        textAlign: 'center'
      }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 800, margin: '0 0 0.5rem 0', color: '#f1f5f9' }}>
          Browse <span style={{ color: '#e95e86' }}>Study Notes</span>
        </h1>
        <p style={{ color: '#64748b', fontSize: '1.05rem', margin: 0 }}>
          Curated learning resources from India's top engineering colleges
        </p>
      </div>

      <div className="container">
        {/* Quick Branch Filters */}
        <div className="no-scrollbar" style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', paddingBottom: '0.5rem', marginBottom: '1.5rem', marginTop: '2rem', WebkitOverflowScrolling: 'touch' }}>
          {BRANCHES.map(b => (
            <button
              key={b.value}
              onClick={() => handleSubjectChange(b.value)}
              style={{
                padding: '0.45rem 1rem', borderRadius: '999px', cursor: 'pointer',
                fontWeight: 600, fontSize: '0.82rem', transition: 'all 0.2s',
                whiteSpace: 'nowrap', flexShrink: 0,
                background: subjectFilter === b.value ? '#e95e86' : 'rgba(255,255,255,0.05)',
                color: subjectFilter === b.value ? 'white' : '#94a3b8',
                border: `1px solid ${subjectFilter === b.value ? '#e95e86' : 'rgba(255,255,255,0.1)'}`,
              }}
            >
              {b.label}
            </button>
          ))}
        </div>

        {/* Search + University filter row */}
        <div className="glass-panel" style={{ padding: '1.2rem 1.5rem', borderRadius: '14px', marginBottom: '2rem', display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ flex: '1 1 220px', position: 'relative' }}>
            <svg style={{ position: 'absolute', left: '0.8rem', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              type="text"
              placeholder="Search notes by title or topic..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ width: "100%", padding: "0.7rem 0.8rem 0.7rem 2.4rem", borderRadius: "10px", background: "rgba(0,0,0,0.4)", border: "1px solid rgba(255,255,255,0.1)", color: "white", outline: "none", fontSize: '0.9rem' }}
            />
          </div>
          <div style={{ flex: '1 1 220px' }}>
            <input
              list="uni-notes-options"
              value={uniFilter}
              onChange={(e) => handleUniversityChange(e.target.value)}
              placeholder="Filter by University..."
              style={{ width: "100%", padding: "0.7rem 0.8rem", borderRadius: "10px", background: "rgba(0,0,0,0.4)", border: "1px solid rgba(255,255,255,0.1)", color: "white", outline: "none", fontSize: '0.9rem' }}
            />
            <datalist id="uni-notes-options">
              {universityList.map((uni, idx) => <option key={idx} value={uni} />)}
            </datalist>
          </div>
          {(searchTerm || subjectFilter || uniFilter) && (
            <button
              onClick={() => { setSearchTerm(''); setSubjectFilter(''); setUniFilter(''); setPage(1); }}
              style={{ padding: '0.7rem 1.2rem', background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)', color: '#f87171', borderRadius: '10px', cursor: 'pointer', fontWeight: 600, fontSize: '0.85rem', whiteSpace: 'nowrap' }}
            >
              Clear filters
            </button>
          )}
        </div>

        {/* Results count */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <span style={{ color: '#64748b', fontSize: '0.9rem' }}>
            Showing <strong style={{ color: '#e95e86' }}>{notes.length}</strong> of {totalNotes} documents
            {subjectFilter && <span> in <strong style={{ color: '#94a3b8' }}>{subjectFilter}</strong></span>}
          </span>
        </div>

        {/* Notes Grid */}
        {loading && notes.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '5rem', color: '#64748b' }}>
            <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>⏳</div>
            <p style={{ fontSize: '1.1rem' }}>Loading notes...</p>
          </div>
        ) : notes.length === 0 ? (
          <div style={{ textAlign: "center", padding: "5rem 2rem", color: "#9ca3af", background: "rgba(255,255,255,0.02)", borderRadius: "20px", border: '1px solid rgba(255,255,255,0.06)' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔍</div>
            <h3 style={{ fontSize: "1.5rem", marginBottom: "0.5rem", color: '#e2e8f0' }}>No Notes Found</h3>
            <p>Try adjusting your search or clearing the filters.</p>
          </div>
        ) : (
          <>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
              gap: '1.5rem'
            }}>
              {notes.map((note, index) => (
                <div key={note.id || index} style={{ animationDelay: `${index * 0.04}s` }} className="fade-in">
                  <NoteCard
                    note={note}
                    onPreview={() => handlePreviewOpen(note)}
                    onDownload={(e) => handleDownload(note, e)}
                    onLike={handleLike}
                    isLiked={isLiked(note)}
                  />
                </div>
              ))}
            </div>

            {/* Load More Button */}
            {page < totalPages && (
              <div style={{ display: 'flex', justifyContent: 'center', marginTop: '3rem' }}>
                <button
                  onClick={handleLoadMore}
                  disabled={loading}
                  style={{
                    padding: '0.8rem 2.5rem',
                    background: 'rgba(233,94,134,0.12)',
                    border: '1px solid rgba(233,94,134,0.4)',
                    color: '#e95e86',
                    borderRadius: '30px',
                    fontWeight: 700,
                    fontSize: '0.95rem',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    transition: 'all 0.2s',
                    boxShadow: '0 4px 14px rgba(233,94,134,0.15)',
                    outline: 'none'
                  }}
                  onMouseEnter={(e) => {
                    if (!loading) {
                      e.currentTarget.style.background = 'rgba(233,94,134,0.25)';
                      e.currentTarget.style.transform = 'translateY(-2px)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!loading) {
                      e.currentTarget.style.background = 'rgba(233,94,134,0.12)';
                      e.currentTarget.style.transform = 'none';
                    }
                  }}
                >
                  {loading ? "Loading more..." : "Load More Notes"}
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Preview Modal */}
      {previewNote && (
        <div className="modal-overlay" onClick={() => setPreviewNote(null)}>
          <div className="modal-content glass-panel fade-in" onClick={e => e.stopPropagation()}>
            <button
              onClick={() => setPreviewNote(null)}
              style={{ position: "absolute", top: "1rem", right: "1.2rem", background: "rgba(255,255,255,0.1)", border: "none", color: "white", width: '32px', height: '32px', borderRadius: '50%', cursor: "pointer", fontSize: "1rem", display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >✕</button>

            <div style={{ marginBottom: '1.5rem', paddingRight: '2rem' }}>
              <h2 style={{ fontSize: "1.5rem", fontWeight: 800, marginBottom: "0.5rem", color: '#f1f5f9', lineHeight: 1.3 }}>{previewNote.title}</h2>
              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
                <span style={{ color: '#e95e86', fontWeight: 600, fontSize: '0.9rem' }}>📚 {previewNote.subject}</span>
                <span style={{ color: '#64748b', fontSize: '0.9rem' }}>🏛️ {previewNote.university}</span>
                {previewNote.courseCode && <span style={{ color: '#64748b', fontSize: '0.9rem' }}>🏷️ {previewNote.courseCode}</span>}
              </div>
              {(previewNote.description || previewNote.content) && (
                <p style={{ marginTop: '0.8rem', color: '#94a3b8', fontSize: '0.9rem', lineHeight: 1.6, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '10px', padding: '0.8rem' }}>
                  {previewNote.description || previewNote.content}
                </p>
              )}

              {/* Meet the Author — Preview Modal */}
              {previewNote.user && (
                <div style={{
                  marginTop: '0.8rem',
                  background: 'linear-gradient(135deg, rgba(99,102,241,0.08), rgba(233,94,134,0.08))',
                  border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: '12px',
                  padding: '0.8rem 1rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.8rem',
                  flexWrap: 'wrap',
                }}>
                  <div style={{
                    width: '36px', height: '36px', borderRadius: '50%', flexShrink: 0,
                    background: 'linear-gradient(135deg, #6366f1, #e95e86)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '0.75rem', fontWeight: 700, color: 'white',
                  }}>
                    {(previewNote.user.name || 'U').split(' ').map(w => w[0]).join('').substring(0, 2).toUpperCase()}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                      Meet the Author
                    </div>
                    <div style={{ fontSize: '0.9rem', fontWeight: 600, color: '#e2e8f0' }}>
                      {previewNote.user.name || 'Unknown Author'}
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    {previewNote.user.email && (
                      <a
                        href={`mailto:${previewNote.user.email}?subject=Regarding your note: ${encodeURIComponent(previewNote.title)}`}
                        title={`Email ${previewNote.user.name}`}
                        style={{
                          padding: '0.4rem 0.8rem', borderRadius: '8px',
                          background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.25)',
                          color: '#f87171', textDecoration: 'none', fontSize: '0.78rem', fontWeight: 600,
                          display: 'flex', alignItems: 'center', gap: '0.35rem',
                          transition: 'all 0.2s',
                        }}
                        onMouseOver={(e) => { e.currentTarget.style.background = 'rgba(239,68,68,0.25)'; }}
                        onMouseOut={(e) => { e.currentTarget.style.background = 'rgba(239,68,68,0.12)'; }}
                      >
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <rect x="2" y="4" width="20" height="16" rx="2" />
                          <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                        </svg>
                        Email
                      </a>
                    )}
                    {previewNote.user.linkedin && (
                      <a
                        href={previewNote.user.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        title={`${previewNote.user.name}'s LinkedIn`}
                        style={{
                          padding: '0.4rem 0.8rem', borderRadius: '8px',
                          background: 'rgba(59,130,246,0.12)', border: '1px solid rgba(59,130,246,0.25)',
                          color: '#60a5fa', textDecoration: 'none', fontSize: '0.78rem', fontWeight: 600,
                          display: 'flex', alignItems: 'center', gap: '0.35rem',
                          transition: 'all 0.2s',
                        }}
                        onMouseOver={(e) => { e.currentTarget.style.background = 'rgba(59,130,246,0.25)'; }}
                        onMouseOut={(e) => { e.currentTarget.style.background = 'rgba(59,130,246,0.12)'; }}
                      >
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                        </svg>
                        LinkedIn
                      </a>
                    )}
                  </div>
                </div>
              )}
            </div>

            <div style={{
              flex: 1, backgroundColor: "rgba(0,0,0,0.4)", borderRadius: "12px", border: "1px dashed rgba(255,255,255,0.1)",
              display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
              overflow: "hidden"
            }}>
              {previewNote.previewUrl ? (
                <iframe 
                  src={previewNote.previewUrl} 
                  width="100%" 
                  height="100%" 
                  style={{ border: "none", borderRadius: "12px" }} 
                  title="PDF Preview" 
                />
              ) : (
                <div style={{ textAlign: "center", padding: "2rem", color: '#64748b' }}>
                  <div style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>📄</div>
                  <h3 style={{ color: "#94a3b8", marginBottom: '0.5rem' }}>No PDF attached to this note</h3>
                  <p style={{ fontSize: '0.9rem', marginBottom: '1.5rem', color: '#475569' }}>
                    This is a seeded/demo note. Real PDFs are uploaded by the community via the Upload page.
                  </p>
                  <a href="/upload" style={{ padding: '0.7rem 1.5rem', background: '#e95e86', color: 'white', borderRadius: '10px', textDecoration: 'none', fontWeight: 700, fontSize: '0.9rem' }}>
                    📤 Upload a Note
                  </a>
                </div>
              )}
            </div>

            <div style={{ marginTop: "1.2rem", display: "flex", justifyContent: "flex-end", gap: "0.8rem", flexWrap: "wrap" }}>
              <button onClick={() => setPreviewNote(null)} style={{ padding: "0.7rem 1.5rem", backgroundColor: "rgba(255,255,255,0.08)", color: "#94a3b8", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "10px", fontWeight: 600, cursor: "pointer", flex: "1 1 120px" }}>
                Close
              </button>
              <button onClick={(e) => handleDownload(previewNote, e)} style={{ padding: "0.7rem 1.8rem", backgroundColor: "#e95e86", color: "white", border: "none", borderRadius: "10px", fontWeight: 700, cursor: "pointer", display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', flex: "2 1 160px" }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" />
                </svg>
                Download PDF
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Notes;
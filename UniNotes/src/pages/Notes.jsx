import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import NoteCard from "../components/NoteCard";
import API, { API_BASE_URL } from "../services/api";
import { useToast } from "../context/ToastContext";

const BRANCHES = [
  { label: "All", value: "" },
  { label: "Computer Science", value: "Computer Science (CSE)" },
  { label: "Information Tech", value: "Information Tech (IT)" },
  { label: "Mechanical", value: "Mechanical Engg. (ME)" },
  { label: "Electronics", value: "Electronics (ECE)" },
  { label: "Civil", value: "Civil Engg. (CE)" },
  { label: "Electrical", value: "Electrical (EE)" },
  { label: "Common", value: "Common" },
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
      showToast(hasLiked ? "Added to liked notes" : "Removed from liked notes", "info");
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
    <div style={{ minHeight: "100vh", background: "var(--bg)", paddingBottom: "4rem" }}>
      {/* Page Header */}
      <div style={{
        borderBottom: '1px solid var(--border)',
        padding: '2.5rem 2rem 1.75rem',
      }}>
        <div className="container">
          <h1 style={{ fontSize: '2rem', fontWeight: 800, margin: '0 0 0.3rem 0', color: 'var(--text)' }}>
            Browse Notes
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', margin: 0 }}>
            Curated resources from engineering colleges across India
          </p>
        </div>
      </div>

      <div className="container">
        {/* Branch Filters */}
        <div className="no-scrollbar" style={{ display: 'flex', gap: '0.4rem', overflowX: 'auto', paddingBottom: '0.5rem', marginBottom: '1.25rem', marginTop: '1.5rem', WebkitOverflowScrolling: 'touch' }}>
          {BRANCHES.map(b => (
            <button
              key={b.value}
              onClick={() => handleSubjectChange(b.value)}
              className={`tag-pill${subjectFilter === b.value ? ' active' : ''}`}
            >
              {b.label}
            </button>
          ))}
        </div>

        {/* Search + University filter */}
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center', marginBottom: '1.5rem' }}>
          <div style={{ flex: '1 1 220px', position: 'relative' }}>
            <svg style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              type="text"
              placeholder="Search by title or topic..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="form-input"
              style={{ paddingLeft: '2.2rem' }}
            />
          </div>
          <div style={{ flex: '1 1 220px' }}>
            <input
              list="uni-notes-options"
              value={uniFilter}
              onChange={(e) => handleUniversityChange(e.target.value)}
              placeholder="Filter by university..."
              className="form-input"
            />
            <datalist id="uni-notes-options">
              {universityList.map((uni, idx) => <option key={idx} value={uni} />)}
            </datalist>
          </div>
          {(searchTerm || subjectFilter || uniFilter) && (
            <button
              onClick={() => { setSearchTerm(''); setSubjectFilter(''); setUniFilter(''); setPage(1); }}
              style={{
                padding: '0.6rem 1rem',
                background: 'var(--primary-subtle)',
                border: '1px solid rgba(193, 68, 14, 0.25)',
                color: 'var(--primary)',
                borderRadius: '10px',
                cursor: 'pointer',
                fontWeight: 600,
                fontSize: '0.82rem',
                whiteSpace: 'nowrap',
                fontFamily: 'inherit'
              }}
            >
              Clear
            </button>
          )}
        </div>

        {/* Results count */}
        <div style={{ marginBottom: '1.25rem' }}>
          <span style={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}>
            <strong style={{ color: 'var(--text)' }}>{notes.length}</strong> of {totalNotes} results
            {subjectFilter && <span> in <strong style={{ color: 'var(--text)' }}>{subjectFilter}</strong></span>}
          </span>
        </div>

        {/* Notes Grid */}
        {loading && notes.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>
            <p style={{ fontSize: '0.95rem' }}>Loading notes...</p>
          </div>
        ) : notes.length === 0 ? (
          <div style={{ textAlign: "center", padding: "4rem 2rem", color: "var(--text-muted)", background: "var(--bg-card)", borderRadius: "16px", border: '1px solid var(--border)' }}>
            <h3 style={{ fontSize: "1.2rem", marginBottom: "0.4rem", color: 'var(--text)' }}>No notes found</h3>
            <p style={{ fontSize: '0.88rem' }}>Try adjusting your search or clearing the filters.</p>
          </div>
        ) : (
          <>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))',
              gap: '1rem'
            }}>
              {notes.map((note, index) => (
                <div key={note.id || index}>
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

            {/* Load More */}
            {page < totalPages && (
              <div style={{ display: 'flex', justifyContent: 'center', marginTop: '2.5rem' }}>
                <button
                  onClick={handleLoadMore}
                  disabled={loading}
                  style={{
                    padding: '0.7rem 2rem',
                    background: 'var(--bg-card)',
                    border: '1px solid var(--border)',
                    color: 'var(--text-muted)',
                    borderRadius: '10px',
                    fontWeight: 600,
                    fontSize: '0.88rem',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    transition: 'all 0.15s',
                    fontFamily: 'inherit',
                  }}
                  onMouseEnter={(e) => {
                    if (!loading) {
                      e.currentTarget.style.borderColor = 'var(--primary)';
                      e.currentTarget.style.color = 'var(--primary)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!loading) {
                      e.currentTarget.style.borderColor = 'var(--border)';
                      e.currentTarget.style.color = 'var(--text-muted)';
                    }
                  }}
                >
                  {loading ? "Loading..." : "Load more"}
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Preview Modal */}
      {previewNote && (
        <div className="modal-overlay" onClick={() => setPreviewNote(null)}>
          <div className="modal-content glass-panel fade-in" onClick={e => e.stopPropagation()} style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
            <button
              onClick={() => setPreviewNote(null)}
              style={{
                position: "absolute",
                top: "1rem",
                right: "1.2rem",
                background: "rgba(28, 20, 16, 0.05)",
                border: "1px solid rgba(28, 20, 16, 0.1)",
                color: "var(--text-muted)",
                width: '28px',
                height: '28px',
                borderRadius: '8px',
                cursor: "pointer",
                fontSize: "0.85rem",
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >✕</button>

            <div style={{ marginBottom: '1.25rem', paddingRight: '2rem' }}>
              <h2 style={{ fontSize: "1.3rem", fontWeight: 700, marginBottom: "0.4rem", color: 'var(--text)', lineHeight: 1.3 }}>{previewNote.title}</h2>
              <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center', fontSize: '0.82rem' }}>
                <span style={{ color: 'var(--primary)', fontWeight: 600 }}>{previewNote.subject}</span>
                <span style={{ color: 'var(--text-muted)' }}>{previewNote.university}</span>
                {previewNote.courseCode && <span style={{ color: 'var(--text-muted)' }}>{previewNote.courseCode}</span>}
              </div>
              {(previewNote.description || previewNote.content) && (
                <p style={{ marginTop: '0.6rem', color: 'var(--text-muted)', fontSize: '0.85rem', lineHeight: 1.6 }}>
                  {previewNote.description || previewNote.content}
                </p>
              )}

              {/* Author info */}
              {previewNote.user && (
                <div style={{
                  marginTop: '0.6rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.6rem',
                  flexWrap: 'wrap',
                }}>
                  <div style={{
                    width: '28px', height: '28px', borderRadius: '7px', flexShrink: 0,
                    background: 'var(--primary)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '0.65rem', fontWeight: 700, color: 'white',
                  }}>
                    {(previewNote.user.name || 'U').split(' ').map(w => w[0]).join('').substring(0, 2).toUpperCase()}
                  </div>
                  <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text)' }}>
                    {previewNote.user.name || 'Unknown Author'}
                  </span>
                  {previewNote.user.email && (
                    <a href={`mailto:${previewNote.user.email}`} onClick={e => e.stopPropagation()} style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textDecoration: 'none' }}>
                      Email →
                    </a>
                  )}
                  {previewNote.user.linkedin && (
                    <a href={previewNote.user.linkedin} target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()} style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textDecoration: 'none' }}>
                      LinkedIn →
                    </a>
                  )}
                </div>
              )}
            </div>

            <div style={{
              flex: 1, backgroundColor: "rgba(28, 20, 16, 0.03)", borderRadius: "10px", border: "1px dashed var(--border)",
              display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
              overflow: "hidden"
            }}>
              {previewNote.previewUrl ? (
                <iframe 
                  src={previewNote.previewUrl} 
                  width="100%" 
                  height="100%" 
                  style={{ border: "none", borderRadius: "10px" }} 
                  title="PDF Preview" 
                />
              ) : (
                <div style={{ textAlign: "center", padding: "2rem", color: 'var(--text-muted)' }}>
                  <h3 style={{ color: "var(--text)", marginBottom: '0.4rem', fontSize: '1rem' }}>No PDF attached</h3>
                  <p style={{ fontSize: '0.85rem', marginBottom: '1.25rem' }}>
                    Real PDFs are uploaded by the community.
                  </p>
                  <a href="/upload" style={{ padding: '0.6rem 1.2rem', background: 'var(--primary)', color: 'white', borderRadius: '8px', textDecoration: 'none', fontWeight: 600, fontSize: '0.85rem' }}>
                    Upload a Note
                  </a>
                </div>
              )}
            </div>

            <div style={{ marginTop: "1rem", display: "flex", justifyContent: "flex-end", gap: "0.6rem", flexWrap: "wrap" }}>
              <button onClick={() => setPreviewNote(null)} style={{ padding: "0.6rem 1.2rem", backgroundColor: "rgba(28, 20, 16, 0.03)", color: "var(--text-muted)", border: "1px solid var(--border)", borderRadius: "8px", fontWeight: 600, cursor: "pointer", flex: "1 1 100px", fontFamily: 'inherit', fontSize: '0.85rem' }}>
                Close
              </button>
              <button onClick={(e) => handleDownload(previewNote, e)} style={{ padding: "0.6rem 1.5rem", backgroundColor: "var(--primary)", color: "white", border: "none", borderRadius: "8px", fontWeight: 600, cursor: "pointer", display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', flex: "2 1 140px", fontFamily: 'inherit', fontSize: '0.85rem' }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
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
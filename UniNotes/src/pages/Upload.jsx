import { useState, useEffect } from "react";
import API from "../services/api";
import { useToast } from "../context/ToastContext";

function Upload() {
  const { showToast } = useToast();
  const [formData, setFormData] = useState({
    title: "",
    subject: "",
    university: "",
    semester: "",
    description: "",
    file: null
  });
  const [isUploading, setIsUploading] = useState(false);
  const [universityList, setUniversityList] = useState([]);
  const [subjectList, setSubjectList] = useState([]);
  const [userNotesCount, setUserNotesCount] = useState(0);

  useEffect(() => {
    API.get('/api/universities')
      .then(res => {
        const uniqueNames = [...new Set(res.data.map(u => u.name))];
        setUniversityList(uniqueNames);
      })
      .catch(err => console.error("Error fetching universities:", err));

    API.get('/api/subjects')
      .then(res => setSubjectList(res.data))
      .catch(err => console.error("Error fetching subjects:", err));

    API.get('/api/notes')
      .then(res => setUserNotesCount(res.data.length))
      .catch(() => {});
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.type !== "application/pdf") {
        showToast("Only PDF files are allowed!", "error");
        setFormData(prev => ({ ...prev, file: null }));
        e.target.value = null; // reset input
      } else {
        showToast("PDF attached successfully!", "success");
        setFormData(prev => ({ ...prev, file: file }));
      }
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.subject || !formData.university || !formData.semester || !formData.file) {
      showToast("Please fill out all required fields.", "warning");
      return;
    }

    setIsUploading(true);

    try {
      const uploadData = new FormData();
      uploadData.append('title', formData.title);
      uploadData.append('subject', formData.subject);
      uploadData.append('university', formData.university);
      uploadData.append('semester', formData.semester);
      uploadData.append('description', formData.description);
      uploadData.append('fileUrl', formData.file); // Backend expects 'fileUrl' field name for multer

      await API.post('/api/notes', uploadData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      setIsUploading(false);
      showToast("Notes uploaded successfully! Thank you for contributing.", "success");
      setUserNotesCount(prev => prev + 1);

      // Reset form
      setFormData({
        title: "",
        subject: "",
        university: "",
        semester: "",
        description: "",
        file: null
      });
    } catch (err) {
      console.error(err);
      setIsUploading(false);
      showToast(err.response?.data?.message || "Failed to upload notes. Please try again.", "error");
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", paddingBottom: "4rem" }}>
      {/* Page Header */}
      <div style={{
        borderBottom: "1px solid var(--border)",
        padding: "2.5rem 2rem 2rem",
        marginBottom: "2rem"
      }}>
        <div className="container">
          <h1 style={{ fontSize: "1.75rem", fontWeight: 800, margin: 0, color: "var(--text)" }}>
            Upload your notes
          </h1>
          <p style={{ color: "var(--text-muted)", margin: "0.3rem 0 0", fontSize: "0.88rem" }}>
            Share once, help hundreds. Your notes go through a quick review before going live.
          </p>
        </div>
      </div>

      <div className="container fade-in" style={{
        display: 'flex',
        gap: '1.5rem',
        flexWrap: 'wrap',
        alignItems: 'flex-start',
      }}>
        <div style={{ flex: '1 1 560px', background: 'var(--bg-card)', border: '1px solid var(--border)', padding: '2.5rem 2rem', borderRadius: '0px', boxShadow: "var(--shadow-sm)" }}>
          <form onSubmit={handleUpload} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>

            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              <div style={{ flex: '1 1 260px' }}>
                <label className="form-label">Title *</label>
                <input name="title" value={formData.title} onChange={handleInputChange} required placeholder="e.g. DSA Midterm Notes" className="form-input" />
              </div>

              <div style={{ flex: '1 1 260px' }}>
                <label className="form-label">Subject *</label>
                <input name="subject" list="subject-upload-options" value={formData.subject} onChange={handleInputChange} required className="form-input" placeholder="Select a subject..." />
                <datalist id="subject-upload-options">
                  {subjectList.map((sub, idx) => (
                    <option key={idx} value={sub} />
                  ))}
                </datalist>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              <div style={{ flex: '1 1 260px' }}>
                <label className="form-label">University *</label>
                <input name="university" list="uni-upload-options" value={formData.university} onChange={handleInputChange} required className="form-input" placeholder="e.g. IIT Delhi" />
                <datalist id="uni-upload-options">
                  {universityList.map((uni, idx) => (
                    <option key={idx} value={uni} />
                  ))}
                </datalist>
              </div>

              <div style={{ flex: '1 1 260px' }}>
                <label className="form-label">Semester *</label>
                <select name="semester" value={formData.semester} onChange={handleInputChange} required className="form-select">
                  <option value="">Select semester...</option>
                  <option value="1">Semester 1</option>
                  <option value="2">Semester 2</option>
                  <option value="3">Semester 3</option>
                  <option value="4">Semester 4</option>
                  <option value="5">Semester 5</option>
                  <option value="6">Semester 6</option>
                  <option value="7">Semester 7</option>
                  <option value="8">Semester 8</option>
                </select>
              </div>
            </div>

            <div>
              <label className="form-label">Description (optional — but helps students find your notes)</label>
              <textarea name="description" value={formData.description} onChange={handleInputChange} placeholder="Topics covered, what makes these notes useful for exams..." rows={3} className="form-input" style={{ resize: 'vertical' }} />
            </div>

            <div>
              <label className="form-label">Upload PDF *</label>
              <div style={{
                border: '1px dashed var(--border)',
                borderRadius: '0px',
                padding: '1.75rem',
                textAlign: 'center',
                backgroundColor: 'rgba(28, 20, 16, 0.02)',
                cursor: 'pointer',
                position: 'relative',
                transition: 'border-color 0.2s'
              }} onMouseOver={(e) => e.currentTarget.style.borderColor = 'var(--primary)'} onMouseOut={(e) => e.currentTarget.style.borderColor = 'var(--border)'}>
                <input type="file" accept="application/pdf" onChange={handleFileChange} required style={{
                  position: 'absolute',
                  top: 0, left: 0, width: '100%', height: '100%',
                  opacity: 0, cursor: 'pointer'
                }} />
                <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: '0.75rem', opacity: 0.7 }}>
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                  <polyline points="17 8 12 3 7 8"></polyline>
                  <line x1="12" y1="3" x2="12" y2="15"></line>
                </svg>
                <p style={{ color: 'var(--text)', fontWeight: 600, margin: '0 0 0.25rem 0', fontSize: '0.88rem' }}>
                  {formData.file ? formData.file.name : "Drop your PDF here"}
                </p>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem', margin: 0 }}>or click to browse · PDF only · max 50MB</p>
              </div>
            </div>

            {/* Submit button */}
            <button type="submit" disabled={isUploading} style={{
              marginTop: '0.5rem',
              padding: '0.85rem',
              background: isUploading ? 'var(--border)' : 'var(--primary)',
              color: 'white',
              border: 'none',
              borderRadius: '0px',
              fontSize: '0.95rem',
              fontWeight: 600,
              cursor: isUploading ? 'not-allowed' : 'pointer',
              transition: 'background 0.15s',
              fontFamily: 'inherit',
            }}>
              {isUploading ? 'Uploading...' : 'Submit for review'}
            </button>
          </form>
          <div style={{ textAlign: "center", marginTop: "1rem", color: "var(--text-muted)", fontSize: "0.78rem" }}>
            Usually reviewed within 24 hours. You'll get an email when it's live.
          </div>
        </div>

        {/* Right Side Panel */}
        <div style={{ flex: '1 1 280px', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

          {/* Guidelines */}
          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', padding: '1.5rem', borderRadius: '0px', boxShadow: "var(--shadow-sm)" }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1rem', color: 'var(--text)' }}>
              Upload guidelines
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', color: 'var(--text-muted)', fontSize: '0.82rem', lineHeight: 1.4 }}>
              {[
                { text: "Clear, readable handwriting or typed notes", success: true },
                { text: "PDF format only, under 50MB", success: true },
                { text: "Accurate subject and university tags", success: true },
                { text: "No copyrighted publisher textbooks", success: false },
                { text: "No blank or placeholder PDFs", success: false }
              ].map((g, i) => (
                <div key={i} style={{ display: "flex", gap: "0.5rem", alignItems: "flex-start" }}>
                  <span style={{ color: g.success ? "#10b981" : "#ef4444", fontWeight: 700, fontSize: "0.9rem", lineHeight: 1 }}>
                    {g.success ? "✓" : "✗"}
                  </span>
                  <span>{g.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Top Contributors */}
          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', padding: '1.5rem', borderRadius: '0px', boxShadow: "var(--shadow-sm)" }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1rem', color: 'var(--text)' }}>
              Top contributors
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              {[
                { name: "Rohan G.", uni: "IIT Delhi", uploads: 12 },
                { name: "Priya M.", uni: "BITS Pilani", uploads: 9 },
                { name: "Eshika S.", uni: "IIT Bhubaneswar", uploads: 1 }
              ].map((user, idx) => (
                <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: idx !== 2 ? '1px solid var(--border)' : 'none', paddingBottom: idx !== 2 ? '0.65rem' : 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                    <div style={{ width: '28px', height: '28px', borderRadius: '0px', background: idx === 2 ? 'var(--primary)' : 'rgba(28,20,16,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.7rem', color: idx === 2 ? 'white' : 'var(--text)' }}>
                      {user.name.split(' ')[0][0]}{user.name.split(' ')[1] ? user.name.split(' ')[1][0] : ''}
                    </div>
                    <div>
                      <div style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text)' }}>{user.name}</div>
                      <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>{user.uni}</div>
                    </div>
                  </div>
                  <div style={{ fontSize: '0.78rem', color: idx === 2 ? 'var(--primary)' : 'var(--text-muted)', fontWeight: 600 }}>
                    {user.uploads}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Contributor Rank Card */}
          <div style={{
            background: 'var(--primary-subtle)',
            border: '1px solid rgba(193, 68, 14, 0.15)',
            padding: '1.5rem',
            borderRadius: '0px',
            boxShadow: "var(--shadow-sm)",
            display: 'flex',
            flexDirection: 'column',
            gap: '0.75rem'
          }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text)', margin: 0 }}>
              Your contributor rank
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem', margin: 0, lineHeight: 1.4 }}>
              Upload {Math.max(5 - userNotesCount, 0)} more notes to reach <strong style={{ color: "var(--primary)" }}>Contributor</strong> status and get a badge on your profile.
            </p>
            <div>
              {/* Progress bar container */}
              <div style={{ width: "100%", height: "6px", background: "rgba(193, 68, 14, 0.08)", borderRadius: "0px", overflow: "hidden", marginBottom: "0.5rem" }}>
                <div style={{ width: `${Math.min((userNotesCount / 5) * 100, 100)}%`, height: "100%", background: "var(--primary)", borderRadius: "0px" }} />
              </div>
              <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text)' }}>
                {userNotesCount} of 5 notes uploaded
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}

export default Upload;
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
    <div className="container fade-in" style={{
      display: 'flex',
      gap: '2rem',
      minHeight: '80vh',
      flexWrap: 'wrap',
      alignItems: 'flex-start'
    }}>
      {/* Main Upload Form */}
      <div className="glass-panel" style={{ flex: '1 1 600px', padding: '3rem 2rem', borderRadius: '16px' }}>
        <h2 style={{ marginBottom: '1.5rem', textAlign: 'center', fontSize: '2rem' }}>
          Upload <span style={{ color: "var(--primary-color)" }}>Your Notes</span>
        </h2>

        <p style={{ textAlign: 'center', color: '#94a3b8', marginBottom: '2.5rem' }}>
          Share your well-written PDF notes with other students across institutions.
        </p>

        <form onSubmit={handleUpload} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <div style={{ flex: '1 1 300px' }}>
              <label style={labelStyle}>Title *</label>
              <input name="title" value={formData.title} onChange={handleInputChange} required placeholder="e.g. Algorithms Midterm Review" style={inputStyle} />
            </div>

            <div style={{ flex: '1 1 300px' }}>
              <label style={labelStyle}>Subject *</label>
              <input name="subject" list="subject-upload-options" value={formData.subject} onChange={handleInputChange} required style={inputStyle} placeholder="Select a Subject..." />
              <datalist id="subject-upload-options">
                {subjectList.map((sub, idx) => (
                  <option key={idx} value={sub} />
                ))}
              </datalist>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <div style={{ flex: '1 1 300px' }}>
              <label style={labelStyle}>University *</label>
              <input name="university" list="uni-upload-options" value={formData.university} onChange={handleInputChange} required style={inputStyle} placeholder="Select your Institution..." />
              <datalist id="uni-upload-options">
                {universityList.map((uni, idx) => (
                  <option key={idx} value={uni} />
                ))}
              </datalist>
            </div>

            <div style={{ flex: '1 1 300px' }}>
              <label style={labelStyle}>Semester *</label>
              <select name="semester" value={formData.semester} onChange={handleInputChange} required style={inputStyle}>
                <option value="">Select Semester...</option>
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
            <label style={labelStyle}>Description (Optional)</label>
            <textarea name="description" value={formData.description} onChange={handleInputChange} placeholder="Any specific topics covered in this PDF?" rows={3} style={{ ...inputStyle, resize: 'vertical' }} />
          </div>

          <div>
            <label style={labelStyle}>Upload PDF Document *</label>
            <div style={{
              border: '2px dashed var(--border-color)',
              borderRadius: '8px',
              padding: '2rem',
              textAlign: 'center',
              backgroundColor: 'rgba(0,0,0,0.2)',
              cursor: 'pointer',
              position: 'relative'
            }}>
              <input type="file" accept="application/pdf" onChange={handleFileChange} required style={{
                position: 'absolute',
                top: 0, left: 0, width: '100%', height: '100%',
                opacity: 0, cursor: 'pointer'
              }} />
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--primary-color)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: '1rem' }}>
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="17 8 12 3 7 8"></polyline>
                <line x1="12" y1="3" x2="12" y2="15"></line>
              </svg>
              <p style={{ color: '#f8fafc', fontWeight: 500, margin: '0 0 0.5rem 0' }}>
                {formData.file ? formData.file.name : "Drag & Drop your PDF here"}
              </p>

              <p style={{ color: '#94a3b8', fontSize: '0.8rem', marginTop: '0.5rem' }}>Only PDF files supported</p>
            </div>
          </div>

          {/* Only show the final submit button if a file has been selected */}
          {formData.file && (
            <button type="submit" disabled={isUploading} style={{
              marginTop: '1rem',
              padding: '1.2rem',
              background: isUploading ? '#334155' : 'var(--primary-color)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '1.1rem',
              fontWeight: 700,
              cursor: isUploading ? 'not-allowed' : 'pointer',
              transition: 'background 0.2s, opacity 0.2s',
              opacity: isUploading ? 1 : 0.9,
            }}
              onMouseOver={(e) => {
                if (!isUploading) {
                  e.target.style.opacity = 1;
                }
              }}
              onMouseOut={(e) => {
                if (!isUploading) {
                  e.target.style.opacity = 0.9;
                }
              }}
            >
              {isUploading ? 'Uploading...' : 'Submit Notes'}
            </button>
          )}

        </form>
      </div>

      {/* Right Side Panel */}
      <div style={{ flex: '1 1 300px', display: 'flex', flexDirection: 'column', gap: '2rem' }}>

        {/* Guidelines Panel */}
        <div className="glass-panel" style={{ padding: '2rem', borderRadius: '16px' }}>
          <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem', color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ color: 'var(--primary-color)' }}>📋</span> Upload Guidelines
          </h3>
          <ul style={{ color: '#cbd5e1', fontSize: '0.9rem', lineHeight: 1.8, paddingLeft: '1.2rem', margin: 0 }}>
            <li style={{ marginBottom: '0.5rem' }}>Ensure the document is clear and readable.</li>
            <li style={{ marginBottom: '0.5rem' }}>Only <strong>.pdf</strong> files under 50MB are permitted.</li>
            <li style={{ marginBottom: '0.5rem' }}>Do not upload copyrighted material from publishers.</li>
            <li style={{ marginBottom: '0.5rem' }}>Tag your notes accurately with the correct Subject and University.</li>
            <li>Your notes will be verified by moderators before appearing on the live feed.</li>
          </ul>
        </div>

        {/* Top Contributors Panel */}
        <div className="glass-panel" style={{ padding: '2rem', borderRadius: '16px' }}>
          <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem', color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ color: '#fcd34d' }}>🏆</span> Top Contributors
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {[
              { name: "Rahul S.", uni: "IIT Delhi", uploads: 124 },
              { name: "Priya M.", uni: "BITS Pilani", uploads: 89 },
              { name: "Aman K.", uni: "Delhi University", uploads: 76 },
              { name: "Sneha R.", uni: "VIT Vellore", uploads: 52 }
            ].map((user, idx) => (
              <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: idx !== 3 ? '1px solid var(--border-color)' : 'none', paddingBottom: idx !== 3 ? '0.5rem' : 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                  <div style={{ width: '35px', height: '35px', borderRadius: '50%', background: 'linear-gradient(45deg, var(--primary-color), #fca5a5)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                    {user.name[0]}
                  </div>
                  <div>
                    <div style={{ fontSize: '0.9rem', fontWeight: 600, color: '#f8fafc' }}>{user.name}</div>
                    <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{user.uni}</div>
                  </div>
                </div>
                <div style={{ fontSize: '0.85rem', color: 'var(--primary-color)', fontWeight: 700 }}>
                  {user.uploads} Docs
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}

const labelStyle = { display: 'block', marginBottom: '0.5rem', color: '#cbd5e1', fontSize: '0.9rem', fontWeight: 500 };
const inputStyle = {
  width: '100%', padding: '0.9rem', borderRadius: '8px',
  background: 'rgba(0,0,0,0.4)', border: '1px solid var(--border-color)',
  color: 'white', outline: 'none', transition: 'border-color 0.2s'
};

export default Upload;
import { useState, useRef, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import API from "../services/api";

function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const profileDropdownRef = useRef(null);

  const [colleges, setColleges] = useState([
    "IIM Ahmedabad", "IIT Delhi", "IIT Bombay", "G.L Bajaj",
    "NMIMS", "Amity University", "LPU", "Sharda University",
    "BITS Pilani", "Delhi University", "NIT Trichy", "Manipal University"
  ]);

  // Auth States
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('user')) || null;
    } catch {
      return null;
    }
  });

  // Keep auth state in sync with localStorage
  useEffect(() => {
    const handleStorageChange = () => {
      setToken(localStorage.getItem('token'));
      try {
        setUser(JSON.parse(localStorage.getItem('user')) || null);
      } catch {
        setUser(null);
      }
    };
    window.addEventListener('storage', handleStorageChange);
    // Poll to catch internal route transitions that modify storage
    const interval = setInterval(handleStorageChange, 1000);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    API.get('/api/universities')
      .then(res => {
        const uniqueNames = [...new Set(res.data.map(u => u.name))];
        setColleges(uniqueNames);
      })
      .catch(err => console.error("Error fetching universities:", err));
  }, []);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target)) {
        setShowProfileDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [dropdownRef, profileDropdownRef]);

  const handleSearch = () => {
    const q = searchQuery.trim().toLowerCase();
    if (q) {
      const matchedCollege = colleges.find(c => c.toLowerCase().includes(q));
      if (matchedCollege) {
        navigate(`/notes?university=${encodeURIComponent(matchedCollege)}`);
      } else {
        navigate(`/notes?subject=${encodeURIComponent(searchQuery.trim())}`);
      }
      setSearchQuery("");
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
    setShowProfileDropdown(false);
    navigate('/login');
  };

  const userInitials = user && user.name 
    ? user.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()
    : 'U';

  return (
    <>
      <div style={{
        position: 'sticky',
        top: '1rem',
      zIndex: 100,
      display: "flex",
      justifyContent: "center",
      width: "100%",
      padding: "0 1rem",
      pointerEvents: "none"
    }}>
      <nav className="mobile-nav" style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        background: "#ffffff",
        padding: "0.5rem 1.5rem",
        borderRadius: "50px",
        width: "100%",
        maxWidth: "1100px",
        boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
        pointerEvents: "auto",
        gap: "2rem"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "2rem" }}>
          {/* Logo */}
          <Link to="/home" style={{ textDecoration: "none" }} className="mobile-nav-logo">
            <h2 style={{ margin: 0, fontSize: '1.4rem', fontWeight: 800, fontFamily: 'Inter, system-ui, sans-serif', letterSpacing: '0.5px' }}>
              <span style={{ color: '#e95e86' }}>Uni</span>
              <span style={{ color: '#111827' }}>Notes</span>
            </h2>
          </Link>

          {/* Nav Links */}
          <div className="hide-on-mobile" style={{ display: 'flex', gap: '1.2rem', alignItems: "center" }}>
            <Link to="/home" style={{ color: location.pathname === '/home' ? '#111827' : '#6b7280', fontWeight: location.pathname === '/home' ? 700 : 500, fontSize: "0.95rem", textDecoration: 'none' }}>Home</Link>
            <Link to="/courses" style={{ color: location.pathname.includes('/courses') ? '#111827' : '#6b7280', fontWeight: location.pathname.includes('/courses') ? 700 : 500, fontSize: "0.95rem", textDecoration: 'none' }}>Courses</Link>
            <Link to="/notes" style={{ color: location.pathname === '/notes' ? '#111827' : '#6b7280', fontWeight: location.pathname === '/notes' ? 700 : 500, fontSize: "0.95rem", textDecoration: 'none' }}>Browse Notes</Link>
            {token && (
              <>
                <Link to="/upload" style={{ color: location.pathname === '/upload' ? '#111827' : '#6b7280', fontWeight: location.pathname === '/upload' ? 700 : 500, fontSize: "0.95rem", textDecoration: 'none' }}>Upload Notes</Link>
                <Link to="/dashboard" style={{ color: location.pathname === '/dashboard' ? '#111827' : '#6b7280', fontWeight: location.pathname === '/dashboard' ? 700 : 500, fontSize: "0.95rem", textDecoration: 'none' }}>Dashboard</Link>
              </>
            )}
          </div>
        </div>

        {/* Search Bar */}
        <div className="mobile-search" style={{
          flex: 1,
          maxWidth: "350px",
          display: "flex",
          alignItems: "center",
          border: "1px solid #e5e7eb",
          borderRadius: "30px",
          padding: "0.3rem 0.8rem",
          background: "#fafafa"
        }}>
          <input
            type="text"
            placeholder="Search notes, subjects, unis..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            style={{
              border: "none",
              background: "transparent",
              outline: "none",
              width: "100%",
              padding: "0.3rem",
              fontSize: "0.85rem"
            }}
          />
          <svg onClick={handleSearch} style={{ color: '#e95e86', marginLeft: '0.5rem', cursor: 'pointer' }} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
        </div>

        {/* Right Section */}
        <div style={{ display: 'flex', alignItems: "center", gap: "1rem" }}>
          {/* Institution Dropdown (Visible on larger screens) */}
          <div ref={dropdownRef} className="hide-on-mobile" style={{ position: "relative" }}>
            <div onClick={() => setShowDropdown(!showDropdown)} style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              fontSize: "0.8rem",
              color: "#4b5563",
              border: "1px solid #e5e7eb",
              borderRadius: "20px",
              padding: "0.3rem 0.8rem",
              cursor: "pointer",
              userSelect: "none"
            }}>
              Find Institution
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ transform: showDropdown ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}>
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            </div>

            {/* Dropdown Menu */}
            {showDropdown && (
              <div style={{
                position: "absolute",
                top: "100%",
                left: 0,
                marginTop: "0.5rem",
                width: "220px",
                maxHeight: "300px",
                overflowY: "auto",
                backgroundColor: "#ffffff",
                border: "1px solid #e5e7eb",
                borderRadius: "12px",
                boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
                zIndex: 1000,
                display: "flex",
                flexDirection: "column",
              }}>
                {colleges.map((college, idx) => (
                  <div
                    key={college}
                    onClick={() => {
                      navigate(`/notes?university=${encodeURIComponent(college)}`);
                      setShowDropdown(false);
                    }}
                    style={{
                      padding: "0.8rem 1rem",
                      cursor: "pointer",
                      fontSize: "0.9rem",
                      color: "#111827",
                      borderBottom: idx !== colleges.length - 1 ? "1px solid #f3f4f6" : "none",
                      transition: "background 0.2s"
                    }}
                    onMouseEnter={(e) => e.target.style.background = "#f9fafb"}
                    onMouseLeave={(e) => e.target.style.background = "transparent"}
                  >
                    {college}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="hide-on-mobile" onClick={() => alert('No new notifications for you right now!')} style={{ color: "#4b5563", cursor: 'pointer' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
              <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
            </svg>
          </div>

          {/* Profile Dropdown or Login Button */}
          {token ? (
            <div ref={profileDropdownRef} style={{ position: 'relative' }}>
              <div 
                onClick={() => setShowProfileDropdown(!showProfileDropdown)} 
                style={{
                  width: "36px",
                  height: "36px",
                  borderRadius: "50%",
                  background: "linear-gradient(135deg, #e95e86, #6366f1)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "white",
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  cursor: "pointer",
                  userSelect: "none",
                  boxShadow: "0 4px 10px rgba(233,94,134,0.3)"
                }}
              >
                {userInitials}
              </div>

              {/* Profile Dropdown Menu */}
              {showProfileDropdown && (
                <div style={{
                  position: "absolute",
                  top: "100%",
                  right: 0,
                  marginTop: "0.75rem",
                  width: "240px",
                  backgroundColor: "#ffffff",
                  border: "1px solid #e5e7eb",
                  borderRadius: "16px",
                  boxShadow: "0 15px 35px rgba(0,0,0,0.15)",
                  zIndex: 1000,
                  padding: "1rem",
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.8rem"
                }}>
                  <div style={{ borderBottom: "1px solid #f3f4f6", paddingBottom: "0.75rem" }}>
                    <div style={{ fontWeight: 700, fontSize: "0.95rem", color: "#111827" }}>{user?.name || "Demo User"}</div>
                    <div style={{ fontSize: "0.8rem", color: "#6b7280", marginTop: "2px", overflow: "hidden", textOverflow: "ellipsis" }}>{user?.email || "demo@gmail.com"}</div>
                  </div>
                  
                  <Link 
                    to="/profile" 
                    onClick={() => setShowProfileDropdown(false)}
                    style={{ 
                      color: "#374151", 
                      textDecoration: "none", 
                      fontSize: "0.9rem", 
                      fontWeight: 500,
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem"
                    }}
                  >
                    <span>👤</span> My Profile
                  </Link>

                  <Link 
                    to="/dashboard" 
                    onClick={() => setShowProfileDropdown(false)}
                    style={{ 
                      color: "#374151", 
                      textDecoration: "none", 
                      fontSize: "0.9rem", 
                      fontWeight: 500,
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem"
                    }}
                  >
                    <span>📊</span> My Dashboard
                  </Link>

                  <Link 
                    to="/upload" 
                    onClick={() => setShowProfileDropdown(false)}
                    style={{ 
                      color: "#374151", 
                      textDecoration: "none", 
                      fontSize: "0.9rem", 
                      fontWeight: 500,
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem"
                    }}
                  >
                    <span>📤</span> Upload Notes
                  </Link>

                  <button 
                    onClick={handleLogout}
                    style={{
                      marginTop: "0.4rem",
                      width: "100%",
                      padding: "0.5rem",
                      backgroundColor: "rgba(239,68,68,0.08)",
                      border: "1px solid rgba(239,68,68,0.2)",
                      color: "#ef4444",
                      borderRadius: "8px",
                      fontWeight: 600,
                      fontSize: "0.85rem",
                      cursor: "pointer",
                      transition: "background 0.2s"
                    }}
                    onMouseEnter={(e) => e.target.style.backgroundColor = "rgba(239,68,68,0.15)"}
                    onMouseLeave={(e) => e.target.style.backgroundColor = "rgba(239,68,68,0.08)"}
                  >
                    Log Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login" style={{ textDecoration: 'none' }}>
              <button style={{
                padding: "0.45rem 1.2rem",
                borderRadius: "30px",
                border: "none",
                background: "#e95e86",
                color: "white",
                fontWeight: 600,
                fontSize: "0.85rem",
                cursor: "pointer",
                boxShadow: "0 4px 10px rgba(233,94,134,0.3)"
              }}>
                Sign In
              </button>
            </Link>
          )}
        </div>
      </nav>
    </div>

    {/* Mobile Glassmorphic Bottom Navigation Bar */}
    <div className="mobile-bottom-bar">
      <Link to="/home" className={`mobile-bottom-bar-link ${location.pathname === '/home' ? 'active' : ''}`}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
          <polyline points="9 22 9 12 15 12 15 22" />
        </svg>
        <span>Home</span>
      </Link>
      
      <Link to="/courses" className={`mobile-bottom-bar-link ${location.pathname.startsWith('/courses') ? 'active' : ''}`}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
          <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
        </svg>
        <span>Courses</span>
      </Link>

      <Link to="/notes" className={`mobile-bottom-bar-link ${location.pathname === '/notes' ? 'active' : ''}`}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        <span>Browse</span>
      </Link>

      <Link to={token ? "/upload" : "/login"} className={`mobile-bottom-bar-link ${location.pathname === '/upload' ? 'active' : ''}`}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <polyline points="17 8 12 3 7 8" />
          <line x1="12" y1="3" x2="12" y2="15" />
        </svg>
        <span>Upload</span>
      </Link>

      {token ? (
        <Link to="/profile" className={`mobile-bottom-bar-link ${location.pathname === '/profile' ? 'active' : ''}`}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </svg>
          <span>Profile</span>
        </Link>
      ) : (
        <Link to="/login" className={`mobile-bottom-bar-link ${location.pathname === '/login' ? 'active' : ''}`}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
            <polyline points="10 17 15 12 10 7" />
            <line x1="15" y1="12" x2="3" y2="12" />
          </svg>
          <span>Sign In</span>
        </Link>
      )}
    </div>
    </>
  );
}

export default Navbar;
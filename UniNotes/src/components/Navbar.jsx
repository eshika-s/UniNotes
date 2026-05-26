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

  const isActive = (path) => {
    if (path === '/home') return location.pathname === '/home';
    return location.pathname.startsWith(path);
  };

  const navLinkStyle = (path) => ({
    color: isActive(path) ? '#ffffff' : '#9ca3af',
    fontWeight: isActive(path) ? 600 : 400,
    fontSize: "0.88rem",
    textDecoration: 'none',
    position: 'relative',
    padding: '0.2rem 0',
    borderBottom: isActive(path) ? '2px solid var(--primary)' : '2px solid transparent',
    transition: 'color 0.2s, border-color 0.2s',
  });

  return (
    <>
      <div style={{
        position: 'sticky',
        top: '0px',
        zIndex: 100,
        display: "flex",
        justifyContent: "center",
        width: "100%",
        padding: "0",
        pointerEvents: "none"
      }}>
        <nav className="mobile-nav" style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          background: "var(--accent)",
          padding: "0.8rem 4rem",
          borderRadius: "0px",
          width: "100%",
          maxWidth: "100%",
          borderBottom: "1px solid rgba(255, 255, 255, 0.06)",
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.15)",
          pointerEvents: "auto",
          gap: "1.5rem"
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "1.75rem" }}>
            {/* Logo */}
            <Link to="/home" style={{ textDecoration: "none" }} className="mobile-nav-logo">
              <h2 style={{ margin: 0, fontSize: '1.3rem', fontWeight: 800, fontFamily: 'Inter, system-ui, sans-serif', letterSpacing: '-0.3px' }}>
                <span style={{ color: '#ffffff' }}>Uni</span>
                <span style={{ color: 'var(--primary)' }}>Notes</span>
              </h2>
            </Link>

            {/* Nav Links */}
            <div className="hide-on-mobile" style={{ display: 'flex', gap: '1.5rem', alignItems: "center" }}>
              <Link to="/home" style={navLinkStyle('/home')}>Home</Link>
              <Link to="/courses" style={navLinkStyle('/courses')}>Courses</Link>
              <Link to="/notes" style={navLinkStyle('/notes')}>Browse</Link>
              {token && (
                <>
                  <Link to="/upload" style={navLinkStyle('/upload')}>Upload</Link>
                  <Link to="/dashboard" style={navLinkStyle('/dashboard')}>Dashboard</Link>
                </>
              )}
            </div>
          </div>

          {/* Search Bar */}
          <div className="mobile-search" style={{
            flex: 1,
            maxWidth: "300px",
            display: "flex",
            alignItems: "center",
            border: "1px solid rgba(255, 255, 255, 0.08)",
            borderRadius: "0px",
            padding: "0.25rem 0.7rem",
            background: "rgba(0, 0, 0, 0.25)"
          }}>
            <svg style={{ color: '#494d5f', marginRight: '0.4rem', flexShrink: 0 }} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            <input
              type="text"
              placeholder="Search notes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              style={{
                border: "none",
                background: "transparent",
                outline: "none",
                width: "100%",
                padding: "0.3rem 0",
                fontSize: "0.82rem",
                color: "#ffffff",
              }}
            />
          </div>

          {/* Right Section */}
          <div style={{ display: 'flex', alignItems: "center", gap: "0.75rem" }}>
            {/* Institution Dropdown */}
            <div ref={dropdownRef} className="hide-on-mobile" style={{ position: "relative" }}>
              <div onClick={() => setShowDropdown(!showDropdown)} style={{
                display: "flex",
                alignItems: "center",
                gap: "0.4rem",
                fontSize: "0.78rem",
                color: "#6b7280",
                border: "1px solid #ebedf0",
                borderRadius: "8px",
                padding: "0.3rem 0.65rem",
                cursor: "pointer",
                userSelect: "none",
                transition: "border-color 0.15s",
              }}>
                Institutions
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ transform: showDropdown ? 'rotate(180deg)' : 'none', transition: 'transform 0.15s' }}>
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
              </div>

              {showDropdown && (
                <div style={{
                  position: "absolute",
                  top: "100%",
                  left: 0,
                  marginTop: "0.4rem",
                  width: "200px",
                  maxHeight: "260px",
                  overflowY: "auto",
                  backgroundColor: "#ffffff",
                  border: "1px solid #ebedf0",
                  borderRadius: "10px",
                  boxShadow: "0 8px 24px rgba(0,0,0,0.1)",
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
                        padding: "0.6rem 0.85rem",
                        cursor: "pointer",
                        fontSize: "0.82rem",
                        color: "#374151",
                        borderBottom: idx !== colleges.length - 1 ? "1px solid #f3f4f6" : "none",
                        transition: "background 0.15s"
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

            {/* Profile Dropdown or Login Button */}
            {token ? (
              <div ref={profileDropdownRef} style={{ position: 'relative' }}>
                <div 
                  onClick={() => setShowProfileDropdown(!showProfileDropdown)} 
                  style={{
                    width: "34px",
                    height: "34px",
                    borderRadius: "0px",
                    background: "var(--primary)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "white",
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    cursor: "pointer",
                    userSelect: "none",
                  }}
                >
                  {userInitials}
                </div>

                {showProfileDropdown && (
                  <div style={{
                    position: "absolute",
                    top: "100%",
                    right: 0,
                    marginTop: "0.5rem",
                    width: "220px",
                    backgroundColor: "#ffffff",
                    border: "1px solid #ebedf0",
                    borderRadius: "0px",
                    boxShadow: "0 10px 28px rgba(0,0,0,0.12)",
                    zIndex: 1000,
                    padding: "0.75rem",
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.5rem"
                  }}>
                    <div style={{ borderBottom: "1px solid #f3f4f6", paddingBottom: "0.6rem" }}>
                      <div style={{ fontWeight: 600, fontSize: "0.88rem", color: "#111827" }}>{user?.name || "Demo User"}</div>
                      <div style={{ fontSize: "0.75rem", color: "#9ca3af", marginTop: "1px", overflow: "hidden", textOverflow: "ellipsis" }}>{user?.email || "demo@gmail.com"}</div>
                    </div>
                    
                    {[
                      { label: "My Profile", to: "/profile", icon: "→" },
                      { label: "Dashboard", to: "/dashboard", icon: "→" },
                      { label: "Upload Notes", to: "/upload", icon: "→" },
                    ].map((item, i) => (
                      <Link 
                        key={i}
                        to={item.to} 
                        onClick={() => setShowProfileDropdown(false)}
                        style={{ 
                          color: "#4b5563", 
                          textDecoration: "none", 
                          fontSize: "0.84rem", 
                          fontWeight: 500,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          padding: "0.35rem 0.5rem",
                          borderRadius: "0px",
                          transition: "background 0.15s",
                        }}
                        onMouseEnter={e => e.currentTarget.style.background = "#f9fafb"}
                        onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                      >
                        {item.label}
                        <span style={{ color: '#d1d5db', fontSize: '0.75rem' }}>{item.icon}</span>
                      </Link>
                    ))}

                    <button 
                      onClick={handleLogout}
                      style={{
                        marginTop: "0.2rem",
                        width: "100%",
                        padding: "0.45rem",
                        backgroundColor: "#fef2f2",
                        border: "1px solid #fecaca",
                        color: "#dc2626",
                        borderRadius: "0px",
                        fontWeight: 600,
                        fontSize: "0.82rem",
                        cursor: "pointer",
                        transition: "background 0.15s"
                      }}
                      onMouseEnter={(e) => e.target.style.backgroundColor = "#fee2e2"}
                      onMouseLeave={(e) => e.target.style.backgroundColor = "#fef2f2"}
                    >
                      Log Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/register" style={{ textDecoration: 'none' }}>
                <button
                  style={{
                    padding: "0.45rem 1.4rem",
                    borderRadius: "0px",
                    border: "none",
                    background: "var(--primary)",
                    color: "#ffffff",
                    fontWeight: 600,
                    fontSize: "0.85rem",
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                    boxShadow: "0 2px 8px rgba(193, 68, 14, 0.2)"
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "var(--primary-hover)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "var(--primary)";
                  }}
                >
                  Sign up
                </button>
              </Link>
            )}
          </div>
        </nav>
      </div>

    {/* Mobile Bottom Navigation */}
    <div className="mobile-bottom-bar">
      <Link to="/home" className={`mobile-bottom-bar-link ${location.pathname === '/home' ? 'active' : ''}`}>
        <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
          <polyline points="9 22 9 12 15 12 15 22" />
        </svg>
        <span>Home</span>
      </Link>
      
      <Link to="/courses" className={`mobile-bottom-bar-link ${location.pathname.startsWith('/courses') ? 'active' : ''}`}>
        <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
          <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
        </svg>
        <span>Courses</span>
      </Link>

      <Link to="/notes" className={`mobile-bottom-bar-link ${location.pathname === '/notes' ? 'active' : ''}`}>
        <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        <span>Browse</span>
      </Link>

      <Link to={token ? "/upload" : "/login"} className={`mobile-bottom-bar-link ${location.pathname === '/upload' ? 'active' : ''}`}>
        <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <polyline points="17 8 12 3 7 8" />
          <line x1="12" y1="3" x2="12" y2="15" />
        </svg>
        <span>Upload</span>
      </Link>

      {token ? (
        <Link to="/profile" className={`mobile-bottom-bar-link ${location.pathname === '/profile' ? 'active' : ''}`}>
          <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </svg>
          <span>Profile</span>
        </Link>
      ) : (
        <Link to="/login" className={`mobile-bottom-bar-link ${location.pathname === '/login' ? 'active' : ''}`}>
          <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
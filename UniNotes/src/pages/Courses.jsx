import { Link } from "react-router-dom";

const courses = [
  { id: "cse", name: "Computer Science", code: "CSE", icon: "💻", description: "DSA, OS, DBMS, Networks, AI/ML" },
  { id: "ece", name: "Electronics & Comm.", code: "ECE", icon: "📡", description: "Signals, Microprocessors, VLSI, Comm Systems" },
  { id: "me", name: "Mechanical Engg.", code: "ME", icon: "⚙️", description: "Thermodynamics, Fluid Mechanics, CAD, Robotics" },
  { id: "ce", name: "Civil Engg.", code: "CE", icon: "🏗️", description: "Structural Analysis, Surveying, Concrete Tech" },
  { id: "it", name: "Information Tech.", code: "IT", icon: "🌐", description: "Web Dev, Cloud Computing, Cyber Security" },
  { id: "ee", name: "Electrical Engg.", code: "EE", icon: "⚡", description: "Power Systems, Control Systems, Machines" },
];

function Courses() {
  return (
    <div className="container fade-in">
      <div style={{ textAlign: "center", marginBottom: "3rem" }}>
        <h2 style={{ fontSize: "2.5rem", marginBottom: "0.5rem" }}>B.Tech <span className="gradient-text">Courses</span></h2>
        <p style={{ color: "#94a3b8", fontSize: "1.1rem" }}>Find notes organized by your engineering branch</p>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '2rem'
      }}>
        {courses.map((course, index) => (
          <Link to={`/courses/${course.id}`} key={course.id} style={{ animationDelay: `${index * 0.1}s` }} className="fade-in">
            <div className="glass-panel" style={{
              padding: '2rem',
              borderRadius: '16px',
              transition: 'transform 0.2s, box-shadow 0.2s, border-color 0.2s',
              cursor: 'pointer',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center'
            }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-5px)';
                e.currentTarget.style.boxShadow = '0 10px 30px -10px rgba(233, 94, 134, 0.3)';
                e.currentTarget.style.borderColor = 'rgba(233, 94, 134, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
                e.currentTarget.style.borderColor = 'var(--border-color)';
              }}
            >
              <div style={{ fontSize: '3rem', marginBottom: '1rem', background: 'rgba(255,255,255,0.05)', width: '80px', height: '80px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%' }}>
                {course.icon}
              </div>
              <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem', color: '#f8fafc' }}>{course.name}</h3>
              <div style={{ padding: '0.2rem 0.8rem', background: 'rgba(233, 94, 134, 0.2)', color: '#fca5a5', borderRadius: '999px', fontSize: '0.8rem', fontWeight: '600', marginBottom: '1rem' }}>
                {course.code}
              </div>
              <p style={{ color: '#94a3b8', fontSize: '0.9rem', lineHeight: '1.5' }}>
                {course.description}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default Courses;

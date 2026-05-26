import { Link } from "react-router-dom";

const courses = [
  { id: "cse", name: "Computer Science", code: "CSE", description: "DSA, OS, DBMS, Networks, AI/ML" },
  { id: "ece", name: "Electronics & Comm.", code: "ECE", description: "Signals, Microprocessors, VLSI, Comm Systems" },
  { id: "me", name: "Mechanical Engg.", code: "ME", description: "Thermodynamics, Fluid Mechanics, CAD, Robotics" },
  { id: "ce", name: "Civil Engg.", code: "CE", description: "Structural Analysis, Surveying, Concrete Tech" },
  { id: "it", name: "Information Tech.", code: "IT", description: "Web Dev, Cloud Computing, Cyber Security" },
  { id: "ee", name: "Electrical Engg.", code: "EE", description: "Power Systems, Control Systems, Machines" },
];

function Courses() {
  return (
    <div className="container fade-in" style={{ paddingTop: "1rem" }}>
      <div style={{ marginBottom: "2.5rem" }}>
        <div className="accent-bar" style={{ marginBottom: "0.75rem" }} />
        <h2 style={{ fontSize: "2rem", fontWeight: 800, marginBottom: "0.3rem", color: "var(--text)" }}>B.Tech Courses</h2>
        <p style={{ color: "var(--text-muted)", fontSize: "0.92rem" }}>Find notes organized by your engineering branch</p>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '1rem'
      }}>
        {courses.map((course) => (
          <Link to={`/courses/${course.id}`} key={course.id}>
            <div
              className="card"
              style={{
                padding: '1.75rem',
                borderRadius: '0px',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, margin: 0, color: 'var(--text)' }}>{course.name}</h3>
                <span style={{ padding: '0.15rem 0.6rem', background: 'var(--primary-subtle)', color: 'var(--primary)', border: '1px solid rgba(193, 68, 14, 0.15)', borderRadius: '0px', fontSize: '0.72rem', fontWeight: 600, flexShrink: 0 }}>
                  {course.code}
                </span>
              </div>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', lineHeight: '1.5', margin: 0, flex: 1 }}>
                {course.description}
              </p>
              <span style={{ marginTop: '1rem', color: 'var(--text-muted)', fontSize: '0.78rem', fontWeight: 600 }}>
                View subjects →
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default Courses;

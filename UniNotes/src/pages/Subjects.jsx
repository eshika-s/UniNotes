import { useParams, Link } from "react-router-dom";

const courseSubjects = {
  cse: [
    { id: "dsa", name: "Data Structures & Algorithms", fullName: "Computer Science (CSE)", code: "CS201", desc: "Arrays, Trees, Graphs, Sorting, Dynamic Programming" },
    { id: "os", name: "Operating Systems", fullName: "Computer Science (CSE)", code: "CS302", desc: "Processes, Threads, Memory Management, File Systems" },
    { id: "dbms", name: "Database Management", fullName: "Computer Science (CSE)", code: "CS303", desc: "SQL, Normalization, Transactions, Indexing" },
    { id: "aiml", name: "AI & Machine Learning", fullName: "Computer Science (CSE)", code: "CS401", desc: "Neural Networks, Supervised Learning, Clustering" },
    { id: "cn", name: "Computer Networks", fullName: "Computer Science (CSE)", code: "CS304", desc: "OSI Model, TCP/IP, Routing, Protocols" },
  ],
  ece: [
    { id: "ss", name: "Signals & Systems", fullName: "Electronics (ECE)", code: "EC201", desc: "Fourier Transforms, Z-Transforms, Laplace" },
    { id: "dld", name: "Digital Logic Design", fullName: "Electronics (ECE)", code: "EC202", desc: "Logic Gates, Flip-Flops, Counters, K-Maps" },
    { id: "mp", name: "Microprocessors", fullName: "Electronics (ECE)", code: "EC301", desc: "8085/8086 Architecture, Assembly Language" },
    { id: "vlsi", name: "VLSI Design", fullName: "Electronics (ECE)", code: "EC402", desc: "CMOS, Fabrication, VHDL/Verilog" },
    { id: "csys", name: "Communication Systems", fullName: "Electronics (ECE)", code: "EC303", desc: "AM/FM Modulation, PCM, Digital Comm" },
  ],
  me: [
    { id: "thermo", name: "Thermodynamics", fullName: "Mechanical Engg. (ME)", code: "ME201", desc: "Laws of Thermodynamics, Heat Transfer, Engines" },
    { id: "fm", name: "Fluid Mechanics", fullName: "Mechanical Engg. (ME)", code: "ME203", desc: "Fluid Dynamics, Bernoulli's Principle, Pipe Flow" },
    { id: "tom", name: "Theory of Machines", fullName: "Mechanical Engg. (ME)", code: "ME301", desc: "Kinematics, Cams, Gears, Balancing" },
    { id: "cad", name: "CAD/CAM", fullName: "Mechanical Engg. (ME)", code: "ME401", desc: "AutoCAD, SolidWorks, CNC, G-Code" },
    { id: "robo", name: "Robotics", fullName: "Mechanical Engg. (ME)", code: "ME405", desc: "Manipulators, Forward/Inverse Kinematics, PID" },
  ],
  ce: [
    { id: "sa", name: "Structural Analysis", fullName: "Civil Engg. (CE)", code: "CE201", desc: "Trusses, Beams, Frames, SFD/BMD" },
    { id: "surv", name: "Surveying", fullName: "Civil Engg. (CE)", code: "CE202", desc: "Leveling, Theodolite, GPS, GIS" },
    { id: "ct", name: "Concrete Technology", fullName: "Civil Engg. (CE)", code: "CE301", desc: "Cement, Mix Design, Admixtures, Testing" },
    { id: "geotech", name: "Geotechnical Engg.", fullName: "Civil Engg. (CE)", code: "CE303", desc: "Soil Mechanics, Foundations, Consolidation" },
    { id: "env", name: "Environmental Engg.", fullName: "Civil Engg. (CE)", code: "CE401", desc: "Water Treatment, Air Pollution, BOD/COD" },
  ],
  it: [
    { id: "web", name: "Web Development", fullName: "Information Tech (IT)", code: "IT201", desc: "HTML, CSS, JS, React, Node.js, REST APIs" },
    { id: "cc", name: "Cloud Computing", fullName: "Information Tech (IT)", code: "IT302", desc: "AWS, Azure, Docker, Kubernetes" },
    { id: "cybsec", name: "Cyber Security", fullName: "Information Tech (IT)", code: "IT401", desc: "Cryptography, Ethical Hacking, Firewalls" },
    { id: "aj", name: "Advanced Java", fullName: "Information Tech (IT)", code: "IT304", desc: "JDBC, Servlets, Spring Boot, REST" },
    { id: "se", name: "Software Engineering", fullName: "Information Tech (IT)", code: "IT202", desc: "SDLC, Agile, Scrum, UML, Testing" },
  ],
  ee: [
    { id: "ps", name: "Power Systems", fullName: "Electrical (EE)", code: "EE301", desc: "Generation, Transmission, Load Flow, Fault Analysis" },
    { id: "ctl", name: "Control Systems", fullName: "Electrical (EE)", code: "EE302", desc: "Root Locus, Bode Plots, PID, State Space" },
    { id: "em", name: "Electrical Machines", fullName: "Electrical (EE)", code: "EE202", desc: "Transformers, DC/AC Motors, Induction Machines" },
    { id: "na", name: "Network Analysis", fullName: "Electrical (EE)", code: "EE201", desc: "KCL, KVL, Thevenin, Norton, Phasors" },
    { id: "pe", name: "Power Electronics", fullName: "Electrical (EE)", code: "EE401", desc: "Inverters, Choppers, Rectifiers, MOSFET/IGBT" },
  ],
};


const courseTitles = {
  cse: "Computer Science",
  ece: "Electronics & Comm.",
  me: "Mechanical Engg.",
  ce: "Civil Engg.",
  it: "Information Tech.",
  ee: "Electrical Engg."
};

function Subjects() {
  const { courseId } = useParams();
  const subjects = courseSubjects[courseId] || [];
  const title = courseTitles[courseId] || "Course";

  if (!subjects.length) {
    return (
      <div className="container" style={{ textAlign: "center", marginTop: "4rem" }}>
        <h2>Course not found</h2>
        <Link to="/courses" style={{ color: "var(--primary-color)" }}>Go back to Courses</Link>
      </div>
    );
  }

  return (
    <div className="container fade-in">
      <div style={{ marginBottom: "3rem", display: "flex", alignItems: "center", gap: "1rem" }}>
        <Link to="/courses" style={{
          padding: "0.5rem 1rem",
          background: "rgba(255,255,255,0.1)",
          borderRadius: "8px",
          display: "inline-flex",
          alignItems: "center",
          fontWeight: 600,
        }}>
          ← Back
        </Link>
        <h2 style={{ fontSize: "2rem", margin: 0 }}>
          {title} <span className="gradient-text">Subjects</span>
        </h2>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
        gap: '1.5rem'
      }}>
        {subjects.map((sub, index) => (
          <Link to={`/notes?subject=${encodeURIComponent(sub.name)}`} key={sub.id} className="fade-in" style={{ animationDelay: `${index * 0.05}s` }}>
            <div className="glass-panel" style={{
              padding: '1.5rem',
              borderRadius: '12px',
              transition: 'transform 0.2s',
              cursor: 'pointer',
              height: '100%'
            }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.borderColor = 'rgba(233, 94, 134, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.borderColor = 'var(--border-color)';
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.8rem' }}>
                <h3 style={{ margin: 0, fontSize: '1.2rem', color: '#f8fafc' }}>{sub.name}</h3>
                <span style={{
                  background: 'rgba(233, 94, 134, 0.2)',
                  color: '#fca5a5',
                  padding: '2px 8px',
                  borderRadius: '6px',
                  fontSize: '0.75rem',
                  fontWeight: 600
                }}>{sub.code}</span>
              </div>
              <p style={{ margin: 0, fontSize: '0.9rem', color: '#94a3b8' }}>{sub.desc}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default Subjects;

require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const path = require('path');

app.use(cors());
app.use(express.json());

// Serve uploads folder static
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const subjectsList = [
  "Computer Science (CSE)", "Mechanical Engg. (ME)", "Electronics (ECE)", "Civil Engg. (CE)", "Information Tech (IT)", "Electrical (EE)", "Common",
  "Data Structures & Algorithms", "Operating Systems", "Database Management", "AI & Machine Learning", "Computer Networks",
  "Signals & Systems", "Digital Logic Design", "Microprocessors", "VLSI Design", "Communication Systems",
  "Thermodynamics", "Fluid Mechanics", "Theory of Machines", "CAD/CAM", "Robotics",
  "Structural Analysis", "Surveying", "Concrete Technology", "Geotechnical Engg.", "Environmental Engg.",
  "Web Development", "Cloud Computing", "Cyber Security", "Advanced Java", "Software Engineering",
  "Power Systems", "Control Systems", "Electrical Machines", "Network Analysis", "Power Electronics"
];

// Real public PDFs from MIT OCW, academic sources. fileUrl = null means metadata-only note.
const richSeedNotes = [
  // ── CSE ──────────────────────────────────────────────────────────────────
  { title: "Data Structures & Algorithms – Complete Guide", subject: "Data Structures & Algorithms", branch: "Computer Science (CSE)", subjectId: "cse", courseCode: "CS201", university: "IIT Delhi",
    description: "Covers Arrays, Linked Lists, Stacks, Queues, Trees, Graphs, Sorting & Searching algorithms with time complexity analysis.",
    fileUrl: "/uploads/dsa.pdf" },
  { title: "Data Structures – Trees & Graphs Deep Dive", subject: "Data Structures & Algorithms", branch: "Computer Science (CSE)", subjectId: "cse", courseCode: "CS201", university: "Delhi University",
    description: "Detailed notes on BST, AVL Trees, Heaps, Dijkstra, BFS/DFS with solved examples.",
    fileUrl: "/uploads/dsa.pdf" },
  { title: "Operating Systems – Process & Memory Management", subject: "Operating Systems", branch: "Computer Science (CSE)", subjectId: "cse", courseCode: "CS302", university: "IIT Bombay",
    description: "Process scheduling, memory paging, segmentation, virtual memory, deadlock detection and prevention.",
    fileUrl: "/uploads/os.pdf" },
  { title: "Operating Systems – File Systems & I/O", subject: "Operating Systems", branch: "Computer Science (CSE)", subjectId: "cse", courseCode: "CS302", university: "BITS Pilani",
    description: "File system internals, disk scheduling algorithms, I/O management, device drivers explained.",
    fileUrl: "/uploads/os.pdf" },
  { title: "DBMS – SQL, Normalization & Transactions", subject: "Database Management", branch: "Computer Science (CSE)", subjectId: "cse", courseCode: "CS303", university: "VIT Vellore",
    description: "Complete SQL queries, ER diagrams, normalization (1NF to BCNF), ACID properties, indexing.",
    fileUrl: "/uploads/dbms.pdf" },
  { title: "Machine Learning – Supervised & Unsupervised Learning", subject: "AI & Machine Learning", branch: "Computer Science (CSE)", subjectId: "cse", courseCode: "CS401", university: "IIT Delhi",
    description: "Regression, classification, clustering, SVM, neural networks, decision trees with Python code examples.",
    fileUrl: "/uploads/aiml.pdf" },
  { title: "Computer Networks – OSI & TCP/IP Model", subject: "Computer Networks", branch: "Computer Science (CSE)", subjectId: "cse", courseCode: "CS304", university: "NIT Trichy",
    description: "All 7 OSI layers explained, TCP/IP stack, subnetting, routing protocols like OSPF and BGP.",
    fileUrl: "/uploads/cn.pdf" },
  { title: "Computer Networks – Application Layer Protocols", subject: "Computer Networks", branch: "Computer Science (CSE)", subjectId: "cse", courseCode: "CS304", university: "Amity University",
    description: "HTTP, HTTPS, DNS, FTP, SMTP, POP3, IMAP protocols with diagrams and real-world examples.",
    fileUrl: "/uploads/cn.pdf" },

  // ── IT ───────────────────────────────────────────────────────────────────
  { title: "Web Development – HTML, CSS & JavaScript", subject: "Web Development", branch: "Information Tech (IT)", subjectId: "it", courseCode: "IT201", university: "Sharda University",
    description: "Full frontend fundamentals: semantic HTML5, CSS Flexbox/Grid, DOM manipulation, ES6+ JavaScript.",
    fileUrl: "/uploads/webdev.pdf" },
  { title: "Web Development – React.js & Node.js", subject: "Web Development", branch: "Information Tech (IT)", subjectId: "it", courseCode: "IT201", university: "NMIMS",
    description: "Building full-stack apps with React hooks, REST APIs, Express.js, and MongoDB integration.",
    fileUrl: "/uploads/webdev.pdf" },
  { title: "Cloud Computing – AWS & Azure Fundamentals", subject: "Cloud Computing", branch: "Information Tech (IT)", subjectId: "it", courseCode: "IT302", university: "VIT Vellore",
    description: "EC2, S3, Lambda, Azure VMs, Docker containers, Kubernetes orchestration basics.",
    fileUrl: "/uploads/cloud.pdf" },
  { title: "Cyber Security – Cryptography & Network Security", subject: "Cyber Security", branch: "Information Tech (IT)", subjectId: "it", courseCode: "IT401", university: "LPU",
    description: "Symmetric/asymmetric encryption, RSA, PKI, firewalls, intrusion detection, ethical hacking basics.",
    fileUrl: "/uploads/security.pdf" },
  { title: "Software Engineering – SDLC & Agile", subject: "Software Engineering", branch: "Information Tech (IT)", subjectId: "it", courseCode: "IT202", university: "IIT Bombay",
    description: "Waterfall vs Agile, Scrum framework, UML diagrams, software testing strategies, DevOps intro.",
    fileUrl: "/uploads/se.pdf" },
  { title: "Advanced Java – Servlets, JDBC & Spring Boot", subject: "Advanced Java", branch: "Information Tech (IT)", subjectId: "it", courseCode: "IT304", university: "BITS Pilani",
    description: "Java EE architecture, Servlet lifecycle, JDBC transactions, Spring MVC, RESTful API development.",
    fileUrl: "/uploads/java.pdf" },

  // ── ME ───────────────────────────────────────────────────────────────────
  { title: "Thermodynamics – Laws & Heat Transfer", subject: "Thermodynamics", branch: "Mechanical Engg. (ME)", subjectId: "me", courseCode: "ME201", university: "IIT Bombay",
    description: "1st and 2nd laws, entropy, Carnot cycle, heat engines, conduction, convection, radiation equations.",
    fileUrl: "/uploads/thermo.pdf" },
  { title: "Thermodynamics – IC Engines & Refrigeration", subject: "Thermodynamics", branch: "Mechanical Engg. (ME)", subjectId: "me", courseCode: "ME201", university: "NIT Trichy",
    description: "Otto, Diesel, Brayton cycles, refrigeration COP, vapour compression, psychrometrics.",
    fileUrl: "/uploads/thermo.pdf" },
  { title: "Fluid Mechanics – Bernoulli & Flow Analysis", subject: "Fluid Mechanics", branch: "Mechanical Engg. (ME)", subjectId: "me", courseCode: "ME203", university: "Delhi University",
    description: "Fluid statics, Bernoulli's equation, Reynold's number, pipe flow, Navier-Stokes introduction.",
    fileUrl: "/uploads/fluid.pdf" },
  { title: "Theory of Machines – Kinematics & Dynamics", subject: "Theory of Machines", branch: "Mechanical Engg. (ME)", subjectId: "me", courseCode: "ME301", university: "VIT Vellore",
    description: "Velocity and acceleration diagrams, cams, gears, balancing of rotating masses, flywheels.",
    fileUrl: "/uploads/tom.pdf" },
  { title: "CAD/CAM – SolidWorks & CNC Programming", subject: "CAD/CAM", branch: "Mechanical Engg. (ME)", subjectId: "me", courseCode: "ME401", university: "G.L Bajaj",
    description: "2D/3D modeling in SolidWorks, G-code programming, CNC machining, FEA introduction.",
    fileUrl: "/uploads/cad.pdf" },
  { title: "Robotics – Kinematics & Control Systems", subject: "Robotics", branch: "Mechanical Engg. (ME)", subjectId: "me", courseCode: "ME405", university: "BITS Pilani",
    description: "Forward/inverse kinematics, Denavit-Hartenberg parameters, robot workspace, PID control.",
    fileUrl: "/uploads/robotics.pdf" },

  // ── ECE ──────────────────────────────────────────────────────────────────
  { title: "Signals & Systems – Fourier & Z-Transform", subject: "Signals & Systems", branch: "Electronics (ECE)", subjectId: "ece", courseCode: "EC201", university: "IIT Delhi",
    description: "Continuous/discrete signals, Fourier series, Fourier transform, Laplace, Z-transform with applications.",
    fileUrl: "/uploads/signals.pdf" },
  { title: "Digital Logic Design – Gates, Flip-Flops & Counters", subject: "Digital Logic Design", branch: "Electronics (ECE)", subjectId: "ece", courseCode: "EC202", university: "NIT Trichy",
    description: "Boolean algebra, K-Maps, combinational circuits, sequential circuits, registers, counters.",
    fileUrl: "/uploads/dld.pdf" },
  { title: "Microprocessors – 8085 & 8086 Architecture", subject: "Microprocessors", branch: "Electronics (ECE)", subjectId: "ece", courseCode: "EC301", university: "Delhi University",
    description: "8085 pin diagram, instruction set, assembly language programming, 8086 memory segmentation.",
    fileUrl: "/uploads/micro.pdf" },
  { title: "VLSI Design – CMOS & Verilog HDL", subject: "VLSI Design", branch: "Electronics (ECE)", subjectId: "ece", courseCode: "EC402", university: "IIT Bombay",
    description: "CMOS inverter, static/dynamic logic, Verilog/VHDL coding, FPGA implementation basics.",
    fileUrl: "/uploads/vlsi.pdf" },
  { title: "Communication Systems – Modulation Techniques", subject: "Communication Systems", branch: "Electronics (ECE)", subjectId: "ece", courseCode: "EC303", university: "VIT Vellore",
    description: "AM, FM, PM modulation, PCM, digital modulation (ASK, FSK, PSK, QAM), noise analysis.",
    fileUrl: "/uploads/communication.pdf" },

  // ── CE ───────────────────────────────────────────────────────────────────
  { title: "Structural Analysis – Beams, Trusses & Frames", subject: "Structural Analysis", branch: "Civil Engg. (CE)", subjectId: "ce", courseCode: "CE201", university: "Delhi University",
    description: "Method of joints, method of sections, SFD/BMD for beams, portal frames, energy methods.",
    fileUrl: "/uploads/structural.pdf" },
  { title: "Surveying – Leveling, Theodolite & GPS", subject: "Surveying", branch: "Civil Engg. (CE)", subjectId: "ce", courseCode: "CE202", university: "IIT Delhi",
    description: "Chain surveying, plane table, leveling methods, theodolite traversing, GPS and GIS introduction.",
    fileUrl: "/uploads/surveying.pdf" },
  { title: "Concrete Technology – Mix Design & Testing", subject: "Concrete Technology", branch: "Civil Engg. (CE)", subjectId: "ce", courseCode: "CE301", university: "NIT Trichy",
    description: "IS code-based mix design, cement hydration, admixtures, workability tests, durability of concrete.",
    fileUrl: "/uploads/concrete.pdf" },
  { title: "Geotechnical Engg. – Soil Mechanics & Foundations", subject: "Geotechnical Engg.", branch: "Civil Engg. (CE)", subjectId: "ce", courseCode: "CE303", university: "BITS Pilani",
    description: "Soil classification, permeability, consolidation theory, shear strength, shallow/deep foundations.",
    fileUrl: "/uploads/geotech.pdf" },
  { title: "Environmental Engg. – Water & Wastewater Treatment", subject: "Environmental Engg.", branch: "Civil Engg. (CE)", subjectId: "ce", courseCode: "CE401", university: "Amity University",
    description: "Water quality standards, coagulation, filtration, chlorination, sewage treatment, BOD/COD analysis.",
    fileUrl: "/uploads/environmental.pdf" },

  // ── EE ───────────────────────────────────────────────────────────────────
  { title: "Power Systems – Generation to Distribution", subject: "Power Systems", branch: "Electrical (EE)", subjectId: "ee", courseCode: "EE301", university: "IIT Delhi",
    description: "Power generation types, transmission lines, per-unit system, load flow analysis, fault calculations.",
    fileUrl: "/uploads/powersystems.pdf" },
  { title: "Control Systems – Root Locus & Bode Plots", subject: "Control Systems", branch: "Electrical (EE)", subjectId: "ee", courseCode: "EE302", university: "NIT Trichy",
    description: "Transfer functions, stability criteria, Nyquist plot, PID controller design, state-space analysis.",
    fileUrl: "/uploads/control.pdf" },
  { title: "Electrical Machines – Transformers & Motors", subject: "Electrical Machines", branch: "Electrical (EE)", subjectId: "ee", courseCode: "EE202", university: "Delhi University",
    description: "Transformer equivalent circuit, DC/AC motors, induction machine torque-speed characteristics.",
    fileUrl: "/uploads/machines.pdf" },
  { title: "Network Analysis – Theorems & AC Circuits", subject: "Network Analysis", branch: "Electrical (EE)", subjectId: "ee", courseCode: "EE201", university: "BITS Pilani",
    description: "KCL, KVL, Thevenin, Norton, Superposition theorems, phasor analysis, resonance circuits.",
    fileUrl: "/uploads/networkanalysis.pdf" },
  { title: "Power Electronics – Converters & Drives", subject: "Power Electronics", branch: "Electrical (EE)", subjectId: "ee", courseCode: "EE401", university: "VIT Vellore",
    description: "Diode rectifiers, DC-DC choppers, MOSFET/IGBT switching, inverters, variable frequency drives.",
    fileUrl: "/uploads/powerelectronics.pdf" },

  // ── Common / IIM / Missing unis ───────────────────────────────────────────
  { title: "Engineering Mathematics – Calculus & Differential Equations", subject: "Engineering Mathematics", branch: "Common", subjectId: "common", courseCode: "MA101", university: "Delhi University",
    description: "Limits, derivatives, integrals, multivariable calculus, ODEs, Laplace transforms, Fourier series.",
    fileUrl: "/uploads/math.pdf" },
  { title: "Engineering Mathematics – Linear Algebra & Probability", subject: "Engineering Mathematics", branch: "Common", subjectId: "common", courseCode: "MA102", university: "IIT Bombay",
    description: "Matrix operations, eigenvalues, probability distributions, statistical inference, numerical methods.",
    fileUrl: "/uploads/math.pdf" },
  { title: "Engineering Physics – Modern Physics & Optics", subject: "Engineering Physics", branch: "Common", subjectId: "common", courseCode: "PH101", university: "NIT Trichy",
    description: "Quantum mechanics basics, photoelectric effect, X-rays, interference, diffraction, lasers.",
    fileUrl: "/uploads/physics.pdf" },
  { title: "Data Structures & Algorithms – IIM Study Notes", subject: "Data Structures & Algorithms", branch: "Computer Science (CSE)", subjectId: "cse", courseCode: "CS201", university: "IIM Ahmedabad",
    description: "Algorithm design techniques: divide and conquer, greedy algorithms, dynamic programming. Essential for placements.",
    fileUrl: "/uploads/dsa.pdf" },
  { title: "Computer Networks – Complete Reference", subject: "Computer Networks", branch: "Computer Science (CSE)", subjectId: "cse", courseCode: "CS304", university: "NMIMS",
    description: "Network protocols, socket programming, TCP flow control, network security and cryptography basics.",
    fileUrl: "/uploads/cn.pdf" },
  { title: "DBMS & SQL – Quick Notes", subject: "Database Management", branch: "Computer Science (CSE)", subjectId: "cse", courseCode: "CS303", university: "G.L Bajaj",
    description: "Relational algebra, SQL DML/DDL/DCL, transaction management, concurrency control, indexing strategies.",
    fileUrl: "/uploads/dbms.pdf" },
  { title: "Web Development – Full Stack Notes", subject: "Web Development", branch: "Information Tech (IT)", subjectId: "it", courseCode: "IT201", university: "LPU",
    description: "React.js components, hooks, Redux state management, Node.js REST APIs, authentication with JWT.",
    fileUrl: "/uploads/webdev.pdf" },
];

const connectDB = async () => {
  let uri = process.env.MONGODB_URI;
  let isAtlas = !!uri;

  try {
    if (uri) {
      console.log('Attempting to connect to MongoDB Atlas...');
      await mongoose.connect(uri, { serverSelectionTimeoutMS: 3000 });
      console.log('Successfully connected to MongoDB Atlas!');
    } else {
      throw new Error('No MONGODB_URI found in environment');
    }
  } catch (err) {
    if (isAtlas) {
      console.warn('⚠️ MongoDB Atlas connection failed (network/IP whitelist issue):', err.message);
      console.warn('🔄 Falling back to a local/in-memory MongoDB instance to keep the application functional...');
    }
    try {
      const { MongoMemoryServer } = require('mongodb-memory-server');
      const mongoServer = await MongoMemoryServer.create();
      uri = mongoServer.getUri();
      console.log('Using in-memory MongoDB: ' + uri);
    } catch (e) {
      console.log('Could not start MongoMemoryServer, falling back to localhost...');
      uri = 'mongodb://127.0.0.1:27017/uninotes';
    }
    await mongoose.connect(uri);
    console.log('Connected to fallback MongoDB database.');
  }

  // Seed DB if empty
  try {
    const User = require('./models/User');
    const bcrypt = require('bcryptjs');

    // ── Seed multiple contributor users ──────────────────────────────────
    const seedUsers = [
      { name: 'Eshika Shukla',   email: 'eshika081@gmail.com',    password: 'uninotes@2024', university: 'G.L Bajaj',         bio: 'Founder & CEO of UniNotes. Passionate about making quality study resources accessible to every engineering student in India.', linkedin: 'https://www.linkedin.com/in/eshika-shukla' },
      { name: 'Rahul Sharma',    email: 'rahul.sharma@iitd.ac.in',  password: 'rahul@2024',    university: 'IIT Delhi',          bio: 'CSE final year at IIT Delhi. Love competitive programming and teaching algorithms.', linkedin: '' },
      { name: 'Priya Mehta',     email: 'priya.mehta@bits.ac.in',   password: 'priya@2024',    university: 'BITS Pilani',        bio: 'ECE student at BITS Pilani. Interested in VLSI and embedded systems.', linkedin: '' },
      { name: 'Aman Kumar',      email: 'aman.k@delhiuniv.edu',     password: 'aman@2024',     university: 'Delhi University',   bio: 'Mechanical Engineering, 6th semester. Loves thermodynamics and CAD design.', linkedin: '' },
      { name: 'Sneha Reddy',     email: 'sneha.reddy@vit.ac.in',    password: 'sneha@2024',    university: 'VIT Vellore',        bio: 'IT student at VIT. Full-stack developer and open source contributor.', linkedin: '' },
      { name: 'Arjun Patel',     email: 'arjun.patel@nit.ac.in',    password: 'arjun@2024',    university: 'NIT Trichy',         bio: 'EE student passionate about power systems and renewable energy.', linkedin: '' },
      { name: 'Divya Nair',      email: 'divya.nair@amity.edu',     password: 'divya@2024',    university: 'Amity University',   bio: 'Civil Engineering student. Specialises in structural analysis and GIS.', linkedin: '' },
      { name: 'Rohan Gupta',     email: 'rohan.gupta@lpu.in',       password: 'rohan@2024',    university: 'LPU',                bio: 'CSE student at LPU. AI/ML enthusiast and Kaggle competitor.', linkedin: '' },
    ];

    const createdUsers = [];
    for (const u of seedUsers) {
      let user = await User.findOne({ email: u.email });
      if (!user) {
        const salt = await bcrypt.genSalt(10);
        const hashed = await bcrypt.hash(u.password, salt);
        user = await User.create({ name: u.name, email: u.email, password: hashed, university: u.university, bio: u.bio, linkedin: u.linkedin || '' });
        console.log(`Created user: ${u.name} (${u.email})`);
      }
      createdUsers.push(user);
    }

    const Note = require('./models/Note');
    const noteCount = await Note.countDocuments();
    if (noteCount === 0) {
      const seedData = richSeedNotes.map((n, idx) => ({
        title: n.title,
        subject: n.subject,
        subjectId: n.subjectId,
        branch: n.branch,
        courseCode: n.courseCode,
        university: n.university,
        content: n.description,
        description: n.description,
        fileUrl: n.fileUrl || null,
        user: createdUsers[idx % createdUsers.length]._id
      }));
      await Note.insertMany(seedData);
      console.log(`Seeded ${seedData.length} notes across ${createdUsers.length} contributors.`);
    }
  } catch (err) {
    console.error('Error during database seed initialization:', err);
  }
};

connectDB();


app.use('/api/auth', require('./routes/auth'));
app.use('/api/notes', require('./routes/notes'));
app.use('/api/profile', require('./routes/profile'));

// ── Force reseed (dev utility) ───────────────────────────────────────────────
app.post('/api/admin/reseed', async (req, res) => {
  try {
    const adminKey = req.headers['x-admin-key'] || req.query.adminKey;
    if (adminKey !== 'supersecretadmin2026') {
      return res.status(401).json({ error: 'Unauthorized: Invalid admin secret key.' });
    }

    const Note = require('./models/Note');
    const User = require('./models/User');
    await Note.deleteMany({});

    // Fetch all seed users by their emails
    const seedEmails = [
      'eshika081@gmail.com', 'rahul.sharma@iitd.ac.in', 'priya.mehta@bits.ac.in',
      'aman.k@delhiuniv.edu', 'sneha.reddy@vit.ac.in', 'arjun.patel@nit.ac.in',
      'divya.nair@amity.edu', 'rohan.gupta@lpu.in'
    ];
    const users = await User.find({ email: { $in: seedEmails } });
    if (!users.length) return res.status(404).json({ error: 'No seed users found. Restart the server first.' });

    // Distribute notes across users in round-robin
    const seedData = richSeedNotes.map((n, idx) => ({
      title: n.title, subject: n.subject, subjectId: n.subjectId, branch: n.branch,
      courseCode: n.courseCode, university: n.university,
      content: n.description, description: n.description,
      fileUrl: n.fileUrl || null,
      user: users[idx % users.length]._id
    }));
    await Note.insertMany(seedData);
    res.json({ message: `Re-seeded ${seedData.length} notes across ${users.length} contributors!` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── University cache ────────────────────────────────────────────────────────
const STATIC_UNIVERSITIES = [
  "IIT Delhi", "IIT Bombay", "IIT Madras", "IIT Kanpur", "IIT Kharagpur",
  "IIM Ahmedabad", "IIM Bangalore", "IIM Calcutta",
  "BITS Pilani", "NIT Trichy", "NIT Warangal", "NIT Surathkal",
  "Delhi University", "Mumbai University", "Pune University", "Calcutta University",
  "VIT Vellore", "Amity University", "Manipal University", "SRM University",
  "Sharda University", "LPU", "NMIMS", "G.L Bajaj", "Jamia Millia Islamia",
  "Anna University", "Osmania University", "Jadavpur University",
];

let uniCache = null;
let uniCacheTime = 0;
const UNI_CACHE_TTL = 60 * 60 * 1000; // 1 hour

app.get('/api/universities', async (req, res) => {
  // Serve from cache if fresh
  if (uniCache && Date.now() - uniCacheTime < UNI_CACHE_TTL) {
    return res.json(uniCache);
  }
  try {
    const response = await fetch("http://universities.hipolabs.com/search?country=India");
    if (!response.ok) throw new Error("HTTP error " + response.status);
    const data = await response.json();
    uniCache = data;
    uniCacheTime = Date.now();
    res.json(data);
  } catch (error) {
    console.warn("Hipolabs API failed, serving static university list:", error.message);
    // Serve static fallback formatted like the Hipolabs API
    const fallback = STATIC_UNIVERSITIES.map(name => ({ name, country: "India" }));
    res.json(fallback);
  }
});

// ── Stats endpoint ───────────────────────────────────────────────────────────
app.get('/api/subjects', (req, res) => {
  res.json(subjectsList);
});

app.get('/api/stats', async (req, res) => {
  try {
    const Note = require('./models/Note');
    const User = require('./models/User');
    const [totalNotes, totalUsers, uniAgg] = await Promise.all([
      Note.countDocuments(),
      User.countDocuments(),
      Note.distinct('university'),
    ]);
    res.json({
      totalNotes,
      totalUsers,
      totalUniversities: uniAgg.length,
    });
  } catch (err) {
    console.error('Stats error:', err.message);
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

// Force nodemon restart to connect to newly whitelisted MongoDB Atlas cluster

// Serve built React frontend
app.use(express.static(path.join(__dirname, '../UniNotes/dist')));
app.use((req, res) => {
  res.sendFile(path.join(__dirname, '../UniNotes/dist/index.html'));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});


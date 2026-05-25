const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

const UPLOADS_DIR = path.join(__dirname, 'uploads');
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR);
}

const subjectsData = {
  dsa: {
    title: "Data Structures & Algorithms",
    branch: "Computer Science (CSE)",
    code: "CS201",
    syllabus: [
      { unit: "Unit 1: Linear Data Structures", topics: "Introduction to complexity analysis. Big-O notation. Arrays, Linked Lists (Singly, Doubly, Circular), Stacks, and Queues. Applications of stacks: Infix to Postfix conversion, recursion evaluation." },
      { unit: "Unit 2: Non-Linear Data Structures", topics: "Trees: Binary Trees, Binary Search Trees (BST), AVL Trees, Red-Black Trees, Heaps, and B-Trees. Graphs: Representation (Adjacency Matrix, Adjacency List), Traversals (BFS, DFS)." },
      { unit: "Unit 3: Sorting & Searching", topics: "Searching: Linear Search, Binary Search, Hashing. Sorting: Bubble Sort, Selection Sort, Insertion Sort, Quick Sort, Merge Sort, Heap Sort. Time and space complexity comparisons." },
      { unit: "Unit 4: Advanced Algorithms", topics: "Greedy Algorithms (Huffman coding, Prim's and Kruskal's MST). Dynamic Programming (Knapsack, LCS). Backtracking (N-Queens, Graph Coloring)." }
    ],
    formulas: "Big-O time complexity, BST search time O(log n), AVL height-balance factor |hL - hR| <= 1."
  },
  os: {
    title: "Operating Systems",
    branch: "Computer Science (CSE)",
    code: "CS302",
    syllabus: [
      { unit: "Unit 1: Process Management", topics: "Process concept, process states, PCB, Process scheduling (FCFS, SJF, SRTF, Round Robin, Priority). Inter-process communication (IPC) and synchronization. Semaphores, Monitors, and Classic IPC problems." },
      { unit: "Unit 2: Memory Management", topics: "Logical vs Physical address spaces, Swapping, Contiguous memory allocation, Paging, Segmentation. Virtual Memory: Demand Paging, Page replacement algorithms (FIFO, LRU, Optimal), Thrashing." },
      { unit: "Unit 3: Storage & File Systems", topics: "File concept, Access methods, Directory structure, File system mounting, File sharing, and Protection. Allocation methods (Contiguous, Linked, Indexed), Free-space management. Disk scheduling (FIFO, SSTF, SCAN, C-SCAN)." },
      { unit: "Unit 4: Deadlocks & Security", topics: "System model, Deadlock characterization, Deadlock prevention, Deadlock avoidance (Banker's Algorithm), Deadlock detection and recovery. Protection & Security principles." }
    ],
    formulas: "SJF is optimal for minimum average waiting time. Page Fault Rate, Effective Access Time (EAT) equations."
  },
  dbms: {
    title: "Database Management Systems",
    branch: "Computer Science (CSE)",
    code: "CS303",
    syllabus: [
      { unit: "Unit 1: Database System Concepts", topics: "Database vs File systems. Data abstraction, data independence. ER Model: Entities, Attributes, Relationship sets, ER diagrams. Relational Model: Relational algebra operations (Select, Project, Join, Division)." },
      { unit: "Unit 2: SQL & Query Processing", topics: "DDL, DML, DCL commands. Nested queries, Joins, Triggers, Views. Query processing stages: Parsing, Translation, Optimization, and Evaluation." },
      { unit: "Unit 3: Normalization", topics: "Functional dependencies, closure of attributes. Normal forms: 1NF, 2NF, 3NF, BCNF. Multi-valued dependencies and 4NF. Lossless join decomposition and dependency preservation." },
      { unit: "Unit 4: Transaction & Concurrency", topics: "Transaction states, ACID properties. Serializability: Conflict and View serializability. Concurrency control: Two-Phase Locking (2PL), Timestamp-based ordering, Deadlock handling." }
    ],
    formulas: "ACID: Atomicity, Consistency, Isolation, Durability. 3NF: X -> A implies X is superkey or A is prime."
  },
  aiml: {
    title: "AI & Machine Learning",
    branch: "Computer Science (CSE)",
    code: "CS401",
    syllabus: [
      { unit: "Unit 1: Introduction & Supervised Learning", topics: "Machine Learning vs traditional programming. Linear Regression, Logistic Regression. Classification: k-Nearest Neighbors (k-NN), Decision Trees, Support Vector Machines (SVM), Naive Bayes." },
      { unit: "Unit 2: Unsupervised Learning", topics: "Clustering: K-Means, Hierarchical Clustering, DBSCAN. Dimensionality Reduction: Principal Component Analysis (PCA), Linear Discriminant Analysis (LDA)." },
      { unit: "Unit 3: Artificial Neural Networks", topics: "Perceptron, Multi-Layer Perceptron (MLP). Backpropagation algorithm. Activation functions (Sigmoid, ReLU, Tanh). Intro to Deep Learning: CNNs, RNNs." },
      { unit: "Unit 4: Evaluation & Optimization", topics: "Bias-Variance Tradeoff. Overfitting and Underfitting. Evaluation metrics: Accuracy, Precision, Recall, F1-Score, ROC-AUC. Regularization: L1 (Lasso) and L2 (Ridge)." }
    ],
    formulas: "Mean Squared Error (MSE), Sigmoid activation: 1 / (1 + e^-x), F1-Score = 2 * (Prec * Rec) / (Prec + Rec)."
  },
  cn: {
    title: "Computer Networks",
    branch: "Computer Science (CSE)",
    code: "CS304",
    syllabus: [
      { unit: "Unit 1: Introduction & Physical Layer", topics: "Data Communication, Network topologies, OSI vs TCP/IP Reference Model. Physical Layer: Transmission media (guided, unguided), line coding, multiplexing (FDM, TDM, WDM), switching." },
      { unit: "Unit 2: Data Link Layer", topics: "Framing, Error control (Parity, CRC, Hamming code). Flow control (Stop-and-Wait, Sliding Window, Go-Back-N, Selective Repeat). MAC Sublayer: ALOHA, CSMA/CD, CSMA/CA, Ethernet, Token Ring." },
      { unit: "Unit 3: Network Layer", topics: "Routing algorithms: Distance Vector (RIP), Link State (OSPF). Subnetting and Classless Addressing (CIDR). IPv4 vs IPv6. ARP, DHCP, ICMP protocols." },
      { unit: "Unit 4: Transport & Application Layer", topics: "Connectionless vs Connection-oriented: UDP vs TCP. Flow control, congestion control in TCP. Application Layer: DNS, HTTP, HTTPS, FTP, SMTP, POP3, DHCP." }
    ],
    formulas: "Nyquist Bit Rate = 2 * B * log2(L). Shannon Capacity = B * log2(1 + SNR). IPv4 Address Space = 2^32."
  },
  signals: {
    title: "Signals & Systems",
    branch: "Electronics (ECE)",
    code: "EC201",
    syllabus: [
      { unit: "Unit 1: Classification of Signals", topics: "Continuous-time vs Discrete-time signals, Energy vs Power, Periodic vs Aperiodic, Even vs Odd, Causal vs Non-causal. Basic operations: scaling, shifting, inversion." },
      { unit: "Unit 2: LTI Systems", topics: "Properties of systems: Linearity, Time-invariance, Causality, Stability, Memory. Impulse response, Convolution integral, Convolution sum representation for LTI systems." },
      { unit: "Unit 3: Fourier Analysis", topics: "Continuous-time Fourier Series (CTFS), Continuous-time Fourier Transform (CTFT). Frequency response of LTI systems. Discrete-time Fourier Transform (DTFT)." },
      { unit: "Unit 4: Laplace & Z-Transform", topics: "Laplace Transform: Region of Convergence (ROC), system transfer function, stability. Z-Transform: ROC, Inverse Z-transform, difference equations." }
    ],
    formulas: "Convolution: y(t) = x(t) * h(t) = Integral[x(t-tau)*h(tau)d_tau]. Euler's Identity: e^(jwt) = cos(wt) + j*sin(wt)."
  },
  dld: {
    title: "Digital Logic Design",
    branch: "Electronics (ECE)",
    code: "EC202",
    syllabus: [
      { unit: "Unit 1: Number Systems & Boolean Algebra", topics: "Binary, Octal, Decimal, Hexadecimal representation. Code conversions, 1's and 2's complements. Boolean theorems, K-Maps (up to 5 variables), Quine-McCluskey method." },
      { unit: "Unit 2: Combinational Logic", topics: "Design of Half Adder, Full Adder, Subtractor. Multiplexers, Demultiplexers, Decoders, Encoders. Magnitude Comparators. Code converters." },
      { unit: "Unit 3: Sequential Circuits", topics: "Latches vs Flip-flops (SR, JK, D, T). Triggering of flip-flops. Excitation tables. Design of Counters (Asynchronous, Synchronous), Shift Registers, Ring Counter, Johnson Counter." },
      { unit: "Unit 4: Finite State Machines & PLDs", topics: "State reduction and assignment. Mealy and Moore models. ROM, PLA, PAL implementations. Intro to FPGA." }
    ],
    formulas: "De Morgan's Laws: (A + B)' = A' * B' ; (A * B)' = A' + B'. JK Flip-Flop characteristic: Q(t+1) = J*Q' + K'*Q."
  },
  micro: {
    title: "Microprocessors & Microcontrollers",
    branch: "Electronics (ECE)",
    code: "EC301",
    syllabus: [
      { unit: "Unit 1: 8085 Microprocessor", topics: "8085 Architecture, Register organization, Pin diagram, ALU. Instruction set: Data transfer, Arithmetic, Logical, Branch control instructions. Assembly Language Programming." },
      { unit: "Unit 2: 8086 Microprocessor", topics: "8086 Architecture: BIU, EU. Memory segmentation, physical address calculation. Minimum and Maximum mode operations. Interrupt structure." },
      { unit: "Unit 3: Interfacing Devices", topics: "Interfacing memory and I/O devices. Programmable Peripheral Interface (8255), Programmable Interrupt Controller (8259), Keyboard/Display controller (8279), USART (8251)." },
      { unit: "Unit 4: 8051 Microcontroller", topics: "Introduction to Microcontrollers, 8051 block diagram, architecture, memory map, SFRs, Timers, Counters, Serial communication, and basic interfacing." }
    ],
    formulas: "8086 Physical Address = Segment Address * 16 + Offset Address. 8085 has 5 hardware interrupts (TRAP, RST7.5, RST6.5, RST5.5, INTR)."
  },
  vlsi: {
    title: "VLSI Design",
    branch: "Electronics (ECE)",
    code: "EC402",
    syllabus: [
      { unit: "Unit 1: MOS Transistor Theory", topics: "nMOS, pMOS enhancement transistors, threshold voltage, MOS equations, channel length modulation, body effect. CMOS fabrication steps: p-well, n-well, twin-tub process." },
      { unit: "Unit 2: CMOS Inverter & Logic", topics: "CMOS Inverter DC characteristics, beta ratio, noise margins. Delay analysis, fall and rise times. Design of NAND, NOR, and Complex CMOS logic gates." },
      { unit: "Unit 3: Sequential & Dynamic CMOS", topics: "Transmission gates, pass-transistor logic. Dynamic logic basics, domino logic, charge sharing. CMOS memory: 6T SRAM cell, DRAM." },
      { unit: "Unit 4: Layout & Testing", topics: "CMOS layout design rules (lambda-based). Stick diagrams. Design for Testability (DFT): Scan path design, Built-In Self-Test (BIST), Boundary scan." }
    ],
    formulas: "MOS Drain Current (Sat): Id = (Beta / 2) * (Vgs - Vt)^2. CMOS static power dissipation is approximately zero."
  },
  communication: {
    title: "Communication Systems",
    branch: "Electronics (ECE)",
    code: "EC303",
    syllabus: [
      { unit: "Unit 1: Analog Modulation Techniques", topics: "Need for modulation. Amplitude Modulation (AM): DSB-FC, DSB-SC, SSB-SC, VSB. Modulators and demodulators. Angle Modulation: Frequency Modulation (FM) and Phase Modulation (PM), Narrowband and Wideband FM." },
      { unit: "Unit 2: Pulse Modulation", topics: "Sampling theorem, Nyquist rate. Pulse Amplitude Modulation (PAM), Pulse Width Modulation (PWM), Pulse Position Modulation (PPM). Pulse Code Modulation (PCM), quantization noise, Delta Modulation (DM), ADM." },
      { unit: "Unit 3: Digital Modulation & Multiplexing", topics: "Amplitude Shift Keying (ASK), Frequency Shift Keying (FSK), Phase Shift Keying (PSK), QPSK, QAM. Multiplexing: FDM, TDM." },
      { unit: "Unit 4: Receiver & Noise Analysis", topics: "Superheterodyne receiver, intermediate frequency (IF), image frequency. Thermal noise, shot noise, noise figure, noise temperature. SNR analysis in AM and FM." }
    ],
    formulas: "AM Modulation Index: m = (Vmax - Vmin) / (Vmax + Vmin). FM Modulation Index: Beta = Delta_f / fm. IF = fLO - fs."
  },
  thermo: {
    title: "Thermodynamics",
    branch: "Mechanical Engg. (ME)",
    code: "ME201",
    syllabus: [
      { unit: "Unit 1: Basic Concepts & Zeroth Law", topics: "Macroscopic vs Microscopic viewpoint, thermodynamic system, state, processes, cycles. Zeroth Law: Temperature measurement, scale calibration." },
      { unit: "Unit 2: First Law of Thermodynamics", topics: "First Law applied to a closed system undergoing a process/cycle. Steady Flow Energy Equation (SFEE) applied to nozzles, turbines, compressors, boilers, heat exchangers." },
      { unit: "Unit 3: Second Law of Thermodynamics", topics: "Limitations of First Law. Heat engines, refrigerators, heat pumps. Kelvin-Planck and Clausius statements. Carnot cycle, Clausius inequality, entropy calculation." },
      { unit: "Unit 4: Pure Substances & Cycles", topics: "Properties of pure substances, dryness fraction, T-s and h-s diagrams. Vapor power cycles: Rankine cycle. Gas power cycles: Otto, Diesel, and Dual cycles." }
    ],
    formulas: "First Law: Q - W = Delta_U. Entropy: dS = dQ / T. COP of Heat Pump = COP of Refrigerator + 1."
  },
  fluid: {
    title: "Fluid Mechanics",
    branch: "Mechanical Engg. (ME)",
    code: "ME203",
    syllabus: [
      { unit: "Unit 1: Fluid Properties & Statics", topics: "Viscosity, surface tension, capillarity. Newton's Law of Viscosity. Fluid statics: pressure measurement, manometers, hydrostatic forces on submerged surfaces, buoyancy, metacentric height." },
      { unit: "Unit 2: Fluid Kinematics & Dynamics", topics: "Lagrangian vs Eulerian descriptions, velocity, acceleration, stream line, path line, streak line, continuity equation. Euler's and Bernoulli's equation, applications: Venturimeter, Orificemeter." },
      { unit: "Unit 3: Boundary Layer & Pipe Flow", topics: "Laminar vs Turbulent flow, Reynolds experiment. Major and minor losses in pipes. Boundary layer thickness, displacement, momentum thickness, drag and lift." },
      { unit: "Unit 4: Fluid Machines", topics: "Impact of jets on stationary and moving plates. Turbines: Pelton, Francis, Kaplan (working principles). Centrifugal and Reciprocating pumps." }
    ],
    formulas: "Bernoulli's Equation: P/rho*g + v^2/2g + z = constant. Reynolds Number: Re = rho * v * D / mu."
  },
  tom: {
    title: "Theory of Machines",
    branch: "Mechanical Engg. (ME)",
    code: "ME301",
    syllabus: [
      { unit: "Unit 1: Mechanisms & Kinematics", topics: "Link, kinematic pair, kinematic chain, mechanism, degrees of freedom, Grubler's and Kutzbach criteria. Inversions of four-bar chain, slider-crank, and double slider-crank mechanisms." },
      { unit: "Unit 2: Velocity & Acceleration", topics: "Relative velocity method, instantaneous center method, Coriolis acceleration component, Klein's construction." },
      { unit: "Unit 3: Cams, Gears & Gear Trains", topics: "Cam profiles for uniform velocity, SHM, and cycloidal motion. Gears: classification, law of gearing, interference, minimum number of teeth. Simple, compound, reverted, epicyclic gear trains." },
      { unit: "Unit 4: Governors, Gyroscopes & Balancing", topics: "Centrifugal governors: Watt, Porter, Proell, Hartnell. Gyroscopic couple, effect on aircrafts and ships. Static and dynamic balancing of rotating masses." }
    ],
    formulas: "Grubler's Criteria: F = 3*(L - 1) - 2*J - H. Gyroscopic Couple: C = I * omega * omega_p."
  },
  cad: {
    title: "CAD/CAM",
    branch: "Mechanical Engg. (ME)",
    code: "ME401",
    syllabus: [
      { unit: "Unit 1: Computer Graphics & Modeling", topics: "Introduction to CAD, hardware, raster graphics, transformations (translation, scaling, rotation). Geometric modeling: Wireframe, surface, and solid modeling. Bezier, B-Spline curves." },
      { unit: "Unit 2: Numerical Control (NC) & CNC", topics: "NC machine components, MCU, coordinate systems. CNC machining centers, G-code and M-code programming. Manual and computer-assisted part programming." },
      { unit: "Unit 3: Group Technology & FMS", topics: "Part families, classification and coding (Opitz system). Flexible Manufacturing Systems (FMS): layouts, material handling, AGVs." },
      { unit: "Unit 4: Rapid Prototyping & CAPP", topics: "Introduction to Additive Manufacturing (SLA, FDM, SLS). Computer-Aided Process Planning (CAPP): Retrieval and Generative approaches." }
    ],
    formulas: "2D Rotation Matrix: [cos(theta) -sin(theta); sin(theta) cos(theta)]. G00: Rapid linear positioning; G01: Linear interpolation."
  },
  robotics: {
    title: "Robotics & Automation",
    branch: "Mechanical Engg. (ME)",
    code: "ME405",
    syllabus: [
      { unit: "Unit 1: Introduction & Kinematics", topics: "Robot definition, laws of robotics, anatomy, joints, workspace. Homogeneous transformations. Forward and Inverse Kinematics: Denavit-Hartenberg (D-H) representation." },
      { unit: "Unit 2: Robot Dynamics & Control", topics: "Lagrange-Euler and Newton-Euler dynamic formulations. Robot control: Joint control, PID control, feedback control systems." },
      { unit: "Unit 3: Sensors & End Effectors", topics: "Sensors: Touch, force, proximity, ultrasonic sensors. Machine Vision: image processing, camera calibration. End effectors: mechanical, vacuum, magnetic grippers." },
      { unit: "Unit 4: Robot Programming & Industrial App", topics: "Lead-through programming, textual programming languages. Industrial applications: Welding, painting, assembly, palletizing, warehouse logistics." }
    ],
    formulas: "Degrees of freedom of a spatial manipulator. D-H parameter table: theta, d, a, alpha."
  },
  structural: {
    title: "Structural Analysis",
    branch: "Civil Engg. (CE)",
    code: "CE201",
    syllabus: [
      { unit: "Unit 1: Indeterminacy & Energy Methods", topics: "Static and Kinematic indeterminacy of beams, trusses, and frames. Strain energy due to axial load, bending, shear. Castigliano's theorems, Unit Load method for deflection." },
      { unit: "Unit 2: Influence Lines & Moving Loads", topics: "Influence lines for reactions, shear, bending moment in simple beams. Moving loads: maximum BM, SF, focal length. ILD for trusses." },
      { unit: "Unit 3: Arches & Cables", topics: "Three-hinged arches: horizontal thrust, radial shear, normal thrust. Two-hinged arches, temperature effect. Analysis of suspension cables, tension forces." },
      { unit: "Unit 4: Displacement Methods", topics: "Slope-Deflection method. Moment-Distribution method. Analysis of continuous beams and portal frames. Introduction to stiffness and flexibility matrix methods." }
    ],
    formulas: "Castigliano's theorem: Deflection = dU/dP. Slope-Deflection: Mab = M'ab + 2EI/L * (2_thetaA + thetaB - 3_delta/L)."
  },
  surveying: {
    title: "Surveying",
    branch: "Civil Engg. (CE)",
    code: "CE202",
    syllabus: [
      { unit: "Unit 1: Introduction & Linear Surveying", topics: "Principles of surveying. Chain surveying: equipment, ranging, tape corrections. Compass surveying: local attraction, magnetic declination, bearing conversions." },
      { unit: "Unit 2: Levelling & Contouring", topics: "Definitions, Levelling instruments, methods: Rise and Fall, Height of Instrument. Contour characteristics, methods of contouring, contour maps interpretation." },
      { unit: "Unit 3: Theodolite & Curves", topics: "Theodolite traversing: horizontal, vertical angles, Bowditch rule adjustments. Curves: Simple circular curves, setting out methods (Rankine's method). Transition and Vertical curves." },
      { unit: "Unit 4: Modern Surveying Methods", topics: "Tacheometric surveying. Total Station: components, distance and angle measurements. GPS and GIS introduction, photogrammetry basics." }
    ],
    formulas: "True length = Measured length * (L' / L). HI = BM + BS ; RL = HI - FS. Curvature correction = 0.0785 * d^2."
  },
  concrete: {
    title: "Concrete Technology",
    branch: "Civil Engg. (CE)",
    code: "CE301",
    syllabus: [
      { unit: "Unit 1: Cement & Aggregates", topics: "Manufacturing of Portland cement, chemical composition, hydration of cement, Bogues compounds, physical testing. Aggregates: classification, sizing, gradation, bulking of sand." },
      { unit: "Unit 2: Fresh & Hardened Concrete", topics: "Workability, factors affecting workability, testing: Slump test, Compacting Factor, Vee-Bee. Hardened concrete: compressive, tensile, flexural strength, stress-strain behavior. Creep, shrinkage." },
      { unit: "Unit 3: Concrete Admixtures", topics: "Chemical admixtures: plasticizers, superplasticizers, retarders, accelerators, air-entraining agents. Mineral admixtures: Fly ash, Silica fume, GGBS." },
      { unit: "Unit 4: Mix Design & Special Concrete", topics: "IS Code method of Concrete Mix Design (IS 10262). Quality control. Special concretes: High Strength Concrete, Self-Compacting Concrete, Fiber-Reinforced Concrete." }
    ],
    formulas: "Slump values for different placements. target mean strength: f'ck = fck + 1.65 * s (where s = std deviation)."
  },
  geotech: {
    title: "Geotechnical Engg.",
    branch: "Civil Engg. (CE)",
    code: "CE303",
    syllabus: [
      { unit: "Unit 1: Soil Properties & Classification", topics: "Three-phase soil system, void ratio, porosity, water content, unit weights, specific gravity. Index properties, consistency limits. Unified and Indian Standard Soil Classification Systems." },
      { unit: "Unit 2: Permeability & Seepage", topics: "Darcy's Law, coefficient of permeability, laboratory testing (constant head, falling head). Seepage analysis: flow nets, quicksand condition." },
      { unit: "Unit 3: Compaction & Consolidation", topics: "Compaction: Proctor test, OMC, MDD. Consolidation: Terzaghi's 1D consolidation theory, e-log p curve, compression index, settlement calculations." },
      { unit: "Unit 4: Shear Strength & Foundations", topics: "Mohr-Coulomb shear strength criteria. Direct shear, Triaxial compression, Unconfined compression tests. Bearing capacity: Terzaghi's theory." }
    ],
    formulas: "Porosity n = e / (1 + e). Darcy's Law: v = k * i. Effective Stress: Sigma' = Sigma - u."
  },
  environmental: {
    title: "Environmental Engg.",
    branch: "Civil Engg. (CE)",
    code: "CE401",
    syllabus: [
      { unit: "Unit 1: Water Demand & Quality", topics: "Water requirements, population forecasting methods (arithmetic, geometric, incremental increase). Physical, chemical, biological water quality parameters." },
      { unit: "Unit 2: Water Treatment Systems", topics: "Sedimentation, coagulation, filtration (slow sand, rapid sand), disinfection (chlorination, ozonation). Aeration, softening methods." },
      { unit: "Unit 3: Waste Water Characteristics", topics: "Sewerage systems, dry weather flow. Wastewater analysis: BOD, COD, suspended solids, pH. Biochemical Oxygen Demand kinetics." },
      { unit: "Unit 4: Sewage Treatment & Disposal", topics: "Primary treatment: screening, grit chambers. Secondary treatment: Activated Sludge Process (ASP), Trickling Filters. Sludge digestion, septic tanks, disposal methods." }
    ],
    formulas: "BOD remaining at time t: Lt = L0 * e^(-k*t). Population projection (Geom): P = P0 * (1 + r)^n."
  },
  webdev: {
    title: "Web Development",
    branch: "Information Tech (IT)",
    code: "IT201",
    syllabus: [
      { unit: "Unit 1: Frontend Fundamentals", topics: "Introduction to HTML5, semantic elements. CSS3: Box model, selectors, Flexbox, Grid, Responsive design. Javascript ES6+ features, DOM manipulation." },
      { unit: "Unit 2: Advanced Frontend Frameworks", topics: "React.js: Components, JSX, Props, State, Hook lifecycle (useState, useEffect), Routing (React Router), State Management (Context API, Redux)." },
      { unit: "Unit 3: Backend Development", topics: "Node.js environment, NPM. Express.js: routing, middleware, RESTful API design. JWT authentication, password hashing." },
      { unit: "Unit 4: Database Integration & Deployment", topics: "MongoDB: schema design (Mongoose), CRUD operations. SQL databases (MySQL). Deployment: Git, cloud hosting platforms." }
    ],
    formulas: "Flexbox properties (justify-content, align-items). REST: GET, POST, PUT, DELETE mappings."
  },
  cloud: {
    title: "Cloud Computing",
    branch: "Information Tech (IT)",
    code: "IT302",
    syllabus: [
      { unit: "Unit 1: Introduction to Cloud", topics: "NIST definition of cloud computing, benefits, service models (IaaS, PaaS, SaaS), deployment models (Public, Private, Hybrid)." },
      { unit: "Unit 2: Virtualization Technology", topics: "Hypervisors: Type 1 and Type 2. Virtual machines, CPU virtualization, memory virtualization. Containers vs Virtual Machines (Docker)." },
      { unit: "Unit 3: Cloud Storage & Services", topics: "Object storage (AWS S3) vs Block storage (EBS). Cloud database services. Serverless computing: AWS Lambda, Azure Functions." },
      { unit: "Unit 4: Security & DevOps in Cloud", topics: "Identity and Access Management (IAM), encryption, firewalls. DevOps pipeline: CI/CD in cloud, infrastructure as code (Terraform)." }
    ],
    formulas: "Availability = MTBF / (MTBF + MTTR). IaaS (Infrastructure), PaaS (Platform), SaaS (Software) definitions."
  },
  security: {
    title: "Cyber Security",
    branch: "Information Tech (IT)",
    code: "IT401",
    syllabus: [
      { unit: "Unit 1: Cryptography Principles", topics: "Symmetric Encryption (DES, AES) vs Asymmetric Encryption (RSA, ECC). Hashing algorithms: MD5, SHA-256. Digital Signatures, PKI." },
      { unit: "Unit 2: Network & Application Security", topics: "Firewalls, Intrusion Detection and Prevention Systems (IDS/IPS). Secure Socket Layer (SSL/TLS), HTTPS. SQL Injection, XSS, CSRF attacks." },
      { unit: "Unit 3: Threat Landscape & Hacking", topics: "Phishing, Social Engineering, Ransomware, DDoS attacks. Pentesting phases: Reconnaissance, scanning, exploitation, post-exploitation." },
      { unit: "Unit 4: Cyber Law & Incident Response", topics: "IT Act 2000, GDPR, HIPAA regulations. Digital forensics, chain of custody, log analysis, disaster recovery." }
    ],
    formulas: "RSA Key Generation: n = p * q, Phi(n) = (p-1)*(q-1). Encryption: c = m^e mod n."
  },
  java: {
    title: "Advanced Java",
    branch: "Information Tech (IT)",
    code: "IT304",
    syllabus: [
      { unit: "Unit 1: Multithreading & Collection Framework", topics: "Java Thread lifecycle, Synchronization, Runnable interface, thread pools. Collections: List, Set, Map, ArrayList, HashMap, Iterator." },
      { unit: "Unit 2: Java Web Development", topics: "Servlet lifecycle, request and response handling, session tracking (Cookies, HttpSession). JSP (Java Server Pages): scripting elements, JSP directives." },
      { unit: "Unit 3: Database & Enterprise Java", topics: "JDBC architecture, drivers, executing SQL queries, PreparedStatement. Enterprise Java Beans (EJB) intro, RMI." },
      { unit: "Unit 4: Spring Framework", topics: "Dependency Injection (DI), Inversion of Control (IoC) container. Spring MVC architecture. Spring Boot: auto-configuration, building RESTful Web Services." }
    ],
    formulas: "Servlet Methods: init(), service(), destroy(). JDBC connection: DriverManager.getConnection(url, user, pwd)."
  },
  se: {
    title: "Software Engineering",
    branch: "Information Tech (IT)",
    code: "IT202",
    syllabus: [
      { unit: "Unit 1: Process Models", topics: "Software lifecycle models: Waterfall, Spiral, Prototype, Incremental, RAD. Agile development: Scrum framework, User stories, Kanban." },
      { unit: "Unit 2: Requirements & Design", topics: "SRS document, Feasibility study. UML diagrams: Use Case, Class, Sequence, Activity diagrams. Architectural styles, modularity, coupling, and cohesion." },
      { unit: "Unit 3: Coding & Testing", topics: "Coding standards, code refactoring. Software testing: Black-box (Equivalence partitioning, Boundary value analysis) vs White-box (basis path, control flow testing). Unit, Integration, System testing." },
      { unit: "Unit 4: Project Management & DevOps", topics: "COCOMO estimation model. Risk management, software configuration management. Introduction to CI/CD, Git, automated testing." }
    ],
    formulas: "COCOMO: Effort = a * (KLOC)^b. Coupling should be minimized (loose); Cohesion should be maximized (high)."
  },
  powersystems: {
    title: "Power Systems",
    branch: "Electrical (EE)",
    code: "EE301",
    syllabus: [
      { unit: "Unit 1: Generation & Economics", topics: "Thermal, Hydro, Nuclear, Renewable energy power plants. Load curve, load factor, diversity factor, tariff structures." },
      { unit: "Unit 2: Transmission Line Parameters", topics: "Inductance and Capacitance calculations of single and three-phase lines. GMD and GMR calculations. Skin effect, Proximity effect, Corona discharge." },
      { unit: "Unit 3: Performance of Lines & Insulators", topics: "Short, Medium, Long transmission lines representation. Nominal-T and Nominal-Pi models. Efficiency and regulation. Overhead insulators: Pin, Suspension, Strain types." },
      { unit: "Unit 4: Fault Analysis & Load Flow", topics: "Symmetrical faults, unsymmetrical faults (LG, LL, LLG). Symmetrical components. Load flow analysis: Gauss-Seidel, Newton-Raphson methods." }
    ],
    formulas: "Load Factor = Average Load / Peak Load. Symmetrical components transformation matrix."
  },
  control: {
    title: "Control Systems",
    branch: "Electrical (EE)",
    code: "EE302",
    syllabus: [
      { unit: "Unit 1: Mathematical Modeling", topics: "Open loop vs Closed loop control systems. Transfer functions, block diagram reduction, Mason's Gain Formula for Signal Flow Graphs. Feedback characteristics." },
      { unit: "Unit 2: Time Response Analysis", topics: "Standard test signals, Response of First and Second order systems. Steady-state errors and static error coefficients. PID Controllers." },
      { unit: "Unit 3: Stability & Root Locus", topics: "Concept of stability. Routh-Hurwitz stability criterion. Root Locus technique: construction rules, angle of departure, breakaway points." },
      { unit: "Unit 4: Frequency Response Analysis", topics: "Bode plots, Gain margin, Phase margin. Nyquist stability criterion, polar plots. State-space analysis representation." }
    ],
    formulas: "Mason's Gain Formula: T = Sum(Pk * Delta_k) / Delta. Standard 2nd order characteristic eq: s^2 + 2*zeta*wn*s + wn^2 = 0."
  },
  machines: {
    title: "Electrical Machines",
    branch: "Electrical (EE)",
    code: "EE202",
    syllabus: [
      { unit: "Unit 1: Transformers", topics: "Single-phase transformers: working principle, EMF equation, equivalent circuit, phasor diagrams, losses, efficiency, voltage regulation. Three-phase transformers connections." },
      { unit: "Unit 2: DC Machines", topics: "DC Generator: construction, armature winding, EMF equation, commutation, characteristics. DC Motor: Back EMF, speed control methods, starting, losses, efficiency." },
      { unit: "Unit 3: Three-Phase Induction Motors", topics: "Production of rotating magnetic field, slip, equivalent circuit, torque-slip characteristics, starting methods, speed control." },
      { unit: "Unit 4: Synchronous Machines", topics: "Synchronous Generator (Alternator): EMF equation, armature reaction, voltage regulation (EMF, MMF methods). Synchronous Motor: principle of operation, V-curves." }
    ],
    formulas: "EMF eq of Transformer: E = 4.44 * f * N * Phi. Slip of Induction Motor: s = (Ns - Nr) / Ns."
  },
  networkanalysis: {
    title: "Network Analysis & Circuits",
    branch: "Electrical (EE)",
    code: "EE201",
    syllabus: [
      { unit: "Unit 1: Network Theorems", topics: "KCL, KVL. Nodal and Mesh analysis. Superposition, Thevenin's, Norton's, Maximum Power Transfer, Reciprocity, and Millman's Theorems." },
      { unit: "Unit 2: Transient Analysis", topics: "Steady state and transient response. Analysis of RL, RC, RLC circuits under DC excitation. Initial conditions, Laplace transform application." },
      { unit: "Unit 3: Resonance & Two-Port Networks", topics: "Series and Parallel resonance: bandwidth, Q-factor, selectivity. Two-port networks parameters: Z, Y, ABCD, h parameters, conversions." },
      { unit: "Unit 4: AC Circuits & Filters", topics: "Phasors, impedance, power triangle, power factor. Three-phase balanced/unbalanced circuits. Passive filters: Low pass, High pass, Band pass, Band stop." }
    ],
    formulas: "Thevenin's voltage Vth, Norton's current In = Vth / Rth. Series resonance frequency: fr = 1 / (2 * Pi * Sqrt(L*C))."
  },
  powerelectronics: {
    title: "Power Electronics",
    branch: "Electrical (EE)",
    code: "EE401",
    syllabus: [
      { unit: "Unit 1: Power Semiconductor Devices", topics: "Characteristics of Power Diodes, SCR, Triac, MOSFET, IGBT. Thyristor triggering and commutation methods." },
      { unit: "Unit 2: AC to DC Converters (Rectifiers)", topics: "Single-phase and Three-phase half/fully controlled bridge rectifiers with R, RL loads. Dual converters." },
      { unit: "Unit 3: DC-DC Choppers", topics: "Step-down (Buck), Step-up (Boost), Buck-Boost choppers. Control strategies: PWM, frequency modulation." },
      { unit: "Unit 4: Inverters & AC Controllers", topics: "Single-phase and Three-phase voltage source inverters (VSI). PWM techniques. Single-phase AC voltage controllers." }
    ],
    formulas: "Average output voltage (Buck): Vo = D * Vi. Thyristor average current rating calculation."
  },
  math: {
    title: "Engineering Mathematics",
    branch: "Common / Basic Sciences",
    code: "MA101",
    syllabus: [
      { unit: "Unit 1: Multivariable Calculus", topics: "Limits, continuity, partial derivatives, chain rule. Maxima, minima of two variables, Lagrange multipliers. Double and triple integrals." },
      { unit: "Unit 2: Ordinary Differential Equations", topics: "First-order linear ODEs, exact equations, Bernoulli's equation. Higher-order linear ODEs with constant coefficients. Method of variation of parameters." },
      { unit: "Unit 3: Linear Algebra", topics: "Vector spaces, linear independence, basis, dimension. Matrices, rank, system of linear equations. Eigenvalues, eigenvectors, Cayley-Hamilton theorem." },
      { unit: "Unit 4: Probability & Statistics", topics: "Conditional probability, Bayes' theorem. Random variables, binomial, Poisson, normal distributions. Correlation and regression." }
    ],
    formulas: "Bayes Theorem: P(A|B) = P(B|A)*P(A) / P(B). Eigenvalue equation: det(A - lambda*I) = 0."
  },
  physics: {
    title: "Engineering Physics",
    branch: "Common / Basic Sciences",
    code: "PH101",
    syllabus: [
      { unit: "Unit 1: Wave Optics", topics: "Interference: thin films, Newton's rings. Diffraction: Fraunhofer and Fresnel, single slit, double slit, diffraction grating. Polarization: double refraction, Nicol prism." },
      { unit: "Unit 2: Quantum Mechanics", topics: "Inadequacy of classical mechanics. Wave-particle duality, de Broglie hypothesis, Heisenberg uncertainty principle. Schrodinger wave equation (time-dependent and independent), particle in a 1D box." },
      { unit: "Unit 3: Lasers & Fiber Optics", topics: "Einstein coefficients, population inversion, Ruby and He-Ne lasers. Fiber Optics: principle, numerical aperture, single-mode and multi-mode fibers." },
      { unit: "Unit 4: Semiconductor Physics", topics: "Band theory of solids, Fermi-Dirac distribution, intrinsic and extrinsic semiconductors, carrier transport, Hall Effect." }
    ],
    formulas: "Uncertainty principle: Delta_x * Delta_p >= h_bar / 2. Numerical Aperture (NA) = Sqrt(n1^2 - n2^2)."
  },
  sample: {
    title: "General Engineering & Common Syllabus",
    branch: "Common for all Branches",
    code: "GE101",
    syllabus: [
      { unit: "Unit 1: Professional Communication & Ethics", topics: "Communication models, barrier removal, presentation skills, email etiquette. Professional ethics: integrity, accountability, corporate citizenship." },
      { unit: "Unit 2: Computer Systems & Programming", topics: "Computer architecture, binary systems. Basics of programming: variables, control structures (loops, conditionals), functions, arrays." },
      { unit: "Unit 3: Basic Electrical & Electronics", topics: "AC/DC voltage, Ohm's law, resistors, capacitors, inductors. Semiconductor diodes, logic gates, amplifiers." },
      { unit: "Unit 4: Environmental Studies & Sustainability", topics: "Ecosystems, biodiversity conservation. Water, air, and noise pollution control. Renewable energy, sustainable development goals." }
    ],
    formulas: "Ohm's Law: V = I * R. Power: P = V * I = I^2 * R."
  }
};

function createSubjectPDF(filename, data) {
  const doc = new PDFDocument({ margin: 50 });
  const filePath = path.join(UPLOADS_DIR, `${filename}.pdf`);
  doc.pipe(fs.createWriteStream(filePath));

  // --- HEADER GLOW ---
  doc.rect(0, 0, 612, 12).fill('#e95e86');

  // --- LOGO / PLATFORM NAME ---
  doc.fillColor('#6366f1')
     .font('Helvetica-Bold')
     .fontSize(13)
     .text('UniNotes', 50, 40)
     .font('Helvetica')
     .fillColor('#64748b')
     .text(' |  Curated Academic Study Material', 110, 40);

  // --- TITLE BLOCK ---
  doc.y = 80;
  doc.fillColor('#0f172a')
     .font('Helvetica-Bold')
     .fontSize(26)
     .text(data.title);

  doc.moveDown(0.2);
  doc.fillColor('#e95e86')
     .font('Helvetica-Bold')
     .fontSize(12)
     .text(`BRANCH: ${data.branch.toUpperCase()}`);

  doc.fillColor('#64748b')
     .font('Helvetica')
     .text(`COURSE CODE: ${data.code}`);

  doc.moveDown(0.8);
  doc.strokeColor('#e2e8f0')
     .lineWidth(1)
     .moveTo(50, doc.y)
     .lineTo(562, doc.y)
     .stroke();

  // --- OVERVIEW SECTION ---
  doc.moveDown(1);
  doc.fillColor('#0f172a')
     .font('Helvetica-Bold')
     .fontSize(15)
     .text('Subject Overview & Scope');
  
  doc.moveDown(0.4);
  doc.fillColor('#334155')
     .font('Helvetica')
     .fontSize(10)
     .text(`This comprehensive document serves as the official compiled study notes for ${data.title} (${data.code}) under the ${data.branch} department. It is structured into four core university syllabus units covering primary concepts, definitions, formulas, and advanced technical applications for university examinations and placements.`, { align: 'justify', lineGap: 4 });

  // --- SYLLABUS SECTION ---
  doc.moveDown(1.5);
  doc.fillColor('#0f172a')
     .font('Helvetica-Bold')
     .fontSize(14)
     .text('University Course Syllabus & Core Units');

  data.syllabus.forEach((unit) => {
    doc.moveDown(0.8);
    // Draw unit title with a left colored bar
    const startY = doc.y;
    doc.rect(50, startY, 4, 15).fill('#6366f1');
    doc.fillColor('#1e293b')
       .font('Helvetica-Bold')
       .fontSize(11)
       .text(`  ${unit.unit}`, 55, startY);
    
    doc.moveDown(0.3);
    doc.fillColor('#475569')
       .font('Helvetica')
       .fontSize(9.5)
       .text(unit.topics, { align: 'justify', lineGap: 3 });
  });

  // --- FORMULAS / CRITICAL CONCEPTS ---
  doc.moveDown(1.5);
  doc.fillColor('#0f172a')
     .font('Helvetica-Bold')
     .fontSize(13)
     .text('Key Formulas & Exam Pointers');

  doc.moveDown(0.4);
  doc.rect(50, doc.y, 512, 35)
     .fillAndStroke('rgba(99,102,241,0.06)', 'rgba(99,102,241,0.25)');
  
  doc.fillColor('#6366f1')
     .font('Helvetica-Bold')
     .fontSize(10)
     .text('  CRITICAL FORMULA / PRINCIPLE:', 55, doc.y - 30);
  
  doc.fillColor('#334155')
     .font('Helvetica-Oblique')
     .fontSize(9.5)
     .text(`  ${data.formulas}`, 55, doc.y - 18);

  // --- FOOTER ON PAGE 1 ---
  doc.rect(0, 780, 612, 12).fill('#0f172a');
  doc.fillColor('#94a3b8')
     .font('Helvetica-Bold')
     .fontSize(8)
     .text('UniNotes System Generated Note  |  100% Watermark-Free & Authenticated', 50, 765);

  doc.end();
  console.log(`Generated local PDF notes successfully: ${filename}.pdf`);
}

// Generate all 33 files
for (const [key, data] of Object.entries(subjectsData)) {
  createSubjectPDF(key, data);
}

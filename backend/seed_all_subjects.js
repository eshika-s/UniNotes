require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Note = require('./models/Note');
const bcrypt = require('bcryptjs');

const dbUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/uninotes';

const subjectsList = [
    "Computer Science (CSE)", "Mechanical Engg. (ME)", "Electronics (ECE)", "Civil Engg. (CE)", "Information Tech (IT)", "Electrical (EE)", "Common",
    "Data Structures & Algorithms", "Operating Systems", "Database Management", "AI & Machine Learning", "Computer Networks",
    "Signals & Systems", "Digital Logic Design", "Microprocessors", "VLSI Design", "Communication Systems",
    "Thermodynamics", "Fluid Mechanics", "Theory of Machines", "CAD/CAM", "Robotics",
    "Structural Analysis", "Surveying", "Concrete Technology", "Geotechnical Engg.", "Environmental Engg.",
    "Web Development", "Cloud Computing", "Cyber Security", "Advanced Java", "Software Engineering",
    "Power Systems", "Control Systems", "Electrical Machines", "Network Analysis", "Power Electronics"
];

const universities = ["Delhi University", "IIT Delhi", "IIT Bombay", "BITS Pilani", "VIT Vellore", "NIT Trichy", "Amity University"];

mongoose.connect(dbUri)
  .then(async () => {
    console.log('Connected to MongoDB');
    
    // Ensure Demo User
    let existingUser = await User.findOne({ email: 'demo@gmail.com' });
    if (!existingUser) {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('password123', salt);
        existingUser = await User.create({
            name: 'Demo User',
            email: 'demo@gmail.com',
            password: hashedPassword,
        });
    }

    let inserted = 0;
    for (const subject of subjectsList) {
        // Check if note with this precise subject name exists
        const exists = await Note.findOne({ subject: subject });
        if (!exists) {
            const randomUni = universities[Math.floor(Math.random() * universities.length)];
            await Note.create({
                title: `${subject} - Complete Notes`,
                subject: subject,
                subjectId: subject.toLowerCase().replace(/[^a-z0-9]/g, ''),
                courseCode: `SUB${Math.floor(Math.random() * 900) + 100}`,
                university: randomUni,
                fileUrl: "/uploads/sample.pdf",
                user: existingUser._id
            });
            inserted++;
        }
    }
    
    console.log(`Successfully seeded ${inserted} new notes for subjects.`);
    mongoose.disconnect();
  })
  .catch(err => {
    console.error(err);
    mongoose.disconnect();
  });

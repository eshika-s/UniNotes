const Note = require('../models/Note');

function getBranchDetails(subjectName) {
  if (!subjectName) {
    return { branch: "Common", subjectId: "common" };
  }
  const cseSubjects = ["Data Structures & Algorithms", "Operating Systems", "Database Management", "AI & Machine Learning", "Computer Networks", "Database Management Systems", "Data Structures & Algorithms – IIM Study Notes", "DBMS & SQL – Quick Notes", "Computer Networks – Complete Reference"];
  const itSubjects = ["Web Development", "Cloud Computing", "Cyber Security", "Advanced Java", "Software Engineering"];
  const eceSubjects = ["Signals & Systems", "Digital Logic Design", "Microprocessors", "VLSI Design", "Communication Systems", "Microprocessors & Microcontrollers"];
  const meSubjects = ["Thermodynamics", "Fluid Mechanics", "Theory of Machines", "CAD/CAM", "Robotics", "Robotics & Automation"];
  const ceSubjects = ["Structural Analysis", "Surveying", "Concrete Technology", "Geotechnical Engg.", "Environmental Engg."];
  const eeSubjects = ["Power Systems", "Control Systems", "Electrical Machines", "Network Analysis", "Power Electronics", "Network Analysis & Circuits"];
  
  const name = subjectName.toLowerCase();
  
  if (cseSubjects.some(s => name.includes(s.toLowerCase()))) {
    return { branch: "Computer Science (CSE)", subjectId: "cse" };
  } else if (itSubjects.some(s => name.includes(s.toLowerCase()))) {
    return { branch: "Information Tech (IT)", subjectId: "it" };
  } else if (eceSubjects.some(s => name.includes(s.toLowerCase()))) {
    return { branch: "Electronics (ECE)", subjectId: "ece" };
  } else if (meSubjects.some(s => name.includes(s.toLowerCase()))) {
    return { branch: "Mechanical Engg. (ME)", subjectId: "me" };
  } else if (ceSubjects.some(s => name.includes(s.toLowerCase()))) {
    return { branch: "Civil Engg. (CE)", subjectId: "ce" };
  } else if (eeSubjects.some(s => name.includes(s.toLowerCase()))) {
    return { branch: "Electrical (EE)", subjectId: "ee" };
  } else {
    if (name.includes("computer science") || name.includes("cse")) return { branch: "Computer Science (CSE)", subjectId: "cse" };
    if (name.includes("information tech") || name.includes("it")) return { branch: "Information Tech (IT)", subjectId: "it" };
    if (name.includes("electronics") || name.includes("ece")) return { branch: "Electronics (ECE)", subjectId: "ece" };
    if (name.includes("mechanical") || name.includes("me")) return { branch: "Mechanical Engg. (ME)", subjectId: "me" };
    if (name.includes("civil") || name.includes("ce")) return { branch: "Civil Engg. (CE)", subjectId: "ce" };
    if (name.includes("electrical") || name.includes("ee")) return { branch: "Electrical (EE)", subjectId: "ee" };
    return { branch: "Common", subjectId: "common" };
  }
}

// @desc    Get all notes for a user
// @route   GET /api/notes
// @access  Private
exports.getNotes = async (req, res) => {
  try {
    // Return newest notes first
    const notes = await Note.find({ user: req.user.id })
      .sort({ date: -1 })
      .populate('user', ['name', 'profilePic']);
    res.json(notes);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Get all global public notes feed
// @route   GET /api/notes/feed
// @access  Public or Private
exports.getGlobalNotes = async (req, res) => {
  try {
    const { search, subject, university, page = 1, limit = 9 } = req.query;
    const query = {};

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } },
        { university: { $regex: search, $options: 'i' } }
      ];
    }
    if (subject) {
      query.$or = [
        { subject: { $regex: subject, $options: 'i' } },
        { branch: { $regex: subject, $options: 'i' } }
      ];
    }
    if (university) {
      query.university = { $regex: university, $options: 'i' };
    }

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const [notes, total] = await Promise.all([
      Note.find(query)
        .sort({ date: -1 })
        .skip(skip)
        .limit(limitNum)
        .populate('user', ['name', 'profilePic', 'university', 'email', 'linkedin'])
        .lean(),
      Note.countDocuments(query)
    ]);

    res.json({
      notes,
      totalNotes: total,
      totalPages: Math.ceil(total / limitNum),
      currentPage: pageNum
    });
  } catch (err) {
    console.error('getGlobalNotes error:', err.message);
    res.status(500).json({ message: 'Server Error', error: err.message });
  }
};

// @desc    Get a single note by id
// @route   GET /api/notes/:id
// @access  Private
exports.getNoteById = async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);

    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }

    // Make sure user owns this note
    if (note.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    res.json(note);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Note not found' });
    }
    res.status(500).send('Server Error');
  }
};

// @desc    Create a note
// @route   POST /api/notes
// @access  Private
exports.createNote = async (req, res) => {
  const { title, content, subject, courseCode, university, semester, description, fileUrl: existingFileUrl } = req.body;

  try {
    let fileUrl = existingFileUrl;

    // If a file was uploaded by multer, use its path
    if (req.file) {
      fileUrl = '/uploads/' + req.file.filename;
    }

    const { branch, subjectId } = getBranchDetails(subject);

    const newNote = new Note({
      title,
      content: content || description,
      description,
      semester,
      subject,
      subjectId,
      branch,
      courseCode,
      university,
      fileUrl,
      user: req.user.id
    });

    const note = await newNote.save();

    // Return populated note so frontend has user details
    const populatedNote = await Note.findById(note._id).populate('user', ['name', 'profilePic', 'email', 'linkedin']);
    res.json(populatedNote);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Update a note
// @route   PUT /api/notes/:id
// @access  Private
exports.updateNote = async (req, res) => {
  const { title, content, subject, courseCode, fileUrl, semester, description } = req.body;

  // Build note object based on what is provided
  const noteFields = {};
  if (title !== undefined) noteFields.title = title;
  if (content !== undefined) noteFields.content = content;
  if (description !== undefined) noteFields.description = description;
  if (semester !== undefined) noteFields.semester = semester;
  if (subject !== undefined) {
    noteFields.subject = subject;
    const { branch, subjectId } = getBranchDetails(subject);
    noteFields.branch = branch;
    noteFields.subjectId = subjectId;
  }
  if (courseCode !== undefined) noteFields.courseCode = courseCode;
  if (fileUrl !== undefined) noteFields.fileUrl = fileUrl;

  try {
    let note = await Note.findById(req.params.id);

    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }

    // Make sure user owns the note they are trying to update
    if (note.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    note = await Note.findByIdAndUpdate(
      req.params.id,
      { $set: noteFields },
      { new: true } // return updated document
    );

    res.json(note);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Delete a note
// @route   DELETE /api/notes/:id
// @access  Private
exports.deleteNote = async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);

    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }

    // Make sure user owns the note they are trying to delete
    if (note.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    await note.deleteOne();

    res.json({ message: 'Note removed successfully' });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Note not found' });
    }
    res.status(500).send('Server Error');
  }
};

// @desc    Increment downloads on a note
// @route   POST /api/notes/:id/download
// @access  Public
exports.downloadNote = async (req, res) => {
  try {
    const note = await Note.findByIdAndUpdate(
      req.params.id,
      { $inc: { downloads: 1 } },
      { new: true }
    );
    if (!note) return res.status(404).json({ message: 'Note not found' });
    res.json({ downloads: note.downloads });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error', error: err.message });
  }
};

// @desc    Toggle like on a note
// @route   POST /api/notes/:id/like
// @access  Private
exports.toggleLikeNote = async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);
    if (!note) return res.status(404).json({ message: 'Note not found' });

    const userId = req.user.id;
    const likeIndex = note.likes.indexOf(userId);

    if (likeIndex > -1) {
      // User has already liked, so unlike it
      note.likes.splice(likeIndex, 1);
    } else {
      // User hasn't liked, so like it
      note.likes.push(userId);
    }

    await note.save();
    res.json({ likes: note.likes, likesCount: note.likes.length });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error', error: err.message });
  }
};

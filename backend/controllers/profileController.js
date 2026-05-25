const User = require('../models/User');

// @desc    Get current user profile
// @route   GET /api/profile/me
// @access  Private
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @desc    Update user profile
// @route   PUT /api/profile/me
// @access  Private
exports.updateProfile = async (req, res) => {
  const { name, university, semester, bio, linkedin } = req.body;

  // Build profile object
  const profileFields = {};
  if (name) profileFields.name = name;
  if (university) profileFields.university = university;
  if (semester) profileFields.semester = semester;
  if (bio !== undefined) profileFields.bio = bio;
  if (linkedin !== undefined) profileFields.linkedin = linkedin;

  if (req.file) {
    // If a new profile picture was uploaded, store the URL
    // Format: 'http://localhost:5000/uploads/filename'
    const filepath = '/uploads/' + req.file.filename;
    profileFields.profilePic = filepath;
  }

  try {
    let user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user = await User.findByIdAndUpdate(
      req.user.id,
      { $set: profileFields },
      { new: true }
    ).select('-password');

    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

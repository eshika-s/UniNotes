const express = require('express');
const router = express.Router();
const auth = require('../middlewares/authMiddleware');
const upload = require('../middlewares/uploadMiddleware');
const { getProfile, updateProfile } = require('../controllers/profileController');

router.route('/me')
  .get(auth, getProfile)
  .put(auth, upload.single('profilePic'), updateProfile);

module.exports = router;

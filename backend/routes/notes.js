const express = require('express');
const router = express.Router();
const auth = require('../middlewares/authMiddleware');
const upload = require('../middlewares/uploadMiddleware');
const {
  getNotes,
  getNoteById,
  createNote,
  updateNote,
  deleteNote,
  getGlobalNotes,
  downloadNote,
  toggleLikeNote
} = require('../controllers/noteController');

// Global feed - public so anyone can browse notes
router.route('/feed')
  .get(getGlobalNotes);

// Public route to increment downloads on a note
router.post('/:id/download', downloadNote);

// Private route to toggle like status on a note
router.post('/:id/like', auth, toggleLikeNote);

// All note routes require authentication (managed by auth middleware)
router.route('/')
  .get(auth, getNotes)
  .post(auth, upload.single('fileUrl'), createNote);

router.route('/:id')
  .get(auth, getNoteById)
  .put(auth, updateNote)
  .delete(auth, deleteNote);

module.exports = router;

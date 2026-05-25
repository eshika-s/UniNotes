const mongoose = require('mongoose');

const NoteSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  title: {
    type: String,
    required: true
  },
  content: {
    type: String
  },
  subject: {
    type: String
  },
  subjectId: {
    type: String
  },
  branch: {
    type: String
  },
  description: {
    type: String
  },
  courseCode: {
    type: String
  },
  university: {
    type: String,
    default: "Delhi University"
  },
  fileUrl: {
    type: String
  },
  semester: {
    type: String,
    default: ""
  },
  downloads: {
    type: Number,
    default: 0
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('note', NoteSchema);

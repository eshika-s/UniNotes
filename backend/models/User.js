const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  university: {
    type: String,
    default: "Delhi University",
  },
  semester: {
    type: String,
    default: "",
  },
  bio: {
    type: String,
    default: "",
  },
  profilePic: {
    type: String,
    default: "",
  },
  linkedin: {
    type: String,
    default: "",
  },
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);

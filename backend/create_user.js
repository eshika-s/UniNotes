const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');

const MONGODB_URI = 'mongodb://127.0.0.1:27017/uninotes';

mongoose.connect(MONGODB_URI)
  .then(async () => {
    // Check if user exists
    let user = await User.findOne({ email: 'demo@gmail.com' });
    if (!user) {
      user = new User({
        name: 'Demo User',
        email: 'demo@gmail.com',
        password: 'password123'
      });
      // Hash password
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash('password123', salt);
      await user.save();
      console.log('Demo user created successfully!');
    } else {
      console.log('Demo user already exists!');
    }
    process.exit(0);
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });

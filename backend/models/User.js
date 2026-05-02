const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
    select: false, // Don't return password by default
  },
  role: {
    type: String,
    enum: ['Student', 'Chapter Coordinator', 'Head Office Admin', 'Super Admin'],
    default: 'Student',
  },
  phone: {
    type: String,
  },
  // Coordinator specific
  chapterId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Chapter',
  },
  // Student specific (basic info, rest goes to Application)
  aadhaar: {
    type: String,
    sparse: true,
  },
  isActive: {
    type: Boolean,
    default: true,
  }
}, { timestamps: true });

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Match password method
userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);

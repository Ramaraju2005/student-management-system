const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  applicationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ScholarshipApplication',
    required: true,
  },
  reviewerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  action: {
    type: String,
    enum: ['Approved', 'Rejected', 'Correction Requested', 'Forwarded'],
    required: true,
  },
  remarks: {
    type: String,
    required: true,
  }
}, { timestamps: true });

module.exports = mongoose.model('Review', reviewSchema);

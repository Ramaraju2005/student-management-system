const mongoose = require('mongoose');

const disbursementSchema = new mongoose.Schema({
  applicationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ScholarshipApplication',
    required: true,
  },
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  processedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ['Pending', 'Processing', 'Completed', 'Failed'],
    default: 'Pending',
  },
  transactionReference: {
    type: String,
  },
  disbursementDate: {
    type: Date,
  },
  notes: {
    type: String,
  }
}, { timestamps: true });

module.exports = mongoose.model('Disbursement', disbursementSchema);

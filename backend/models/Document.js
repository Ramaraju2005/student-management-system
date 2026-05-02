const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema({
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
  documentType: {
    type: String,
    enum: [
      'Photo', 'Aadhaar', 'IncomeCertificate', 'Marksheet', 
      'AdmissionProof', 'FeeReceipt', 'BankPassbook', 'BonafideCertificate', 'Other'
    ],
    required: true,
  },
  fileName: {
    type: String,
    required: true,
  },
  filePath: {
    type: String,
    required: true,
  },
  uploadedAt: {
    type: Date,
    default: Date.now,
  }
}, { timestamps: true });

module.exports = mongoose.model('Document', documentSchema);

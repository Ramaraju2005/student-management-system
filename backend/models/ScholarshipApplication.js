const mongoose = require('mongoose');

const scholarshipApplicationSchema = new mongoose.Schema({
  applicationId: { type: String, unique: true },
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  chapterId: { type: mongoose.Schema.Types.ObjectId, ref: 'Chapter' },
  
  status: {
    type: String,
    enum: [
      'Draft', 'Submitted', 'Under Chapter Review', 'Correction Requested',
      'Chapter Approved', 'Chapter Rejected', 'Under Head Office Review',
      'Head Office Approved', 'Head Office Rejected', 'Amount Assigned',
      'Disbursement Processing', 'Disbursed'
    ],
    default: 'Draft',
  },

  // Personal Details
  personalDetails: {
    dob: Date,
    gender: String,
    permanentAddress: String,
    currentAddress: String,
    parentName: String,
    parentOccupation: String,
    annualFamilyIncome: Number,
  },

  // Academic Details
  academicDetails: {
    currentCourse: String,
    department: String,
    collegeName: String,
    yearSemester: String,
    previousQualification: String,
    previousMarks: String,
    admissionNumber: String,
    feeStructure: String,
    achievements: String,
  },

  // Financial Details
  financialDetails: {
    tuitionFee: Number,
    hostelFee: Number,
    booksCost: Number,
    otherExpenses: Number,
    requestedAmount: Number,
  },

  // Bank Details
  bankDetails: {
    accountHolderName: String,
    bankName: String,
    accountNumber: String,
    ifscCode: String,
    branchName: String,
  },

  // Meta Fields
  submittedAt: Date,
  lastReviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  assignedAmount: Number,
  remarks: String,

}, { timestamps: true });

// Pre-save hook to generate application ID
scholarshipApplicationSchema.pre('save', function(next) {
  if (!this.applicationId && this.status === 'Submitted') {
    const year = new Date().getFullYear();
    const random = Math.floor(10000 + Math.random() * 90000);
    this.applicationId = `NSF-${year}-${random}`;
    this.submittedAt = new Date();
  }
  next();
});

module.exports = mongoose.model('ScholarshipApplication', scholarshipApplicationSchema);

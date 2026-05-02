const mongoose = require('mongoose');

const scholarshipRuleSchema = new mongoose.Schema({
  ruleName: {
    type: String,
    required: true,
  },
  maxFamilyIncome: {
    type: Number,
    required: true,
  },
  minMarksPercentage: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
  },
  isActive: {
    type: Boolean,
    default: true,
  }
}, { timestamps: true });

module.exports = mongoose.model('ScholarshipRule', scholarshipRuleSchema);

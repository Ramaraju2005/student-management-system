const ScholarshipApplication = require('../models/ScholarshipApplication');
const Review = require('../models/Review');
const Disbursement = require('../models/Disbursement');
const Document = require('../models/Document');

// @desc    Get all forwarded applications
// @route   GET /api/head-office/applications
// @access  Private (Head Office Admin)
const getHOApplications = async (req, res) => {
  try {
    const applications = await ScholarshipApplication.find({
      status: { $in: ['Under Head Office Review', 'Head Office Approved', 'Head Office Rejected', 'Amount Assigned', 'Disbursement Processing', 'Disbursed'] }
    })
    .populate('studentId', 'fullName email phone')
    .populate('chapterId', 'name location')
    .sort('-updatedAt');

    res.json({ success: true, data: applications });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// @desc    Review application (Final Approve/Reject)
// @route   POST /api/head-office/applications/:id/review
// @access  Private (Head Office Admin)
const reviewApplication = async (req, res) => {
  try {
    const { action, remarks } = req.body;
    
    const application = await ScholarshipApplication.findById(req.params.id);

    if (!application || application.status !== 'Under Head Office Review') {
      return res.status(404).json({ success: false, message: 'Application not found or not in correct status' });
    }

    let newStatus;
    let reviewAction;

    if (action === 'Approve') {
      newStatus = 'Head Office Approved';
      reviewAction = 'Approved';
    } else if (action === 'Reject') {
      newStatus = 'Head Office Rejected';
      reviewAction = 'Rejected';
    } else {
      return res.status(400).json({ success: false, message: 'Invalid action' });
    }

    application.status = newStatus;
    application.remarks = remarks;
    application.lastReviewedBy = req.user._id;
    await application.save();

    await Review.create({
      applicationId: application._id,
      reviewerId: req.user._id,
      action: reviewAction,
      remarks: remarks
    });

    res.json({ success: true, data: application });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// @desc    Assign scholarship amount
// @route   POST /api/head-office/applications/:id/assign-amount
// @access  Private (Head Office Admin)
const assignAmount = async (req, res) => {
  try {
    const { amount } = req.body;
    
    if (!amount || amount <= 0) {
      return res.status(400).json({ success: false, message: 'Invalid amount' });
    }

    const application = await ScholarshipApplication.findById(req.params.id);

    if (!application || application.status !== 'Head Office Approved') {
      return res.status(404).json({ success: false, message: 'Application must be approved first' });
    }

    application.assignedAmount = amount;
    application.status = 'Amount Assigned';
    await application.save();

    res.json({ success: true, data: application });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// @desc    Process disbursement
// @route   POST /api/head-office/applications/:id/disburse
// @access  Private (Head Office Admin)
const processDisbursement = async (req, res) => {
  try {
    const { transactionReference, notes } = req.body;
    
    const application = await ScholarshipApplication.findById(req.params.id);

    if (!application || application.status !== 'Amount Assigned') {
      return res.status(404).json({ success: false, message: 'Amount must be assigned first' });
    }

    application.status = 'Disbursed';
    await application.save();

    const disbursement = await Disbursement.create({
      applicationId: application._id,
      studentId: application.studentId,
      processedBy: req.user._id,
      amount: application.assignedAmount,
      status: 'Completed',
      transactionReference,
      disbursementDate: new Date(),
      notes
    });

    res.json({ success: true, data: { application, disbursement } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// @desc    Get application details
// @route   GET /api/head-office/applications/:id
// @access  Private (Head Office Admin)
const getApplicationById = async (req, res) => {
  try {
    const application = await ScholarshipApplication.findById(req.params.id)
      .populate('studentId', 'fullName email phone')
      .populate('chapterId', 'name location');

    if (!application) {
      return res.status(404).json({ success: false, message: 'Application not found' });
    }

    const documents = await Document.find({ applicationId: application._id });
    const reviews = await Review.find({ applicationId: application._id }).populate('reviewerId', 'fullName role');
    const disbursement = await Disbursement.findOne({ applicationId: application._id });

    res.json({ success: true, data: { ...application.toObject(), documents, reviews, disbursement } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

module.exports = {
  getHOApplications,
  reviewApplication,
  assignAmount,
  processDisbursement,
  getApplicationById
};

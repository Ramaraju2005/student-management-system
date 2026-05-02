const ScholarshipApplication = require('../models/ScholarshipApplication');
const Review = require('../models/Review');
const Document = require('../models/Document');

// @desc    Get applications assigned to chapter
// @route   GET /api/coordinator/applications
// @access  Private (Chapter Coordinator)
const getChapterApplications = async (req, res) => {
  try {
    const chapterId = req.user.chapterId;
    
    if (!chapterId) {
      return res.status(400).json({ success: false, message: 'You are not assigned to any chapter' });
    }

    const applications = await ScholarshipApplication.find({
      chapterId: chapterId,
      status: { $in: ['Submitted', 'Under Chapter Review', 'Correction Requested', 'Chapter Approved', 'Chapter Rejected'] }
    })
    .populate('studentId', 'fullName email phone')
    .sort('-updatedAt');

    res.json({ success: true, data: applications });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// @desc    Review application
// @route   POST /api/coordinator/applications/:id/review
// @access  Private (Chapter Coordinator)
const reviewApplication = async (req, res) => {
  try {
    const { action, remarks } = req.body;
    
    // action: 'Approve', 'Reject', 'RequestCorrection'
    
    const application = await ScholarshipApplication.findOne({
      _id: req.params.id,
      chapterId: req.user.chapterId
    });

    if (!application) {
      return res.status(404).json({ success: false, message: 'Application not found or unauthorized' });
    }

    let newStatus;
    let reviewAction;

    if (action === 'Approve') {
      newStatus = 'Chapter Approved';
      reviewAction = 'Approved';
    } else if (action === 'Reject') {
      newStatus = 'Chapter Rejected';
      reviewAction = 'Rejected';
    } else if (action === 'RequestCorrection') {
      newStatus = 'Correction Requested';
      reviewAction = 'Correction Requested';
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

// @desc    Forward application to HO
// @route   POST /api/coordinator/applications/:id/forward
// @access  Private (Chapter Coordinator)
const forwardApplication = async (req, res) => {
  try {
    const application = await ScholarshipApplication.findOne({
      _id: req.params.id,
      chapterId: req.user.chapterId,
      status: 'Chapter Approved'
    });

    if (!application) {
      return res.status(404).json({ success: false, message: 'Application not found or not approved by chapter yet' });
    }

    application.status = 'Under Head Office Review';
    await application.save();

    await Review.create({
      applicationId: application._id,
      reviewerId: req.user._id,
      action: 'Forwarded',
      remarks: 'Forwarded to Head Office for final review'
    });

    res.json({ success: true, data: application });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// @desc    Get application details
// @route   GET /api/coordinator/applications/:id
// @access  Private (Chapter Coordinator)
const getApplicationById = async (req, res) => {
  try {
    const application = await ScholarshipApplication.findOne({
      _id: req.params.id,
      chapterId: req.user.chapterId
    }).populate('studentId', 'fullName email phone');

    if (!application) {
      return res.status(404).json({ success: false, message: 'Application not found' });
    }

    const documents = await Document.find({ applicationId: application._id });
    const reviews = await Review.find({ applicationId: application._id }).populate('reviewerId', 'fullName role');

    res.json({ success: true, data: { ...application.toObject(), documents, reviews } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

module.exports = {
  getChapterApplications,
  reviewApplication,
  forwardApplication,
  getApplicationById
};

const ScholarshipApplication = require('../models/ScholarshipApplication');
const Document = require('../models/Document');
const Chapter = require('../models/Chapter');

// @desc    Create new application draft
// @route   POST /api/applications
// @access  Private (Student)
const createApplication = async (req, res) => {
  try {
    const existingApp = await ScholarshipApplication.findOne({ studentId: req.user._id });
    
    if (existingApp && existingApp.status !== 'Draft' && existingApp.status !== 'Correction Requested') {
      return res.status(400).json({ success: false, message: 'You already have an active application' });
    }

    let application;
    
    if (existingApp) {
      // Update existing draft
      application = await ScholarshipApplication.findByIdAndUpdate(
        existingApp._id,
        req.body,
        { new: true, runValidators: true }
      );
    } else {
      // Create new
      application = await ScholarshipApplication.create({
        ...req.body,
        studentId: req.user._id,
        status: 'Draft'
      });
    }

    res.status(201).json({ success: true, data: application });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// @desc    Get my application
// @route   GET /api/applications/my
// @access  Private (Student)
const getMyApplication = async (req, res) => {
  try {
    const application = await ScholarshipApplication.findOne({ studentId: req.user._id })
      .populate('chapterId', 'name location')
      .populate('lastReviewedBy', 'fullName');
      
    if (!application) {
      return res.status(404).json({ success: false, message: 'No application found' });
    }

    const documents = await Document.find({ applicationId: application._id });

    res.json({ success: true, data: { ...application.toObject(), documents } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// @desc    Submit application
// @route   POST /api/applications/:id/submit
// @access  Private (Student)
const submitApplication = async (req, res) => {
  try {
    const application = await ScholarshipApplication.findOne({
      _id: req.params.id,
      studentId: req.user._id
    });

    if (!application) {
      return res.status(404).json({ success: false, message: 'Application not found' });
    }

    if (application.status !== 'Draft' && application.status !== 'Correction Requested') {
      return res.status(400).json({ success: false, message: 'Application cannot be submitted in current status' });
    }

    // Update status to generate applicationId
    application.status = 'Submitted';
    await application.save();

    res.json({ success: true, data: application });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// @desc    Upload documents
// @route   POST /api/applications/:id/documents
// @access  Private (Student)
const uploadDocuments = async (req, res) => {
  try {
    const application = await ScholarshipApplication.findOne({
      _id: req.params.id,
      studentId: req.user._id
    });

    if (!application) {
      return res.status(404).json({ success: false, message: 'Application not found' });
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ success: false, message: 'No files uploaded' });
    }

    const documents = [];
    
    // In a real app, you'd map field names to Document models here.
    // Assuming multer is configured to pass an array of files or object map
    const uploadedFiles = Array.isArray(req.files) ? req.files : Object.values(req.files).flat();

    for (const file of uploadedFiles) {
      const doc = await Document.create({
        applicationId: application._id,
        studentId: req.user._id,
        documentType: file.fieldname || 'Other',
        fileName: file.originalname,
        filePath: file.path,
      });
      documents.push(doc);
    }

    res.status(201).json({ success: true, data: documents });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

const getChapters = async (req, res) => {
  try {
    const chapters = await Chapter.find({ isActive: true });
    res.json({ success: true, data: chapters });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

module.exports = {
  createApplication,
  getMyApplication,
  submitApplication,
  uploadDocuments,
  getChapters
};

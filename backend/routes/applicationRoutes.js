const express = require('express');
const router = express.Router();
const {
  createApplication,
  getMyApplication,
  submitApplication,
  uploadDocuments,
  getChapters
} = require('../controllers/applicationController');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/roleCheck');
const upload = require('../middleware/upload');

router.use(protect);
router.use(authorize('Student'));

router.get('/chapters', getChapters);

router.route('/')
  .post(createApplication);

router.get('/my', getMyApplication);
router.post('/:id/submit', submitApplication);
router.post('/:id/documents', upload.any(), uploadDocuments);

module.exports = router;

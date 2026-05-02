const express = require('express');
const router = express.Router();
const {
  getChapterApplications,
  reviewApplication,
  forwardApplication,
  getApplicationById
} = require('../controllers/coordinatorController');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/roleCheck');

router.use(protect);
router.use(authorize('Chapter Coordinator'));

router.get('/applications', getChapterApplications);
router.get('/applications/:id', getApplicationById);
router.post('/applications/:id/review', reviewApplication);
router.post('/applications/:id/forward', forwardApplication);

module.exports = router;

const express = require('express');
const router = express.Router();
const {
  getHOApplications,
  reviewApplication,
  assignAmount,
  processDisbursement,
  getApplicationById
} = require('../controllers/headOfficeController');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/roleCheck');

router.use(protect);
router.use(authorize('Head Office Admin'));

router.get('/applications', getHOApplications);
router.get('/applications/:id', getApplicationById);
router.post('/applications/:id/review', reviewApplication);
router.post('/applications/:id/assign-amount', assignAmount);
router.post('/applications/:id/disburse', processDisbursement);

module.exports = router;

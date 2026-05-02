const express = require('express');
const router = express.Router();
const {
  getUsers,
  updateUser,
  createChapter,
  getChapters,
  deleteUser
} = require('../controllers/adminController');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/roleCheck');

router.use(protect);
router.use(authorize('Super Admin'));

router.route('/users')
  .get(getUsers);

router.route('/users/:id')
  .put(updateUser)
  .delete(deleteUser);

router.route('/chapters')
  .post(createChapter)
  .get(getChapters);

module.exports = router;

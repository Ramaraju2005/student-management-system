const User = require('../models/User');
const Chapter = require('../models/Chapter');

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private (Super Admin)
const getUsers = async (req, res) => {
  try {
    const users = await User.find({}).select('-password').populate('chapterId', 'name');
    res.json({ success: true, data: users });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// @desc    Update user
// @route   PUT /api/admin/users/:id
// @access  Private (Super Admin)
const updateUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    user.fullName = req.body.fullName || user.fullName;
    user.email = req.body.email || user.email;
    user.role = req.body.role || user.role;
    user.phone = req.body.phone || user.phone;
    user.chapterId = req.body.chapterId || user.chapterId;
    user.isActive = req.body.isActive !== undefined ? req.body.isActive : user.isActive;

    const updatedUser = await user.save();
    
    res.json({ success: true, data: updatedUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// @desc    Create chapter
// @route   POST /api/admin/chapters
// @access  Private (Super Admin)
const createChapter = async (req, res) => {
  try {
    const { name, location, description, coordinatorId } = req.body;

    const chapterExists = await Chapter.findOne({ name });
    if (chapterExists) {
      return res.status(400).json({ success: false, message: 'Chapter already exists' });
    }

    const chapter = await Chapter.create({
      name,
      location,
      description,
      coordinatorId
    });

    if (coordinatorId) {
      await User.findByIdAndUpdate(coordinatorId, { chapterId: chapter._id });
    }

    res.status(201).json({ success: true, data: chapter });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// @desc    Get chapters
// @route   GET /api/admin/chapters
// @access  Private (Super Admin)
const getChapters = async (req, res) => {
  try {
    const chapters = await Chapter.find({}).populate('coordinatorId', 'fullName email');
    res.json({ success: true, data: chapters });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// @desc    Delete user
// @route   DELETE /api/admin/users/:id
// @access  Private (Super Admin)
const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Prevent Super Admin from deleting themselves or other admins easily if needed, but for now just delete
    if (user.role === 'Super Admin') {
      return res.status(400).json({ success: false, message: 'Cannot delete a Super Admin' });
    }

    await User.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'User removed' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

module.exports = {
  getUsers,
  updateUser,
  createChapter,
  getChapters,
  deleteUser
};

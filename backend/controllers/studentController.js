const Student = require("../models/Student");

// @desc    Get all students (with optional search/filter)
// @route   GET /api/students
// @access  Public
const getAllStudents = async (req, res, next) => {
  try {
    const { search, status, course, department } = req.query;

    // Build query object
    let query = {};

    // Search by name, roll number, email, or course
    if (search) {
      query.$or = [
        { fullName: { $regex: search, $options: "i" } },
        { rollNumber: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { course: { $regex: search, $options: "i" } },
      ];
    }

    if (status) query.status = status;
    if (course) query.course = { $regex: course, $options: "i" };
    if (department) query.department = { $regex: department, $options: "i" };

    const students = await Student.find(query).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: students.length,
      data: students,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single student by ID
// @route   GET /api/students/:id
// @access  Public
const getStudentById = async (req, res, next) => {
  try {
    const student = await Student.findById(req.params.id);

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    res.status(200).json({
      success: true,
      data: student,
    });
  } catch (error) {
    // Handle invalid MongoDB ObjectId
    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid student ID format",
      });
    }
    next(error);
  }
};

// @desc    Create a new student
// @route   POST /api/students
// @access  Public
const createStudent = async (req, res, next) => {
  try {
    const student = await Student.create(req.body);

    res.status(201).json({
      success: true,
      message: "Student added successfully",
      data: student,
    });
  } catch (error) {
    // Handle duplicate key errors (unique fields)
    if (error.code === 11000) {
      const field = Object.keys(error.keyValue)[0];
      const fieldName = field === "rollNumber" ? "Roll Number" : "Email";
      return res.status(400).json({
        success: false,
        message: `${fieldName} '${error.keyValue[field]}' already exists`,
      });
    }
    // Handle Mongoose validation errors
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({
        success: false,
        message: messages[0],
      });
    }
    next(error);
  }
};

// @desc    Update student by ID
// @route   PUT /api/students/:id
// @access  Public
const updateStudent = async (req, res, next) => {
  try {
    const student = await Student.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,           // Return updated document
        runValidators: true, // Run schema validators on update
      }
    );

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Student updated successfully",
      data: student,
    });
  } catch (error) {
    if (error.code === 11000) {
      const field = Object.keys(error.keyValue)[0];
      const fieldName = field === "rollNumber" ? "Roll Number" : "Email";
      return res.status(400).json({
        success: false,
        message: `${fieldName} '${error.keyValue[field]}' already exists`,
      });
    }
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({
        success: false,
        message: messages[0],
      });
    }
    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid student ID format",
      });
    }
    next(error);
  }
};

// @desc    Delete student by ID
// @route   DELETE /api/students/:id
// @access  Public
const deleteStudent = async (req, res, next) => {
  try {
    const student = await Student.findByIdAndDelete(req.params.id);

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    res.status(200).json({
      success: true,
      message: `Student '${student.fullName}' deleted successfully`,
    });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid student ID format",
      });
    }
    next(error);
  }
};

// @desc    Get dashboard stats
// @route   GET /api/students/stats
// @access  Public
const getDashboardStats = async (req, res, next) => {
  try {
    const totalStudents = await Student.countDocuments();
    const activeStudents = await Student.countDocuments({ status: "Active" });
    const inactiveStudents = await Student.countDocuments({ status: "Inactive" });

    // Get 5 most recently added students
    const recentStudents = await Student.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select("fullName rollNumber course status createdAt");

    res.status(200).json({
      success: true,
      data: {
        totalStudents,
        activeStudents,
        inactiveStudents,
        recentStudents,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllStudents,
  getStudentById,
  createStudent,
  updateStudent,
  deleteStudent,
  getDashboardStats,
};

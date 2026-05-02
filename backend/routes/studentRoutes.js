const express = require("express");
const router = express.Router();
const {
  getAllStudents,
  getStudentById,
  createStudent,
  updateStudent,
  deleteStudent,
  getDashboardStats,
} = require("../controllers/studentController");

// Dashboard stats — must be defined before /:id to avoid conflict
router.get("/stats", getDashboardStats);

// Main CRUD routes
router.route("/").get(getAllStudents).post(createStudent);

router
  .route("/:id")
  .get(getStudentById)
  .put(updateStudent)
  .delete(deleteStudent);

module.exports = router;

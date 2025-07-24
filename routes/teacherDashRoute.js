const express = require("express");
const router = express.Router();

const teacherController = require("../controllers/teacherDashController");
const { auth, authorizeRoles } = require("../middleware/auth");

router.get(
  "/",
  auth,
  authorizeRoles("teacher"),
  teacherController.getTeacherDashboard
);

module.exports = router;

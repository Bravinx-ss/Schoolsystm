const express = require("express");
const router = express.Router();
const attendanceController = require("../controllers/attendanceController");

// authorization
const { auth, authorizeRoles } = require("../middleware/auth");

router.post("/",auth,authorizeRoles("teacher"),attendanceController.addAttendance);
router.get("/", attendanceController.getAllAttendance);
router.get("/:id",auth, authorizeRoles("teacher"), attendanceController.getAttendanceByStudent);
router.put("/:id",auth,authorizeRoles("teacher"), attendanceController.updateAttendance);
router.delete("/:id",auth,authorizeRoles("admin"),attendanceController.deleteAttendance);

module.exports = router;

const express = require("express");
const router = express.Router();
const studentController = require("../controllers/studentController");


// authorization
const { auth, authorizeRoles } = require("../middleware/auth");

router.post("/",auth,authorizeRoles("teacher"),studentController.uploadsStudentPhoto,studentController.addStudent);
router.get("/", studentController.getAllStudents);
router.get("/:id", studentController.getStudentById);
router.put("/:id",auth,authorizeRoles("teacher"),studentController.updateStudent);
router.delete("/:id",auth,authorizeRoles("teacher"),studentController.deleteStudent);

module.exports = router;

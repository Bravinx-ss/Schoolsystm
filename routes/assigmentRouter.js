const express = require('express')
const router = express.Router()
const assignmentController= require('../controllers/assigmentController')
const{auth,authorizeRoles}= require('../middleware/auth')

router.post('/',auth, assignmentController.addAssignment)
router.get('/',assignmentController.getAllAssignment)

router.get('/:id',auth,assignmentController.getAssignmentById)
router.put('/:id',auth,authorizeRoles("teacher"),assignmentController.updateAssignment)

router.delete(
  "/:id",
  auth,
  authorizeRoles("teacher"),
  assignmentController.deleteAssignment
);

// router.put('/:id',auth,authorizeRoles("admin","teacher"),teacherController.updateTeacher)
// router.put('/:id',auth,authorizeRoles("admin","teacher"),teacherController.updateTeacher)
// 
// router.delete('/:id',auth,authorizeRoles("admin"), teacherController.)
// router.get('/myClasses',auth,authorizeRoles("teacher"), teacherController.getMyClasses)


module.exports=router
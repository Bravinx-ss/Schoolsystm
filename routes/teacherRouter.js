const express = require('express')
const router = express.Router()
const teacherController= require('../controllers/teacherController')
const{auth,authorizeRoles}= require('../middleware/auth')


router.post('/',auth,authorizeRoles("admin"),teacherController.addTeacher)
// // teachers associated docs
// router.get('/myclasses',auth,teacherController.getMyClasses)
// router.get('/myAssigments',auth,teacherController.getMyAssigments)
// // ,authorizeRoles("teacher")
router.get('/',auth,authorizeRoles("admin"),teacherController.getAllTeachers)
router.get('/:id',auth,authorizeRoles("admin"),teacherController.getTeacherById)
// 
// router.put('/:me',auth,authorizeRoles("teacher"),teacherController.updateTeacher)
router.put('/:id',auth,authorizeRoles("admin","teacher"),teacherController.updateTeacher)
// 
router.delete('/:id',auth,authorizeRoles("admin"), teacherController.deletedTeacher)
// // router.get('/myClasses',auth,authorizeRoles("teacher"), teacherController.getMyClasses)


module.exports= router
const express= require('express')
const router= express.Router()
const classroomController= require('../controllers/classroomController')

// authorization
const{auth,authorizeRoles}= require('../middleware/auth')

router.post('/',auth,authorizeRoles('admin'),classroomController.addClassroom)
router.get('/', classroomController.getAllClassrooms)
router.get('/:id', classroomController.getAllClassroomById)
router.put('/:id',auth,authorizeRoles("admin"), classroomController.UpdateClassroom)
router.delete('/:id',auth,authorizeRoles("admin"), classroomController.deleteClassroom)


module.exports = router
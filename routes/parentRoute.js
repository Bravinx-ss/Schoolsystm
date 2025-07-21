const express = require ('express')
const router = express.Router();
const parentController = require ('../controllers/parentController')
const { auth, authorizeRoles } = require("../middleware/auth");

router.post("/", parentController.addParent);
router.get("/",auth,authorizeRoles("admin"), parentController.getAllParents);
// router.get("/:id", parentController.getAllClassroomById);
router.put("/:id",parentController.updateParent);
router.delete("/:id",parentController.deleteParent)
// router.delete("/:id",auth,authorizeRoles("admin"),parentController.deleteClassroom);

module.exports = router;
const express = require("express");
const router = express.Router();
const resultController = require("../controllers/resultController");
const { auth, authorizeRoles } = require("../middleware/auth");

router.post( "/",auth,authorizeRoles("teacher"),resultController.addResult);
router.get("/:id",auth,authorizeRoles("admin", "teacher", "parent"),resultController.getResultsByStudent);
router.put("/:id",auth,authorizeRoles("admin", "teacher"),resultController.updateResult);
router.delete("/:id",auth,authorizeRoles("admin"),resultController.deleteResult);

module.exports = router;

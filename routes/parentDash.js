const express = require("express");
const router = express.Router();

const parentDash = require("../controllers/parentDash");
const { auth, authorizeRoles } = require("../middleware/auth");

router.get("/",auth,authorizeRoles("parent"),parentDash.get_children);
router.get("/:id",auth,authorizeRoles("parent"),parentDash.getClassAssignments);

module.exports = router;

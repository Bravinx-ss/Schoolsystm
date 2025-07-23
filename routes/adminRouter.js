const express = require("express");
const router = express.Router();

const adminController = require("../controllers/adminDash");
const { auth, authorizeRoles } = require("../middleware/auth");

router.get("/",auth,authorizeRoles("admin"), adminController.getDashboardStats);



module.exports = router;

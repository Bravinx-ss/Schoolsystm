const express = require("express");
const router = express.Router();
const feeController = require("../controllers/feeController");
const { auth, authorizeRoles } = require("../middleware/auth");

// Use lowercase `:id`
router.post("/", auth, authorizeRoles("admin"), feeController.addFee);
router.get(
  "/:id",
  auth,
  authorizeRoles("admin"),
  feeController.getFeesByStudent
);
router.get(
  "/",
  auth,
  authorizeRoles("admin"),
  feeController.getStudentsWithFeeBalances
);
router.put("/:id", auth, authorizeRoles("admin"), feeController.updatePayment);
router.delete("/:id", auth, authorizeRoles("admin"), feeController.deleteFee);

module.exports = router;

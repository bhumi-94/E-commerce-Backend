const express = require("express");

const {
  getAllPaymentMethods,
  addPaymentMethod,
  editPaymentMethod,
  removePaymentMethod,
  makeDefaultPaymentMethod,
} = require("./payment.controller");

const authMiddleware = require("../../middleware/auth.middleware");

const router = express.Router();

router.get("/", authMiddleware, getAllPaymentMethods);
router.post("/", authMiddleware, addPaymentMethod);
router.put("/:id", authMiddleware, editPaymentMethod);
router.delete("/:id", authMiddleware, removePaymentMethod);
router.put("/:id/default", authMiddleware, makeDefaultPaymentMethod);

module.exports = router;

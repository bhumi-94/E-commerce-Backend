const express = require("express");

const {
  getAllAddresses,
  addAddress,
  editAddress,
  removeAddress,
  makeDefaultAddress,
} = require("./address.controller");

const authMiddleware = require("../../middleware/auth.middleware");

const router = express.Router();

router.get("/", authMiddleware, getAllAddresses);
router.post("/", authMiddleware, addAddress);
router.put("/:id", authMiddleware, editAddress);
router.delete("/:id", authMiddleware, removeAddress);
router.put("/:id/default", authMiddleware, makeDefaultAddress);

module.exports = router;

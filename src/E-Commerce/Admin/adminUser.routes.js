const express = require("express");
const {
  getAllUsers,
  deactivateUser,
  activateUser,
} = require("./adminUser.controller");

const authMiddleware = require("../../middleware/auth.middleware");
const adminMiddleware = require("../../middleware/admin.middleware");

const router = express.Router();

router.get("/", authMiddleware, adminMiddleware, getAllUsers);
router.put("/:id/dismiss", authMiddleware, adminMiddleware, deactivateUser);
router.put("/:id/enable", authMiddleware, adminMiddleware, activateUser);

module.exports = router;

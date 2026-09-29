const express = require("express");

const {
  getSettings,
  updateSettings,
} = require("./settings.controller");

const authMiddleware = require("../../middleware/auth.middleware");

const router = express.Router();

// GET USER SETTINGS
router.get(
  "/",
  authMiddleware,
  getSettings
);

// UPDATE USER SETTINGS
router.put(
  "/",
  authMiddleware,
  updateSettings
);

module.exports = router;
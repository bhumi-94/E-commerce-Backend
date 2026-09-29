const express = require("express");

const {

  getNotifications,
  markAsRead,
  markAllAsRead,
  deleteOne,
} = require("./notification.controller");

const authMiddleware = require("../../middleware/auth.middleware");

const router = express.Router();

// Get all notifications
router.get("/", authMiddleware, getNotifications);

// Mark all as read
router.put("/read-all", authMiddleware, markAllAsRead);

// Mark one as read
router.put("/:id/read", authMiddleware, markAsRead);

// Delete notification
router.delete("/:id", authMiddleware, deleteOne);

module.exports = router;

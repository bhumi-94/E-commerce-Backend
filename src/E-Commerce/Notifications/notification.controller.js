const {
  getUserNotifications,
  getUnreadNotificationCount,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
} = require("./notification.service");

// Get notifications
const getNotifications = async (req, res) => {
  try {
    const userId = req.user.id;

    const notifications = await getUserNotifications(userId);

    const unreadCount = await getUnreadNotificationCount(userId);

    return res.status(200).json({
      success: true,
      notifications,
      unreadCount,
    });
  } catch (error) {
    console.error("Get notifications error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to get notifications",
    });
  }
};

// Mark one notification as read
const markAsRead = async (req, res) => {
  try {
    const userId = req.user.id;
    const notificationId = req.params.id;

    const updated = await markNotificationAsRead(notificationId, userId);

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: "Notification not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Notification marked as read",
    });
  } catch (error) {
    console.error("Mark notification read error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to mark notification as read",
    });
  }
};

// Mark all notifications as read
const markAllAsRead = async (req, res) => {
  try {
    const userId = req.user.id;

    await markAllNotificationsAsRead(userId);

    return res.status(200).json({
      success: true,
      message: "All notifications marked as read",
    });
  } catch (error) {
    console.error("Mark all notifications read error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to mark all notifications as read",
    });
  }
};

// Delete notification
const deleteOne = async (req, res) => {
  try {
    const userId = req.user.id;
    const notificationId = req.params.id;

    const deleted = await deleteNotification(notificationId, userId);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Notification not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Notification deleted",
    });
  } catch (error) {
    console.error("Delete notification error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete notification",
    });
  }
};

module.exports = {
  getNotifications,
  markAsRead,
  markAllAsRead,
  deleteOne,
};

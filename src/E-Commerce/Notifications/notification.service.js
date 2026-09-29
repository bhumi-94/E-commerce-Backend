const { getDb } = require("../../Configurations/db.config");

// Create notification
const createNotification = async ({
  userId,
  title,
  message,
  type = "general",
  referenceId = null,
}) => {
  const db = getDb();

  const [result] = await db.execute(
    `
    INSERT INTO notifications
    (
      user_id,
      title,
      message,
      type,
      reference_id
    )
    VALUES (?, ?, ?, ?, ?)
    `,
    [userId, title, message, type, referenceId],
  );

  return result.insertId;
};

// Get user's notifications
const getUserNotifications = async (userId) => {
  const db = getDb();

  const [rows] = await db.execute(
    `
    SELECT
      id,
      user_id,
      title,
      message,
      type,
      reference_id,
      is_read,
      created_at
    FROM notifications
    WHERE user_id = ?
    ORDER BY created_at DESC
    `,
    [userId],
  );

  return rows;
};

// Get unread notification count
const getUnreadNotificationCount = async (userId) => {
  const db = getDb();

  const [rows] = await db.execute(
    `
    SELECT COUNT(*) AS count
    FROM notifications
    WHERE user_id = ?
    AND is_read = FALSE
    `,
    [userId],
  );

  return rows[0].count;
};

// Mark one notification as read
const markNotificationAsRead = async (notificationId, userId) => {
  const db = getDb();

  const [result] = await db.execute(
    `
    UPDATE notifications
    SET is_read = TRUE
    WHERE id = ?
    AND user_id = ?
    `,
    [notificationId, userId],
  );

  return result.affectedRows > 0;
};

// Mark all notifications as read
const markAllNotificationsAsRead = async (userId) => {
  const db = getDb();

  const [result] = await db.execute(
    `
    UPDATE notifications
    SET is_read = TRUE
    WHERE user_id = ?
    AND is_read = FALSE
    `,
    [userId],
  );

  return result.affectedRows;
};

// Delete notification
const deleteNotification = async (notificationId, userId) => {
  const db = getDb();

  const [result] = await db.execute(
    `
    DELETE FROM notifications
    WHERE id = ?
    AND user_id = ?
    `,
    [notificationId, userId],
  );

  return result.affectedRows > 0;
};

module.exports = {
  createNotification,
  getUserNotifications,
  getUnreadNotificationCount,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
};

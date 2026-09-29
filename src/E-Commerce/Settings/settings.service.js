const { getDb } = require("../../Configurations/db.config");

// ==========================================
// GET USER SETTINGS
// ==========================================
const getSettingsService = async (userId) => {
  const db = getDb();

  const [rows] = await db.execute(
    `
    SELECT
      id,
      user_id,
      email_notifications,
      order_notifications,
      promotional_notifications,
      theme,
      created_at,
      updated_at
    FROM user_settings
    WHERE user_id = ?
    LIMIT 1
    `,
    [userId]
  );

  // If settings don't exist, create default settings
  if (rows.length === 0) {
    await db.execute(
      `
      INSERT INTO user_settings
      (
        user_id,
        email_notifications,
        order_notifications,
        promotional_notifications,
        theme
      )
      VALUES (?, TRUE, TRUE, TRUE, 'light')
      `,
      [userId]
    );

    const [newSettings] = await db.execute(
      `
      SELECT
        id,
        user_id,
        email_notifications,
        order_notifications,
        promotional_notifications,
        theme,
        created_at,
        updated_at
      FROM user_settings
      WHERE user_id = ?
      LIMIT 1
      `,
      [userId]
    );

    return newSettings[0];
  }

  return rows[0];
};

// ==========================================
// UPDATE USER SETTINGS
// ==========================================
const updateSettingsService = async (
  userId,
  settingsData
) => {
  const db = getDb();

  const {
    email_notifications,
    order_notifications,
    promotional_notifications,
    theme,
  } = settingsData;

  // Make sure settings already exist
  const [existingSettings] = await db.execute(
    `
    SELECT id
    FROM user_settings
    WHERE user_id = ?
    LIMIT 1
    `,
    [userId]
  );

  if (existingSettings.length === 0) {
    await db.execute(
      `
      INSERT INTO user_settings
      (
        user_id,
        email_notifications,
        order_notifications,
        promotional_notifications,
        theme
      )
      VALUES (?, TRUE, TRUE, TRUE, 'light')
      `,
      [userId]
    );
  }

  await db.execute(
    `
    UPDATE user_settings
    SET
      email_notifications = COALESCE(
        ?,
        email_notifications
      ),
      order_notifications = COALESCE(
        ?,
        order_notifications
      ),
      promotional_notifications = COALESCE(
        ?,
        promotional_notifications
      ),
      theme = COALESCE(
        ?,
        theme
      )
    WHERE user_id = ?
    `,
    [
      email_notifications ?? null,
      order_notifications ?? null,
      promotional_notifications ?? null,
      theme ?? null,
      userId,
    ]
  );

  const [updatedSettings] = await db.execute(
    `
    SELECT
      id,
      user_id,
      email_notifications,
      order_notifications,
      promotional_notifications,
      theme,
      created_at,
      updated_at
    FROM user_settings
    WHERE user_id = ?
    LIMIT 1
    `,
    [userId]
  );

  return updatedSettings[0];
};

module.exports = {
  getSettingsService,
  updateSettingsService,
};
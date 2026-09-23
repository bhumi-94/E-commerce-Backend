const { getDb } = require("../../Configurations/db.config");

// Create feedback
const createFeedback = async ({ userId, feedbackText, city, country }) => {
  const db = getDb();

  const [result] = await db.query(
    `
    INSERT INTO feedback
    (
      user_id,
      feedback_text,
      city,
      country
    )
    VALUES (?, ?, ?, ?)
    `,
    [userId, feedbackText, city || null, country || null],
  );

  return result.insertId;
};

// Get all feedback
const getFeedback = async () => {
  const db = getDb();

  const [rows] = await db.query(
    `
    SELECT
      f.id,
      f.user_id,
      f.feedback_text,
      f.city,
      f.country,
      f.created_at,

      CONCAT(u.first_name, ' ', u.last_name) AS username,
      u.profile_image

    FROM feedback f

    INNER JOIN users u
      ON f.user_id = u.id

    ORDER BY f.created_at DESC
    `,
  );

  return rows;
};
module.exports = {
  createFeedback,
  getFeedback,
};

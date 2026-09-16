const { getDb } = require("../../Configurations/db.config");

const getProfileService = async (userId) => {
  const db = getDb();

  const [users] = await db.execute(
    `SELECT
      id,
      first_name,
      last_name,
      email,
      phone,
      profile_image,
      date_of_birth,
      gender,
      role,
      is_active,
      created_at,
      updated_at
     FROM users
     WHERE id = ?
     LIMIT 1`,
    [userId],
  );

  if (users.length === 0) {
    const error = new Error("User not found");
    error.statusCode = 404;
    throw error;
  }

  return users[0];
};

const updateProfileService = async (
  userId,
  { first_name, last_name, phone, date_of_birth, gender, profile_image },
) => {
  const db = getDb();
  const [users] = await db.execute(
    `SELECT id, profile_image
     FROM users
     WHERE id = ?
     LIMIT 1`,
    [userId],
  );
  if (users.length === 0) {
    const error = new Error("User not found");
    error.statusCode = 404;
    throw error;
  }
  if (!first_name || !first_name.trim()) {
    const error = new Error("First name is required");
    error.statusCode = 400;
    throw error;
  }

  if (gender && !["male", "female", "other"].includes(gender)) {
    const error = new Error("Invalid gender");

    error.statusCode = 400;

    throw error;
  }

  const finalProfileImage = profile_image || users[0].profile_image || null;
  await db.execute(
    `UPDATE users
     SET
       first_name = ?,
       last_name = ?,
       phone = ?,
       date_of_birth = ?,
       gender = ?,
       profile_image = ?
     WHERE id = ?`,
    [
      first_name.trim(),
      last_name ? last_name.trim() : null,
      phone ? phone.trim() : null,
      date_of_birth || null,
      gender || null,
      finalProfileImage,
      userId,
    ],
  );
  const updatedUser = await getProfileService(userId);
  return updatedUser;
};

module.exports = {
  getProfileService,
  updateProfileService,
};

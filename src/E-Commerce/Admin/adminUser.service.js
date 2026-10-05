const { getDb } = require("../../Configurations/db.config");

const getAllUsersService = async () => {
  const db = getDb();

  const [users] = await db.execute(`
    SELECT
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
    ORDER BY created_at DESC
  `);

  return users;
};

const deactivateUserService = async (userId, adminId) => {
  const db = getDb();

  // Prevent admin from disabling their own account
  if (Number(userId) === Number(adminId)) {
    const error = new Error("You cannot deactivate your own admin account");
    error.statusCode = 400;
    throw error;
  }

  const [users] = await db.execute(
    `
    SELECT id, role, is_active
    FROM users
    WHERE id = ?
    LIMIT 1
    `,
    [userId],
  );

  if (users.length === 0) {
    const error = new Error("User not found");
    error.statusCode = 404;
    throw error;
  }

  await db.execute(
    `
    UPDATE users
    SET is_active = 0
    WHERE id = ?
    `,
    [userId],
  );

  return {
    message: "User disabled successfully",
  };
};

const activateUserService = async (userId) => {
  const db = getDb();

  const [users] = await db.execute(
    `
    SELECT id, role, is_active
    FROM users
    WHERE id = ?
    LIMIT 1
    `,
    [userId],
  );

  if (users.length === 0) {
    const error = new Error("User not found");
    error.statusCode = 404;
    throw error;
  }

  await db.execute(
    `
    UPDATE users
    SET is_active = 1
    WHERE id = ?
    `,
    [userId],
  );

  return {
    message: "User enabled successfully",
  };
};

module.exports = {
  getAllUsersService,
  deactivateUserService,
  activateUserService,
};

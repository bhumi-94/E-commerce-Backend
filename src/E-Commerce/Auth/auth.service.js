const { getDb } = require("../../Configurations/db.config");
const { hashPassword , comparePassword } = require("../../utils/password");

const registerUserService = async ({
  first_name,
  last_name,
  email,
  password,
  phone,
}) => {
  const db = getDb();

  const [existingUsers] = await db.execute(
    "SELECT id FROM users WHERE email = ? LIMIT 1",
    [email]
  );

  if (existingUsers.length > 0) {
    const error = new Error("Email already registered");
    error.statusCode = 409;
    throw error;
  }

  const hashedPassword = await hashPassword(password);

  const [result] = await db.execute(
    `INSERT INTO users
      (first_name, last_name, email, password, phone)
     VALUES (?, ?, ?, ?, ?)`,
    [
      first_name,
      last_name,
      email,
      hashedPassword,
      phone,
    ]
  );

  const [users] = await db.execute(
    `SELECT
      id,
      first_name,
      last_name,
      email,
      phone,
      role,
      is_active,
      created_at
     FROM users
     WHERE id = ?`,
    [result.insertId]
  );

  return users[0];
};
const loginUserService = async ({ email, password }) => {
  const db = getDb();

  const [users] = await db.execute(
    `SELECT
      id,
      first_name,
      last_name,
      email,
      phone,
      password,
      role,
      is_active
     FROM users
     WHERE email = ?
     LIMIT 1`,
    [email]
  );

  if (users.length === 0) {
    const error = new Error("Invalid email or password");
    error.statusCode = 401;
    throw error;
  }

  const user = users[0];

  if (!user.is_active) {
    const error = new Error("Your account is inactive");
    error.statusCode = 403;
    throw error;
  }

  const isPasswordValid = await comparePassword(
    password,
    user.password
  );

  if (!isPasswordValid) {
    const error = new Error("Invalid email or password");
    error.statusCode = 401;
    throw error;
  }

  delete user.password;

  return user;
};

module.exports = {
  registerUserService,
  loginUserService
};
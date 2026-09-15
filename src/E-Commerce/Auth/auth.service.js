const { getDb } = require("../../Configurations/db.config");
const { hashPassword, comparePassword } = require("../../utils/password");

const {
  generateResetToken,
  hashResetToken,
} = require("../../utils/resetTokens");

const { sendPasswordResetEmail } = require("../../utils/mailer");

//register service
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
    [email],
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
    [first_name, last_name, email, hashedPassword, phone],
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
    [result.insertId],
  );

  return users[0];
};

//login service
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
    [email],
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

  const isPasswordValid = await comparePassword(password, user.password);

  if (!isPasswordValid) {
    const error = new Error("Invalid email or password");
    error.statusCode = 401;
    throw error;
  }

  delete user.password;

  return user;
};

//forget password  service
const forgotPasswordService = async (email) => {
  const db = getDb();

  const [users] = await db.execute(
    `SELECT id, first_name, email
     FROM users
     WHERE email = ?
     LIMIT 1`,
    [email],
  );

  if (users.length === 0) {
    return;
  }

  const user = users[0];

  await db.execute(
    `DELETE FROM password_reset_tokens
     WHERE user_id = ?`,
    [user.id],
  );
  const resetToken = generateResetToken();
  const tokenHash = hashResetToken(resetToken);
  const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

  await db.execute(
    `INSERT INTO password_reset_tokens
      (user_id, token_hash, expires_at)
     VALUES (?, ?, ?)`,
    [user.id, tokenHash, expiresAt],
  );

  const resetUrl = `http://localhost:5173/reset-password/${resetToken}`;

  await sendPasswordResetEmail(user.email, resetUrl);
};

const resetPasswordService = async (token, newPassword) => {
  const db = getDb();

  const tokenHash = hashResetToken(token);

  const [tokens] = await db.execute(
    `SELECT
      id,
      user_id,
      expires_at
     FROM password_reset_tokens
     WHERE token_hash = ?
     LIMIT 1`,
    [tokenHash],
  );

  if (tokens.length === 0) {
    const error = new Error("Invalid or expired reset link");

    error.statusCode = 400;

    throw error;
  }

  const resetRecord = tokens[0];

  // Check expiration
  const currentTime = new Date();
  const expiryTime = new Date(resetRecord.expires_at);

  if (currentTime > expiryTime) {
    await db.execute(
      `DELETE FROM password_reset_tokens
       WHERE id = ?`,
      [resetRecord.id],
    );

    const error = new Error("This reset link has expired");

    error.statusCode = 400;

    throw error;
  }
  const hashedPassword = await hashPassword(newPassword);

  const [result] = await db.execute(
    `UPDATE users
     SET password = ?
     WHERE id = ?`,
    [hashedPassword, resetRecord.user_id],
  );

  console.log("PASSWORD UPDATE RESULT:", result.affectedRows);

  await db.execute(
    `DELETE FROM password_reset_tokens
     WHERE id = ?`,
    [resetRecord.id],
  );

  return true;
};
module.exports = {
  registerUserService,
  loginUserService,
  resetPasswordService,
  forgotPasswordService,
};

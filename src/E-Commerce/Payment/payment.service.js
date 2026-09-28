const { getDb } = require("../../Configurations/db.config");

// Get payment methods
const getPaymentMethods = async (userId) => {
  const db = getDb();

  const [rows] = await db.query(
    `
    SELECT
      id,
      user_id,
      method_type,
      provider,
      display_name,
      upi_id,
      last_four,
      is_default,
      created_at
    FROM payment_methods
    WHERE user_id = ?
    ORDER BY is_default DESC, created_at DESC
    `,
    [userId],
  );

  return rows;
};

// Add payment method
const createPaymentMethod = async (userId, paymentData) => {
  const db = getDb();

  const { method_type, provider, display_name, upi_id, last_four, is_default } =
    paymentData;

  // If new method is default,
  // remove default from existing methods
  if (is_default) {
    await db.query(
      `
      UPDATE payment_methods
      SET is_default = FALSE
      WHERE user_id = ?
      `,
      [userId],
    );
  }

  const [result] = await db.query(
    `
    INSERT INTO payment_methods
    (
      user_id,
      method_type,
      provider,
      display_name,
      upi_id,
      last_four,
      is_default
    )
    VALUES (?, ?, ?, ?, ?, ?, ?)
    `,
    [
      userId,
      method_type,
      provider || null,
      display_name || null,
      upi_id || null,
      last_four || null,
      is_default ? 1 : 0,
    ],
  );

  return result.insertId;
};

// Update payment method
const updatePaymentMethod = async (userId, paymentId, paymentData) => {
  const db = getDb();

  const { method_type, provider, display_name, upi_id, last_four, is_default } =
    paymentData;

  const [existing] = await db.query(
    `
    SELECT id
    FROM payment_methods
    WHERE id = ? AND user_id = ?
    `,
    [paymentId, userId],
  );

  if (existing.length === 0) {
    return false;
  }

  if (is_default) {
    await db.query(
      `
      UPDATE payment_methods
      SET is_default = FALSE
      WHERE user_id = ?
      `,
      [userId],
    );
  }

  await db.query(
    `
    UPDATE payment_methods
    SET
      method_type = ?,
      provider = ?,
      display_name = ?,
      upi_id = ?,
      last_four = ?,
      is_default = ?
    WHERE id = ? AND user_id = ?
    `,
    [
      method_type,
      provider || null,
      display_name || null,
      upi_id || null,
      last_four || null,
      is_default ? 1 : 0,
      paymentId,
      userId,
    ],
  );

  return true;
};

// Delete payment method
const deletePaymentMethod = async (userId, paymentId) => {
  const db = getDb();

  const [result] = await db.query(
    `
    DELETE FROM payment_methods
    WHERE id = ? AND user_id = ?
    `,
    [paymentId, userId],
  );

  return result.affectedRows > 0;
};

// Set default payment method
const setDefaultPaymentMethod = async (userId, paymentId) => {
  const db = getDb();

  const [existing] = await db.query(
    `
    SELECT id
    FROM payment_methods
    WHERE id = ? AND user_id = ?
    `,
    [paymentId, userId],
  );

  if (existing.length === 0) {
    return false;
  }

  await db.query(
    `
    UPDATE payment_methods
    SET is_default = FALSE
    WHERE user_id = ?
    `,
    [userId],
  );

  await db.query(
    `
    UPDATE payment_methods
    SET is_default = TRUE
    WHERE id = ? AND user_id = ?
    `,
    [paymentId, userId],
  );

  return true;
};

module.exports = {
  getPaymentMethods,
  createPaymentMethod,
  updatePaymentMethod,
  deletePaymentMethod,
  setDefaultPaymentMethod,
};

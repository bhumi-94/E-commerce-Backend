const { getDb } = require("../../Configurations/db.config");

// Get all addresses of logged-in user
const getAddresses = async (userId) => {
  const db = getDb();

  const [rows] = await db.query(
    `
    SELECT
      id,
      user_id,
      first_name,
      last_name,
      phone,
      address_line1,
      address_line2,
      city,
      state,
      pincode,
      country,
      address_type,
      is_default,
      created_at
    FROM addresses
    WHERE user_id = ?
    ORDER BY is_default DESC, created_at DESC
    `,
    [userId]
  );

  return rows;
};

// Create address
const createAddress = async (userId, addressData) => {
  const db = getDb();

  const {
    first_name,
    last_name,
    phone,
    address_line1,
    address_line2,
    city,
    state,
    pincode,
    country,
    address_type,
    is_default,
  } = addressData;

  if (is_default) {
    await db.query(
      `
      UPDATE addresses
      SET is_default = FALSE
      WHERE user_id = ?
      `,
      [userId]
    );
  }

  const [result] = await db.query(
    `
    INSERT INTO addresses
    (
      user_id,
      first_name,
      last_name,
      phone,
      address_line1,
      address_line2,
      city,
      state,
      pincode,
      country,
      address_type,
      is_default
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
    [
      userId,
      first_name,
      last_name || null,
      phone,
      address_line1,
      address_line2 || null,
      city,
      state,
      pincode,
      country || "India",
      address_type || "Home",
      is_default ? 1 : 0,
    ]
  );

  return result.insertId;
};

// Update address
const updateAddress = async (
  userId,
  addressId,
  addressData
) => {
  const db = getDb();

  const {
    first_name,
    last_name,
    phone,
    address_line1,
    address_line2,
    city,
    state,
    pincode,
    country,
    address_type,
    is_default,
  } = addressData;

  // Check ownership
  const [existing] = await db.query(
    `
    SELECT id
    FROM addresses
    WHERE id = ? AND user_id = ?
    `,
    [addressId, userId]
  );

  if (existing.length === 0) {
    return false;
  }

  if (is_default) {
    await db.query(
      `
      UPDATE addresses
      SET is_default = FALSE
      WHERE user_id = ?
      `,
      [userId]
    );
  }

  await db.query(
    `
    UPDATE addresses
    SET
      first_name = ?,
      last_name = ?,
      phone = ?,
      address_line1 = ?,
      address_line2 = ?,
      city = ?,
      state = ?,
      pincode = ?,
      country = ?,
      address_type = ?,
      is_default = ?
    WHERE id = ? AND user_id = ?
    `,
    [
      first_name,
      last_name || null,
      phone,
      address_line1,
      address_line2 || null,
      city,
      state,
      pincode,
      country || "India",
      address_type || "Home",
      is_default ? 1 : 0,
      addressId,
      userId,
    ]
  );

  return true;
};

// Delete address
const deleteAddress = async (userId, addressId) => {
  const db = getDb();

  const [result] = await db.query(
    `
    DELETE FROM addresses
    WHERE id = ? AND user_id = ?
    `,
    [addressId, userId]
  );

  return result.affectedRows > 0;
};

// Set default address
const setDefaultAddress = async (
  userId,
  addressId
) => {
  const db = getDb();

  const [existing] = await db.query(
    `
    SELECT id
    FROM addresses
    WHERE id = ? AND user_id = ?
    `,
    [addressId, userId]
  );

  if (existing.length === 0) {
    return false;
  }

  await db.query(
    `
    UPDATE addresses
    SET is_default = FALSE
    WHERE user_id = ?
    `,
    [userId]
  );

  await db.query(
    `
    UPDATE addresses
    SET is_default = TRUE
    WHERE id = ? AND user_id = ?
    `,
    [addressId, userId]
  );

  return true;
};

module.exports = {
  getAddresses,
  createAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
};
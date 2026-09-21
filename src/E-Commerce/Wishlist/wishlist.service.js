const { getDb } = require("../../Configurations/db.config");

/* =========================
   GET WISHLIST
========================= */

const getWishlistService = async (userId) => {
  const db = getDb();

  const [wishlistItems] = await db.execute(
    `
    SELECT
      wi.id,
      wi.product_id,

      p.name,
      p.description,
      p.price,
      p.image,
      p.stock_quantity,
      p.category_id,

      c.name AS category_name

    FROM wishlist_items wi

    INNER JOIN products p
      ON wi.product_id = p.id

    LEFT JOIN categories c
      ON p.category_id = c.id

    WHERE wi.user_id = ?

    ORDER BY wi.created_at DESC
    `,
    [userId],
  );

  return wishlistItems;
};

/* =========================
   ADD TO WISHLIST
========================= */

const addToWishlistService = async (userId, productId) => {
  const db = getDb();

  // Check product exists
  const [products] = await db.execute(
    `
    SELECT
      id,
      name,
      description,
      price,
      image,
      stock_quantity,
      category_id
    FROM products
    WHERE id = ?
      AND is_active = TRUE
    LIMIT 1
    `,
    [productId],
  );

  if (products.length === 0) {
    const error = new Error("Product not found");

    error.statusCode = 404;

    throw error;
  }

  // Add product to wishlist
  await db.execute(
    `
    INSERT INTO wishlist_items
      (user_id, product_id)
    VALUES
      (?, ?)

    ON DUPLICATE KEY UPDATE
      product_id = product_id
    `,
    [userId, productId],
  );

  return getWishlistService(userId);
};

/* =========================
   REMOVE FROM WISHLIST
========================= */

const removeFromWishlistService = async (userId, productId) => {
  const db = getDb();

  const [result] = await db.execute(
    `
    DELETE FROM wishlist_items
    WHERE user_id = ?
      AND product_id = ?
    `,
    [userId, productId],
  );

  if (result.affectedRows === 0) {
    const error = new Error("Wishlist item not found");

    error.statusCode = 404;

    throw error;
  }

  return getWishlistService(userId);
};

/* =========================
   CLEAR WISHLIST
========================= */

const clearWishlistService = async (userId) => {
  const db = getDb();

  await db.execute(
    `
    DELETE FROM wishlist_items
    WHERE user_id = ?
    `,
    [userId],
  );

  return [];
};

module.exports = {
  getWishlistService,
  addToWishlistService,
  removeFromWishlistService,
  clearWishlistService,
};

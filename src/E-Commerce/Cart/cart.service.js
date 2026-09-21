const { getDb } = require("../../Configurations/db.config");

const getCartService = async (userId) => {
  const db = getDb();

  const [cartItems] = await db.execute(
    `
    SELECT
      ci.id,
      ci.product_id,
      ci.quantity,

      p.name,
      p.description,
      p.price,
      p.image,
      p.stock_quantity,
      p.category_id,

      c.name AS category_name

    FROM cart_items ci

    INNER JOIN products p
      ON ci.product_id = p.id

    LEFT JOIN categories c
      ON p.category_id = c.id

    WHERE ci.user_id = ?

    ORDER BY ci.created_at DESC
    `,
    [userId],
  );

  return cartItems;
};


const addToCartService = async (userId, productId, quantity = 1) => {
  const db = getDb();

  // Check product exists
  const [products] = await db.execute(
    `
    SELECT
      id,
      name,
      price,
      stock_quantity,
      image,
      description,
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

  const product = products[0];

  // Validate quantity
  if (!Number.isInteger(Number(quantity)) || Number(quantity) < 1) {
    const error = new Error("Quantity must be at least 1");
    error.statusCode = 400;
    throw error;
  }

  // Check stock
  if (product.stock_quantity < Number(quantity)) {
    const error = new Error("Not enough stock available");
    error.statusCode = 400;
    throw error;
  }

  // Add / increase existing cart item
  await db.execute(
    `
    INSERT INTO cart_items
      (user_id, product_id, quantity)
    VALUES
      (?, ?, ?)

    ON DUPLICATE KEY UPDATE
      quantity = quantity + VALUES(quantity)
    `,
    [userId, productId, Number(quantity)],
  );

  // Check final quantity after adding
  const [cartItem] = await db.execute(
    `
    SELECT quantity
    FROM cart_items
    WHERE user_id = ?
      AND product_id = ?
    LIMIT 1
    `,
    [userId, productId],
  );

  if (cartItem.length > 0 && cartItem[0].quantity > product.stock_quantity) {
    // Restore previous quantity if stock exceeded
    await db.execute(
      `
      UPDATE cart_items
      SET quantity = quantity - ?
      WHERE user_id = ?
        AND product_id = ?
      `,
      [Number(quantity), userId, productId],
    );

    const error = new Error(
      `Only ${product.stock_quantity} items are available`,
    );

    error.statusCode = 400;

    throw error;
  }

  return getCartService(userId);
};
const updateCartQuantityService = async (userId, productId, quantity) => {
  const db = getDb();

  const newQuantity = Number(quantity);

  if (!Number.isInteger(newQuantity) || newQuantity < 1) {
    const error = new Error("Quantity must be at least 1");

    error.statusCode = 400;

    throw error;
  }

  // Check product
  const [products] = await db.execute(
    `
    SELECT
      id,
      stock_quantity
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

  if (newQuantity > products[0].stock_quantity) {
    const error = new Error(
      `Only ${products[0].stock_quantity} items are available`,
    );

    error.statusCode = 400;

    throw error;
  }

  const [result] = await db.execute(
    `
    UPDATE cart_items
    SET quantity = ?
    WHERE user_id = ?
      AND product_id = ?
    `,
    [newQuantity, userId, productId],
  );

  if (result.affectedRows === 0) {
    const error = new Error("Cart item not found");

    error.statusCode = 404;

    throw error;
  }

  return getCartService(userId);
};
const removeFromCartService = async (userId, productId) => {
  const db = getDb();

  const [result] = await db.execute(
    `
    DELETE FROM cart_items
    WHERE user_id = ?
      AND product_id = ?
    `,
    [userId, productId],
  );

  if (result.affectedRows === 0) {
    const error = new Error("Cart item not found");

    error.statusCode = 404;

    throw error;
  }

  return getCartService(userId);
};

const clearCartService = async (userId) => {
  const db = getDb();

  await db.execute(
    `
    DELETE FROM cart_items
    WHERE user_id = ?
    `,
    [userId],
  );

  return [];
};

module.exports = {
  getCartService,
  addToCartService,
  updateCartQuantityService,
  removeFromCartService,
  clearCartService,
};

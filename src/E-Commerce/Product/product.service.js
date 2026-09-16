const { getDb } = require("../../Configurations/db.config");
const fs = require("fs");
const path = require("path");

const deleteProductImage = (imagePath) => {
  if (!imagePath) {
    return;
  }

  const filePath = path.join(
    __dirname,
    "../../../",
    imagePath.replace(/^\/+/, ""),
  );

  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
    console.log("Old product image deleted:", filePath);
  }
};
// Get all products
const getAllProductsService = async () => {
  const db = getDb();

  const [products] = await db.execute(
    `SELECT
      p.id,
      p.category_id,
      c.name AS category_name,
      p.name,
      p.description,
      p.price,
      p.stock_quantity,
      p.image,
      p.is_active,
      p.is_featured,
      p.created_at,
      p.updated_at
     FROM products p
     INNER JOIN categories c
       ON p.category_id = c.id
     ORDER BY p.created_at DESC`,
  );

  return products;
};

// Get one product by ID
const getProductByIdService = async (productId) => {
  const db = getDb();

  const [products] = await db.execute(
    `SELECT
      p.id,
      p.category_id,
      c.name AS category_name,
      p.name,
      p.description,
      p.price,
      p.stock_quantity,
      p.image,
      p.is_active,
      p.is_featured,
      p.created_at,
      p.updated_at
     FROM products p
     INNER JOIN categories c
       ON p.category_id = c.id
     WHERE p.id = ?
     LIMIT 1`,
    [productId],
  );

  if (products.length === 0) {
    const error = new Error("Product not found");
    error.statusCode = 404;
    throw error;
  }

  return products[0];
};

// Create product
const createProductService = async ({
  category_id,
  name,
  description,
  price,
  stock_quantity,
  image,
  is_active,
  is_featured,
}) => {
  const db = getDb();

  // Validate category
  const [categories] = await db.execute(
    `SELECT id
     FROM categories
     WHERE id = ?
       AND is_active = TRUE
     LIMIT 1`,
    [category_id],
  );

  if (categories.length === 0) {
    const error = new Error("Category not found or inactive");
    error.statusCode = 400;
    throw error;
  }

  // Validate product name
  if (!name || !name.trim()) {
    const error = new Error("Product name is required");
    error.statusCode = 400;
    throw error;
  }

  // Validate price
  if (
    price === undefined ||
    price === null ||
    price === "" ||
    Number(price) < 0
  ) {
    const error = new Error("Valid product price is required");
    error.statusCode = 400;
    throw error;
  }

  // Validate stock
  if (
    stock_quantity === undefined ||
    stock_quantity === null ||
    stock_quantity === "" ||
    Number(stock_quantity) < 0
  ) {
    const error = new Error("Valid stock quantity is required");
    error.statusCode = 400;
    throw error;
  }

  const [result] = await db.execute(
    `INSERT INTO products
    (
      category_id,
      name,
      description,
      price,
      stock_quantity,
      image,
      is_active,
      is_featured
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      category_id,
      name.trim(),
      description ? description.trim() : null,
      Number(price),
      Number(stock_quantity),
      image || null,
      is_active !== undefined ? is_active : true,
      is_featured !== undefined ? is_featured : false,
    ],
  );

  return getProductByIdService(result.insertId);
};

// Update product
const updateProductService = async (
  productId,
  {
    category_id,
    name,
    description,
    price,
    stock_quantity,
    image,
    is_active,
    is_featured,
  },
) => {
  const db = getDb();

  const existingProduct = await getProductByIdService(productId);

  // Validate category
  if (category_id !== undefined) {
    const [categories] = await db.execute(
      `SELECT id
       FROM categories
       WHERE id = ?
         AND is_active = TRUE
       LIMIT 1`,
      [category_id],
    );

    if (categories.length === 0) {
      const error = new Error("Category not found or inactive");
      error.statusCode = 400;
      throw error;
    }
  }

  // Validate name
  if (!name || !name.trim()) {
    const error = new Error("Product name is required");
    error.statusCode = 400;
    throw error;
  }

  const finalCategoryId =
    category_id !== undefined ? category_id : existingProduct.category_id;

  const finalDescription =
    description !== undefined ? description : existingProduct.description;

  const finalPrice =
    price !== undefined ? Number(price) : existingProduct.price;

  const finalStock =
    stock_quantity !== undefined
      ? Number(stock_quantity)
      : existingProduct.stock_quantity;

  const finalImage = image !== undefined ? image : existingProduct.image;

  if (image !== undefined && image !== existingProduct.image) {
    deleteProductImage(existingProduct.image);
  }

  const finalIsActive =
    is_active !== undefined ? is_active : existingProduct.is_active;

  const finalIsFeatured =
    is_featured !== undefined ? is_featured : existingProduct.is_featured;

  if (finalPrice < 0) {
    const error = new Error("Price cannot be negative");
    error.statusCode = 400;
    throw error;
  }

  if (finalStock < 0) {
    const error = new Error("Stock quantity cannot be negative");
    error.statusCode = 400;
    throw error;
  }

  await db.execute(
    `UPDATE products
     SET
       category_id = ?,
       name = ?,
       description = ?,
       price = ?,
       stock_quantity = ?,
       image = ?,
       is_active = ?,
       is_featured = ?
     WHERE id = ?`,
    [
      finalCategoryId,
      name.trim(),
      finalDescription ? finalDescription.trim() : null,
      finalPrice,
      finalStock,
      finalImage,
      finalIsActive,
      finalIsFeatured,
      productId,
    ],
  );

  return getProductByIdService(productId);
};

// Delete product
const deleteProductService = async (productId) => {
  const db = getDb();

  const existingProduct = await getProductByIdService(productId);

  await db.execute(
    `DELETE FROM products
     WHERE id = ?`,
    [productId],
  );

  deleteProductImage(existingProduct.image);

  return {
    message: "Product deleted successfully",
  };
};

module.exports = {
  getAllProductsService,
  getProductByIdService,
  createProductService,
  updateProductService,
  deleteProductService,
};

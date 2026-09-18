const { getDb } = require("../../Configurations/db.config");
const fs = require("fs");
const path = require("path");

const deleteCategoryImage = (imagePath) => {
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
  }
};
// Get all categories
const getAllCategoriesService = async () => {
  const db = getDb();

  const [categories] = await db.execute(
    `SELECT
      id,
      name,
      image,
      is_active,
      created_at,
      updated_at
     FROM categories
     ORDER BY created_at DESC`,
  );

  return categories;
};
// Get one category
const getCategoryByIdService = async (categoryId) => {
  const db = getDb();

  const [categories] = await db.execute(
    `SELECT
      id,
      name,
      image,
      is_active,
      created_at,
      updated_at
     FROM categories
     WHERE id = ?
     LIMIT 1`,
    [categoryId],
  );

  if (categories.length === 0) {
    const error = new Error("Category not found");
    error.statusCode = 404;
    throw error;
  }

  return categories[0];
};
// Create category
const createCategoryService = async ({ name, image }) => {
  const db = getDb();

  if (!name || !name.trim()) {
    const error = new Error("Category name is required");
    error.statusCode = 400;
    throw error;
  }

  const [existingCategory] = await db.execute(
    `SELECT id
     FROM categories
     WHERE name = ?
     LIMIT 1`,
    [name.trim()],
  );

  if (existingCategory.length > 0) {
    const error = new Error("Category already exists");
    error.statusCode = 409;
    throw error;
  }

  const [result] = await db.execute(
    `INSERT INTO categories
     (name, image)
     VALUES (?, ?)`,
    [name.trim(), image || null],
  );

  return getCategoryByIdService(result.insertId);
};
// Update category
const updateCategoryService = async (
  categoryId,
  { name, image, is_active },
) => {
  const db = getDb();

  const existingCategory = await getCategoryByIdService(categoryId);

  if (!name || !name.trim()) {
    const error = new Error("Category name is required");
    error.statusCode = 400;
    throw error;
  }

  const finalImage = image !== undefined ? image : existingCategory.image;
  if (image !== undefined && image !== existingCategory.image) {
    deleteCategoryImage(existingCategory.image);
  }

  const finalIsActive =
    is_active !== undefined ? is_active : existingCategory.is_active;

  await db.execute(
    `UPDATE categories
     SET
       name = ?,
       image = ?,
       is_active = ?
     WHERE id = ?`,
    [name.trim(), finalImage, finalIsActive, categoryId],
  );

  return getCategoryByIdService(categoryId);
};
// Delete category
const deleteCategoryService = async (categoryId) => {
  const db = getDb();

  await getCategoryByIdService(categoryId);

  try {
    await db.execute(
      `DELETE FROM categories
       WHERE id = ?`,
      [categoryId],
    );
    deleteCategoryImage(existingCategory.image);
    return {
      message: "Category deleted successfully",
    };
  } catch (error) {
    if (error.code === "ER_ROW_IS_REFERENCED_2") {
      const newError = new Error(
        "Cannot delete category because products are using it",
      );

      newError.statusCode = 409;
      throw newError;
    }

    throw error;
  }
};
module.exports = {
  getAllCategoriesService,
  getCategoryByIdService,
  createCategoryService,
  updateCategoryService,
  deleteCategoryService,
};

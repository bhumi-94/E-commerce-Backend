const categoryService = require("./category.service");

// GET /api/categories
const getAllCategoriesController = async (req, res, next) => {
  try {
    const categories = await categoryService.getAllCategoriesService();
    return res.status(200).json({
      success: true,
      message: "Categories fetched successfully",
      categories,
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/categories/:id
const getCategoryByIdController = async (req, res, next) => {
  try {
    const { id } = req.params;
    const category = await categoryService.getCategoryByIdService(id);
    return res.status(200).json({
      success: true,
      message: "Category fetched successfully",
      category,
    });
  } catch (error) {
    next(error);
  }
};
// POST /api/categories
const createCategoryController = async (req, res, next) => {
  try {
    const { name } = req.body;
    const image = req.file ? `/uploads/categories/${req.file.filename}` : null;
    const category = await categoryService.createCategoryService({
      name,
      image,
    });
    return res.status(201).json({
      success: true,
      message: "Category created successfully",
      category,
    });
  } catch (error) {
    next(error);
  }
};
// PUT /api/categories/:id
const updateCategoryController = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, is_active } = req.body;
    const image = req.file
      ? `/uploads/categories/${req.file.filename}`
      : undefined;
    const category = await categoryService.updateCategoryService(id, {
      name,
      image,
      is_active,
    });
    return res.status(200).json({
      success: true,
      message: "Category updated successfully",
      category,
    });
  } catch (error) {
    next(error);
  }
};
// DELETE /api/categories/:id
const deleteCategoryController = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await categoryService.deleteCategoryService(id);
    return res.status(200).json({
      success: true,
      ...result,
    });
  } catch (error) {
    next(error);
  }
};
module.exports = {
  getAllCategoriesController,
  getCategoryByIdController,
  createCategoryController,
  updateCategoryController,
  deleteCategoryController,
};

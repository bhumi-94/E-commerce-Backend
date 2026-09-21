const productService = require("./product.service");

// GET /api/products
const getAllProductsController = async (req, res, next) => {
  try {
    const products = await productService.getAllProductsService();
    return res.status(200).json({
      success: true,
      message: "Products fetched successfully",
      products,
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/products/:id
const getProductByIdController = async (req, res, next) => {
  try {
    const { id } = req.params;
    const product = await productService.getProductByIdService(id);
    return res.status(200).json({
      success: true,
      message: "Product fetched successfully",
      product,
    });
  } catch (error) {
    next(error);
  }
};
// POST /api/products
const createProductController = async (req, res, next) => {
  try {
    const {
      category_id,
      name,
      description,
      price,
      stock_quantity,
      is_active,
      is_featured,
    } = req.body;
    const image = req.file ? `/uploads/products/${req.file.filename}` : null;
    const product = await productService.createProductService({
      category_id,
      name,
      description,
      price,
      stock_quantity,
      image,
      is_active,
      is_featured,
    });
    return res.status(201).json({
      success: true,
      message: "Product created successfully",
      product,
    });
  } catch (error) {
    next(error);
  }
};
// PUT /api/products/:id
const updateProductController = async (req, res, next) => {
  try {
    const { id } = req.params;

    const {
      category_id,
      name,
      description,
      price,
      stock_quantity,
      is_active,
      is_featured,
    } = req.body;
    const image = req.file
      ? `/uploads/products/${req.file.filename}`
      : undefined;
    const product = await productService.updateProductService(id, {
      category_id,
      name,
      description,
      price,
      stock_quantity,
      image,
      is_active,
      is_featured,
    });
    return res.status(200).json({
      success: true,
      message: "Product updated successfully",
      product,
    });
  } catch (error) {
    next(error);
  }
};
// DELETE /api/products/:id
const deleteProductController = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await productService.deleteProductService(id);
    return res.status(200).json({
      success: true,
      ...result,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllProductsController,
  getProductByIdController,
  createProductController,
  updateProductController,
  deleteProductController,
};

const {
  getAllAdminProductsService,
  addAdminProductService,
} = require("./adminProduct.service");

const getAllAdminProducts = async (req, res) => {
  try {
    const products = await getAllAdminProductsService();

    return res.status(200).json({
      success: true,
      products,
    });
  } catch (error) {
    console.error("GET ADMIN PRODUCTS ERROR:", error);

    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Failed to fetch products",
    });
  }
};

const addAdminProduct = async (req, res) => {
  try {
    
    const {
      name,
      category_id,
      description,
      price,
      platform_fee,
      stock_quantity,
      is_featured,
    } = req.body;

    const image = req.file ? (req.file.secure_url || req.file.path) : null;
    // const image = req.file ? `/uploads/products/${req.file.filename}` : null;

    const product = await addAdminProductService({
      name,
      category_id,
      description,
      price,
      platform_fee,
      stock_quantity,
      image,
      is_featured,
    });

    return res.status(201).json({
      success: true,
      message: "Product added successfully",
      product,
    });
  } catch (error) {
    console.error("ADD ADMIN PRODUCT ERROR:", error);

    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Failed to add product",
    });
  }
};

module.exports = {
  getAllAdminProducts,
  addAdminProduct,
};
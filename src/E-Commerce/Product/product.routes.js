const express = require("express");
const productController = require("./product.controller");
const uploadProductImage = require("../../middleware/ProductUpload.middleware");
const authMiddleware = require("../../middleware/auth.middleware");
const adminMiddleware = require("../../middleware/admin.middleware");
const router = express.Router();

// PUBLIC
router.get("/", productController.getAllProductsController);
router.get("/:id", productController.getProductByIdController);
// ADMIN ONLY
router.post(
  "/",
  authMiddleware,
  adminMiddleware,
  uploadProductImage.single("image"),
  productController.createProductController,
);
router.put(
  "/:id",
  authMiddleware,
  adminMiddleware,
  uploadProductImage.single("image"),
  productController.updateProductController,
);
router.delete(
  "/:id",
  authMiddleware,
  adminMiddleware,
  productController.deleteProductController,
);

module.exports = router;


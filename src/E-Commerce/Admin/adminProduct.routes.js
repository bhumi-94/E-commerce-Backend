const express = require("express");
const {
  getAllAdminProducts,
  addAdminProduct,
} = require("./adminProducts.controller");

const authMiddleware = require("../../middleware/auth.middleware");
const adminMiddleware = require("../../middleware/admin.middleware");
const productUpload = require("../../middleware/ProductUpload.middleware");

const router = express.Router();

// Get all products
router.get("/", authMiddleware, adminMiddleware, getAllAdminProducts);

// Add product
router.post(
  "/",
  authMiddleware,
  adminMiddleware,
  productUpload.single("image"),
  addAdminProduct,
);

module.exports = router;

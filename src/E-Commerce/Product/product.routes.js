const express = require("express");
const productController = require("./product.controller");
const uploadProductImage = require("../../middleware/ProductUpload.middleware");
const router = express.Router();

router.get("/", productController.getAllProductsController);
router.get("/:id", productController.getProductByIdController);
router.post("/", uploadProductImage.single("image"), productController.createProductController);
router.put("/:id", uploadProductImage.single("image"), productController.updateProductController);
router.delete("/:id", productController.deleteProductController);

module.exports = router;

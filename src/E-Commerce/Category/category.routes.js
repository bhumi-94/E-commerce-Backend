const express = require("express");

const categoryController = require("./category.controller");
const uploadCategoryImage = require("../../middleware/categoryUpload.middleware");

const router = express.Router();

router.get("/", categoryController.getAllCategoriesController);

router.get("/:id", categoryController.getCategoryByIdController);

router.post(
  "/",
  uploadCategoryImage.single("image"),
  categoryController.createCategoryController,
);

router.put(
  "/:id",
  uploadCategoryImage.single("image"),
  categoryController.updateCategoryController,
);

router.delete("/:id", categoryController.deleteCategoryController);

module.exports = router;

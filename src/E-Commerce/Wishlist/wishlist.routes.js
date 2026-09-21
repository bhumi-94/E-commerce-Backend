const express = require("express");

const wishlistController = require("./wishlist.controller");
const authMiddleware = require("../../middleware/auth.middleware");

const router = express.Router();
router.get("/", authMiddleware, wishlistController.getWishlistController);
router.post("/", authMiddleware, wishlistController.addToWishlistController);
router.delete(
  "/:productId",
  authMiddleware,
  wishlistController.removeFromWishlistController,
);
router.delete("/", authMiddleware, wishlistController.clearWishlistController);

module.exports = router;

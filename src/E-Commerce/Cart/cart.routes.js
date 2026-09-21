const express = require("express");

const cartController = require("./cart.controller");
const authMiddleware = require("../../middleware/auth.middleware");

const router = express.Router();

router.get("/", authMiddleware, cartController.getCartController);
router.post("/", authMiddleware, cartController.addToCartController);
router.put(
  "/:productId",
  authMiddleware,
  cartController.updateCartQuantityController,
);
router.delete(
  "/:productId",
  authMiddleware,
  cartController.removeFromCartController,
);
router.delete("/", authMiddleware, cartController.clearCartController);

module.exports = router;

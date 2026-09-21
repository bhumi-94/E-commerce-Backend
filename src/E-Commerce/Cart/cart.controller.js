const cartService = require("./cart.service");

const getCartController = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const cart = await cartService.getCartService(userId);

    return res.status(200).json({
      success: true,
      message: "Cart fetched successfully",
      cart,
    });
  } catch (error) {
    next(error);
  }
};
const addToCartController = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const { product_id, quantity = 1 } = req.body;

    if (!product_id) {
      return res.status(400).json({
        success: false,
        message: "Product ID is required",
      });
    }

    const cart = await cartService.addToCartService(
      userId,
      product_id,
      quantity,
    );

    return res.status(200).json({
      success: true,
      message: "Product added to cart",
      cart,
    });
  } catch (error) {
    next(error);
  }
};
const updateCartQuantityController = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const { productId } = req.params;

    const { quantity } = req.body;

    const cart = await cartService.updateCartQuantityService(
      userId,
      productId,
      quantity,
    );

    return res.status(200).json({
      success: true,
      message: "Cart quantity updated",
      cart,
    });
  } catch (error) {
    next(error);
  }
};
const removeFromCartController = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const { productId } = req.params;

    const cart = await cartService.removeFromCartService(userId, productId);

    return res.status(200).json({
      success: true,
      message: "Product removed from cart",
      cart,
    });
  } catch (error) {
    next(error);
  }
};

const clearCartController = async (req, res, next) => {
  try {
    const userId = req.user.id;

    await cartService.clearCartService(userId);

    return res.status(200).json({
      success: true,
      message: "Cart cleared successfully",
      cart: [],
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getCartController,
  addToCartController,
  updateCartQuantityController,
  removeFromCartController,
  clearCartController,
};

const wishlistService = require("./wishlist.service");

/* =========================
   GET WISHLIST
========================= */

const getWishlistController = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const wishlist = await wishlistService.getWishlistService(userId);

    return res.status(200).json({
      success: true,
      message: "Wishlist fetched successfully",
      wishlist,
    });
  } catch (error) {
    next(error);
  }
};

/* =========================
   ADD TO WISHLIST
========================= */

const addToWishlistController = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const { product_id } = req.body;

    if (!product_id) {
      return res.status(400).json({
        success: false,
        message: "Product ID is required",
      });
    }

    const wishlist = await wishlistService.addToWishlistService(
      userId,
      product_id,
    );

    return res.status(200).json({
      success: true,
      message: "Product added to wishlist",
      wishlist,
    });
  } catch (error) {
    next(error);
  }
};

/* =========================
   REMOVE FROM WISHLIST
========================= */

const removeFromWishlistController = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const { productId } = req.params;

    const wishlist = await wishlistService.removeFromWishlistService(
      userId,
      productId,
    );

    return res.status(200).json({
      success: true,
      message: "Product removed from wishlist",
      wishlist,
    });
  } catch (error) {
    next(error);
  }
};

/* =========================
   CLEAR WISHLIST
========================= */

const clearWishlistController = async (req, res, next) => {
  try {
    const userId = req.user.id;

    await wishlistService.clearWishlistService(userId);

    return res.status(200).json({
      success: true,
      message: "Wishlist cleared successfully",
      wishlist: [],
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getWishlistController,
  addToWishlistController,
  removeFromWishlistController,
  clearWishlistController,
};

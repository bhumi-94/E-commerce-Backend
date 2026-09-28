const { createOrderService , getOrdersService } = require("./order.service");


const createOrder = async (req, res) => {
  try {
    const userId = req.user.id;

    const { addressId, paymentMethodId, shippingAmount } = req.body;

    if (!addressId) {
      return res.status(400).json({
        success: false,
        message: "Delivery address is required",
      });
    }

    const order = await createOrderService(
      userId,
      addressId,
      paymentMethodId || null,
      shippingAmount || 0,
    );

    return res.status(201).json({
      success: true,
      message: "Order placed successfully",
      order,
    });
  } catch (error) {
    console.error("CREATE ORDER ERROR:", error);

    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Failed to place order",
    });
  }
};

const getOrders = async (req, res) => {
  try {
    const userId = req.user.id;

    const orders = await getOrdersService(userId);

    return res.status(200).json({
      success: true,
      orders,
    });
  } catch (error) {
    console.error("GET ORDERS ERROR:", error);

    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Failed to fetch orders",
    });
  }
};

module.exports = {
  createOrder,
  getOrders
};

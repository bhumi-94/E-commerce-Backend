const {
  getPaymentMethods,
  createPaymentMethod,
  updatePaymentMethod,
  deletePaymentMethod,
  setDefaultPaymentMethod,
} = require("./payment.service");


// GET /api/payment-methods
const getAllPaymentMethods = async (req, res) => {
  try {
    const userId = req.user.id;

    const methods = await getPaymentMethods(userId);

    return res.status(200).json({
      success: true,
      paymentMethods: methods,
    });

  } catch (error) {
    console.error(
      "GET PAYMENT METHODS ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to fetch payment methods",
    });
  }
};


// POST /api/payment-methods
const addPaymentMethod = async (req, res) => {
  try {
    const userId = req.user.id;

    const {
      method_type,
    } = req.body;

    if (!method_type) {
      return res.status(400).json({
        success: false,
        message: "Payment method type is required",
      });
    }

    const paymentId =
      await createPaymentMethod(
        userId,
        req.body
      );

    return res.status(201).json({
      success: true,
      message: "Payment method added successfully",
      paymentId,
    });

  } catch (error) {
    console.error(
      "ADD PAYMENT METHOD ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to add payment method",
    });
  }
};


// PUT /api/payment-methods/:id
const editPaymentMethod = async (req, res) => {
  try {
    const userId = req.user.id;
    const paymentId = req.params.id;

    const updated =
      await updatePaymentMethod(
        userId,
        paymentId,
        req.body
      );

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: "Payment method not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Payment method updated successfully",
    });

  } catch (error) {
    console.error(
      "UPDATE PAYMENT METHOD ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to update payment method",
    });
  }
};


// DELETE /api/payment-methods/:id
const removePaymentMethod = async (req, res) => {
  try {
    const userId = req.user.id;
    const paymentId = req.params.id;

    const deleted =
      await deletePaymentMethod(
        userId,
        paymentId
      );

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Payment method not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Payment method deleted successfully",
    });

  } catch (error) {
    console.error(
      "DELETE PAYMENT METHOD ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to delete payment method",
    });
  }
};


// PUT /api/payment-methods/:id/default
const makeDefaultPaymentMethod = async (
  req,
  res
) => {
  try {
    const userId = req.user.id;
    const paymentId = req.params.id;

    const updated =
      await setDefaultPaymentMethod(
        userId,
        paymentId
      );

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: "Payment method not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Default payment method updated",
    });

  } catch (error) {
    console.error(
      "DEFAULT PAYMENT METHOD ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to set default payment method",
    });
  }
};


module.exports = {
  getAllPaymentMethods,
  addPaymentMethod,
  editPaymentMethod,
  removePaymentMethod,
  makeDefaultPaymentMethod,
};
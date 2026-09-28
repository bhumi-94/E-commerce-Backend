const {
  getAddresses,
  createAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
} = require("./address.service");

// GET /api/addresses
const getAllAddresses = async (req, res) => {
  try {
    const userId = req.user.id;

    const addresses = await getAddresses(userId);

    return res.status(200).json({
      success: true,
      addresses,
    });
  } catch (error) {
    console.error("GET ADDRESSES ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch addresses",
    });
  }
};

// POST /api/addresses
const addAddress = async (req, res) => {
  try {
    const userId = req.user.id;

    const { first_name, phone, address_line1, city, state, pincode } = req.body;

    if (
      !first_name ||
      !phone ||
      !address_line1 ||
      !city ||
      !state ||
      !pincode
    ) {
      return res.status(400).json({
        success: false,
        message: "Please fill all required fields",
      });
    }

    const addressId = await createAddress(userId, req.body);

    return res.status(201).json({
      success: true,
      message: "Address added successfully",
      addressId,
    });
  } catch (error) {
    console.error("ADD ADDRESS ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to add address",
    });
  }
};

// PUT /api/addresses/:id
const editAddress = async (req, res) => {
  try {
    const userId = req.user.id;
    const addressId = req.params.id;

    const updated = await updateAddress(userId, addressId, req.body);

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: "Address not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Address updated successfully",
    });
  } catch (error) {
    console.error("UPDATE ADDRESS ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update address",
    });
  }
};

// DELETE /api/addresses/:id
const removeAddress = async (req, res) => {
  try {
    const userId = req.user.id;
    const addressId = req.params.id;

    const deleted = await deleteAddress(userId, addressId);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Address not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Address deleted successfully",
    });
  } catch (error) {
    console.error("DELETE ADDRESS ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete address",
    });
  }
};

// PUT /api/addresses/:id/default
const makeDefaultAddress = async (req, res) => {
  try {
    const userId = req.user.id;
    const addressId = req.params.id;

    const updated = await setDefaultAddress(userId, addressId);

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: "Address not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Default address updated",
    });
  } catch (error) {
    console.error("DEFAULT ADDRESS ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to set default address",
    });
  }
};

module.exports = {
  getAllAddresses,
  addAddress,
  editAddress,
  removeAddress,
  makeDefaultAddress,
};

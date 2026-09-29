const {
  getSettingsService,
  updateSettingsService,
} = require("./settings.service");

// ==========================================
// GET SETTINGS
// ==========================================
const getSettings = async (req, res) => {
  try {
    const userId = req.user.id;

    const settings =
      await getSettingsService(userId);

    return res.status(200).json({
      success: true,
      settings,
    });
  } catch (error) {
    console.error(
      "GET SETTINGS ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to fetch settings",
    });
  }
};

// ==========================================
// UPDATE SETTINGS
// ==========================================
const updateSettings = async (req, res) => {
  try {
    const userId = req.user.id;

    const settings =
      await updateSettingsService(
        userId,
        req.body
      );

    return res.status(200).json({
      success: true,
      message: "Settings updated successfully",
      settings,
    });
  } catch (error) {
    console.error(
      "UPDATE SETTINGS ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to update settings",
    });
  }
};

module.exports = {
  getSettings,
  updateSettings,
};
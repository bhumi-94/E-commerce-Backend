const profileService = require("./profile.service");

// ===============================
// GET PROFILE
// ===============================
const getProfileController = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const user = await profileService.getProfileService(userId);

    return res.status(200).json({
      success: true,
      message: "Profile fetched successfully",
      user,
    });
  } catch (error) {
    console.error("GET PROFILE CONTROLLER ERROR:", error);
    next(error);
  }
};

// ===============================
// UPDATE PROFILE
// ===============================
const updateProfileController = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const { first_name, last_name, phone, date_of_birth, gender } = req.body;

    // ==========================================
    // CLOUDINARY PROFILE IMAGE
    // ==========================================
    let profileImage = null;

    if (req.file) {
      // multer-storage-cloudinary provides
      // the complete Cloudinary URL in req.file.path
      profileImage = req.file.path;

      console.log("Cloudinary profile image URL:", profileImage);
    }

    // ==========================================
    // UPDATE PROFILE IN DATABASE
    // ==========================================
    const user = await profileService.updateProfileService(userId, {
      first_name,
      last_name,
      phone,
      date_of_birth,
      gender,
      profile_image: profileImage,
    });

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user,
    });
  } catch (error) {
    console.error("UPDATE PROFILE CONTROLLER ERROR:", error);
    next(error);
  }
};

module.exports = {
  getProfileController,
  updateProfileController,
};

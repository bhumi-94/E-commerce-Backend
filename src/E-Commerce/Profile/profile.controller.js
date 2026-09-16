const profileService = require("./profile.service");

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
    next(error);
  }
};

const updateProfileController = async (req, res, next) => {
  try {
    const userId = req.user.id
    const { first_name, last_name, phone, date_of_birth, gender } = req.body;
    let profileImage = null;

    if (req.file) {
      profileImage = `/uploads/profile/${req.file.filename}`;
    }
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

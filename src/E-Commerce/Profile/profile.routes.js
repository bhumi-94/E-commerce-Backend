const express = require("express");

const profileController = require("./profile.controller");
const authMiddleware = require("../../middleware/auth.middleware");
const uploadProfileImage = require("../../middleware/profileUpload.middleware");
const router = express.Router();

router.get("/", authMiddleware, profileController.getProfileController);

router.put(
  "/",
  authMiddleware,
  uploadProfileImage.single("profile_image"),
  profileController.updateProfileController,
);

module.exports = router;

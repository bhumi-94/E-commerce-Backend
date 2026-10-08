const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../Configurations/cloudinary");

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "nexora/profile-images",
    allowed_formats: ["jpg", "jpeg", "png", "webp"],
  },
});

module.exports = storage;

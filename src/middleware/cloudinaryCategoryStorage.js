const { CloudinaryStorage } = require("multer-storage-cloudinary");

const cloudinary = require("../Configurations/cloudinary");

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "nexora/category-images",
    allowed_formats: ["jpg", "jpeg", "png", "webp"],
  },
});
module.exports = storage;

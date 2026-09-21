const express = require("express");
const authController = require("../Auth/auth.controller");
const authMiddleware = require("../../middleware/auth.middleware");
const router = express.Router();


router.post("/register", authController.registerUserController);
router.post("/login", authController.loginUserController);
router.post("/forgot-password", authController.forgotPasswordController);
router.post("/reset-password", authController.resetPasswordController);
router.get("/me", authMiddleware, authController.getCurrentUserController);
router.post("/logout", authController.logoutUserController);


module.exports = router;


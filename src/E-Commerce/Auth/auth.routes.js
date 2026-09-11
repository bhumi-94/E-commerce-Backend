const express = require("express");
const authController = require("../Auth/auth.controller");

const router = express.Router();

// Auth Routes..
router.post("/register", authController.registerUserController);
router.post("/login", authController.loginUserController);
router.post("/forgot-password", authController.forgotPasswordController);
router.post("/reset-password", authController.resetPasswordController);

module.exports = router;

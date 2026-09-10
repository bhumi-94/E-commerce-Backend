const express = require("express");
const authController = require("../Auth/auth.controller");

const router = express.Router();


// Auth Routes..
router.post("/register", authController.registerUserController);
router.post("/login", authController.loginUserController);

module.exports = router;
const express = require("express");

const feedbackController = require("../Feedback/feedback.controller.js")
const  authMiddleware = require("../../middleware/auth.middleware.js");

const router = express.Router();

router.post("/", authMiddleware, feedbackController.submitFeedback);
router.get("/", feedbackController.getAllFeedback);


module.exports = router;

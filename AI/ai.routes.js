const express = require("express");
const aiController = require("./ai.controller");

const router = express.Router();
router.post("/chat", aiController.chatController);

router.post(
  "/generate-description",
  aiController.generateDescriptionController,
);

module.exports = router;

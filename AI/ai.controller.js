const aiService = require("./ai.service");

const chatController = async (req, res, next) => {
  try {
    const { message } = req.body;

    if (typeof message !== "string" || !message.trim()) {
      return res.status(400).json({
        success: false,
        message: "Message is required",
      });
    }

    const result = await aiService.generateAIResponse(message.trim());

    return res.status(200).json({
      success: true,
      reply: result.reply,
      products: result.products || [],
    });
  } catch (error) {
    console.error("AI CHAT ERROR:", error);
    next(error);
  }
};

module.exports = {
  chatController,
};

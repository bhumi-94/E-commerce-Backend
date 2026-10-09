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

const generateDescriptionController = async (req, res, next) => {
  try {
    const { name, category, price, features } = req.body;

    if (typeof name !== "string" || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: "Product name is required",
      });
    }

    const description = await aiService.generateProductDescription({
      name: name.trim(),
      category: typeof category === "string" ? category.trim() : "",
      price: price ?? "",
      features: typeof features === "string" ? features.trim() : "",
    });

    return res.status(200).json({
      success: true,
      description,
    });
  } catch (error) {
    console.error("AI DESCRIPTION ERROR:", error);
    next(error);
  }
};

module.exports = {
  chatController,
  generateDescriptionController,
};

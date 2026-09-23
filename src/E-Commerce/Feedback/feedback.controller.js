const  feedbackService = require("./feedback.service");

// Submit feedback
const submitFeedback = async (req, res) => {
  try {
    const { feedbackText, city, country } = req.body;

    if (!feedbackText || !feedbackText.trim()) {
      return res.status(400).json({
        success: false,
        message: "Feedback is required",
      });
    }

    const userId = req.user.id;

    const feedbackId = await feedbackService.createFeedback({
      userId,
      feedbackText: feedbackText.trim(),
      city,
      country,
    });

    return res.status(201).json({
      success: true,
      message: "Feedback submitted successfully",
      feedbackId,
    });
  } catch (error) {
    console.error("SUBMIT FEEDBACK ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to submit feedback",
    });
  }
};

// Get all testimonials
const getAllFeedback = async (req, res) => {
  try {
    const feedback = await feedbackService.getFeedback();

    return res.status(200).json({
      success: true,
      feedback,
    });
  } catch (error) {
    console.error("GET FEEDBACK ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch feedback",
    });
  }
};


module.exports = { submitFeedback , getAllFeedback }
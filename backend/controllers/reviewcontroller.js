const mongoose = require("mongoose");
const { analyzeCode } = require("../utils/openaiUtils"); // Use utility instead of config
const Submission = require("../models/Submission");

const runCodeReview = async (req, res) => {
  try {
    const { submissionId } = req.params;

    // Validate MongoDB ObjectId format
    if (!mongoose.Types.ObjectId.isValid(submissionId)) {
      return res.status(400).json({ message: "Invalid submission ID." });
    }

    // Find the submission in the database
    const submission = await Submission.findById(submissionId);
    if (!submission) {
      return res.status(404).json({ message: "Submission not found." });
    }

    // Check if AI feedback already exists
    if (submission.aiFeedback && submission.aiFeedback.length > 0) {
      // Return existing feedback without running a new analysis
      return res.status(200).json({
        message: "AI feedback retrieved from database.",
        aiFeedback: submission.aiFeedback
      });
    }

    // Run AI-powered code analysis
    const aiAnalysis = await analyzeCode(submission.code, submission.language);
    if (!aiAnalysis.success) {
      return res.status(500).json({ 
        message: "AI analysis failed.", 
        error: aiAnalysis.error 
      });
    }

    // Clean up the feedback to remove any markdown or formatting
    const cleanedFeedback = aiAnalysis.feedback.map(item => ({
      line: item.line,
      severity: item.severity,
      message: item.message.replace(/\*\*/g, '').trim(),
      suggestion: item.suggestion.replace(/\*\*/g, '').trim()
    }));

    // Save AI feedback to the database
    submission.aiFeedback = cleanedFeedback;
    await submission.save();

    // Return the complete feedback
    res.status(200).json({
      message: "AI analysis complete.",
      aiFeedback: cleanedFeedback
    });
  } catch (error) {
    console.error("Code Review Error:", error);
    res.status(500).json({ 
      message: "Error analyzing code.", 
      error: error.message 
    });
  }
};

module.exports = { runCodeReview };

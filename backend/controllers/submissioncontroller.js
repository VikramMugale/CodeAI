const Submission = require("../models/Submission"); // adjust if named differently

const getAllSubmissions = async (req, res) => {
  try {
    const submissions = await Submission.find({ userId: req.user.userId });
    res.json(submissions);
  } catch (error) {
    console.error("Error fetching submissions:", error);
    res.status(500).json({ error: "Failed to fetch submissions" });
  }
};

module.exports = { getAllSubmissions };

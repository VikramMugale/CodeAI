const fs = require("fs");
const path = require("path");
const Submission = require("../models/Submission");

const uploadFile = async (req, res) => {
  try {
    console.log("Request received for file upload");
    console.log("User data from JWT:", req.user);
    console.log("File received:", req.file);

    if (!req.file) {
      console.log("No file found in request");
      return res.status(400).json({ message: "No file uploaded." });
    }

    const filePath = path.join(__dirname, "../uploads", req.file.filename);

    // Validate file path existence before reading
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ message: "Uploaded file not found on server." });
    }

    const fileContent = fs.readFileSync(filePath, "utf-8");

    const newSubmission = await Submission.create({
      userId: req.user.userId,
      filename: req.file.filename,
      code: fileContent,
      language: path.extname(req.file.filename).substring(1),
    });

    console.log("✅ Submission saved with ID:", newSubmission._id);

    return res.json({
      message: "File uploaded successfully",
      submissionId: newSubmission._id,
      filename: req.file.originalname
    });
  } catch (error) {
    console.error("❌ Upload error:", error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = { uploadFile };

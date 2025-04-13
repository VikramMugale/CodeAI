const mongoose = require("mongoose");

const SubmissionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  filename: String,
  code: String,
  language: String,
  aiFeedback: [
    {
      line: Number,
      severity: String,
      message: String,
      suggestion: String,
    },
  ],
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Submission", SubmissionSchema);

const express = require("express");
const authMiddleware = require("../middleware/authmiddleware");
const { runCodeReview } = require("../controllers/reviewcontroller");

const router = express.Router();

router.get("/:submissionId", authMiddleware, runCodeReview);

module.exports = router;

const express = require("express");
const router = express.Router();
const { getAllSubmissions } = require("../controllers/submissioncontroller");
const authenticateToken = require("../middleware/authmiddleware");

router.get("/submissions", authenticateToken, getAllSubmissions);

module.exports = router;

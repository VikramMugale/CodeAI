const express = require("express");
const cors = require("cors");
require("dotenv").config();
const connectDB = require("./config/db");

const authRoutes = require("./routes/authroutes");
const uploadRoutes = require("./routes/uploadroutes");
const reviewRoutes = require("./routes/reviewroutes");
const submissionRoutes = require("./routes/submissionroutes");

const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));

// Database Connection
connectDB();




// Routes
app.use("/api/auth", authRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/review", reviewRoutes);
app.use("/api", submissionRoutes);


// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
app.get("/", (req, res) => {
  res.send("Hello World");
});
app.get("/api/test-review", async (req, res) => {
  const { analyzeCode } = require("./utils/openaiUtils");
  const result = await analyzeCode("def add(a, b): return a + b", "python");
  res.send(result || "Failed to fetch AI feedback");
});


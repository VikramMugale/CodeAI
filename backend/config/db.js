const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const conn = await mongoose.connect('mongodb+srv://delta:9VYFibSmGJILecf1@cluster0.tle7v.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    process.exit(1); // Exit the process on failure
  }
};

module.exports = connectDB;

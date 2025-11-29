const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb+srv://testsumit73_db_user:oLlHe8nZjtuX7r8G@cluster0.m8ixoop.mongodb.net/?appName=Cluster0', {
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

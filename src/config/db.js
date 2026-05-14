const mongoose = require("mongoose");

async function connectToDB() {
  try {
    console.log("Mongo URI:", process.env.MONGODB_URI);

    await mongoose.connect(process.env.MONGODB_URI);

    console.log("DB Connected");
  } catch (error) {
    console.log("Error in Connecting DB:", error.message);
    process.exit(1);
  }
}

module.exports = connectToDB;
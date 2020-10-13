const mongoose = require("mongoose");
const config = require("config");
const db = config.get("mongoURI");

const connectDB = async () => {
  try {
    await mongoose.connect(db, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false
    });
    //This is a promise

    console.log("MongoDB Connected...");
    //Success message
  } catch (err) {
    console.error(err.message);
    //Gives us an error message
    process.exit(1);
    //exits out of the try catch with a failure
  }
};

module.exports = connectDB;

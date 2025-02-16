const mongoose = require("mongoose");
require("dotenv").config();

const mongoDB = async () => {
  try {
    const connecter = await mongoose.connect(process.env.MONGOURI);
    if (connecter) {
      console.log("Connected");
    } else {
      console.log("");
    }
  } catch (error) {
    console.log(error);
  }
};

module.exports = mongoDB;

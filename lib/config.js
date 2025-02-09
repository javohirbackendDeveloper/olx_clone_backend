const mongoose = require("mongoose");
require("dotenv").config();

const mongoDB = async () => {
  try {
    const connecter = await mongoose.connect(process.env.MONGOURI);
    console.log("Connected");
  } catch (error) {
    console.log(error);
  }
};

module.exports = mongoDB;

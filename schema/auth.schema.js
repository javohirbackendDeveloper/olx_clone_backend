const { Schema, model } = require("mongoose");

const authSchema = new Schema(
  {
    username: {
      type: String,
      unique: true,
      minLength: [3, "You should write more than 3 characters"],
    },
    password: {
      type: String,
      minLength: [6, "You should write more than 6 characters"],
    },

    location: {
      type: String,
      default: "O'zbekiston",
    },
    user_image: {
      type: String,
      default: "",
    },
    phone_number: {
      type: String,
    },
    user_products: {
      type: Array,
      default: [],
    },
    buyed_products: {
      type: Array,
      default: [],
    },
    liked_products: {
      type: Array,
      default: [],
    },
    searched_products: {
      type: Array,
      default: [],
    },
    user_talks: {
      type: Array,
      default: [],
    },

    role: {
      type: String,
      enum: {
        values: ["user", "admin"],
      },
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

module.exports = model("Auths", authSchema);

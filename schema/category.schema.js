const { Schema, model } = require("mongoose");

const categorySchema = new Schema(
  {
    category_name: {
      type: String,
      required: true,
      unique: true,
    },
    image: {
      type: String,
      required: true,
      unique: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

module.exports = model("Category", categorySchema);

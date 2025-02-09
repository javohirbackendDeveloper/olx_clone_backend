const { Schema, model } = require("mongoose");

const productSchema = new Schema(
  {
    user_id: {
      type: String,
      required: true,
    },
    product_name: {
      type: String,
    },
    product_image: {
      type: String,
    },
    product_likes: {
      type: Array,
      default: [],
    },
    quantity: {
      type: Number,
      default: 1,
    },
    description: {
      type: String,
    },
    product_price: {
      type: Number,
      default: 0,
      min: [0, "Siz 0 dan kichik narx kirita olmaysiz"],
      required: true,
    },
    type_price: {
      type: String,
      enum: {
        values: ["so'm", "usd", "euro"],
        message: "{VALUE}-mavjud emas",
      },
    },
    added_date: {
      type: Date,
      default: new Date(),
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    category: {
      type: String,
      // required: true,
    },
    location: {
      type: String,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

module.exports = model("Products", productSchema);

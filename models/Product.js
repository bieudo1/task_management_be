const mongoose = require("mongoose");
const productSchema = new mongoose.Schema(
  {
    productname: {
      type: String,
      required: true,
    },
    describe: { type: String, required: false, default: "" },
    image: {
      type: String,
      required: false,
      default: "",
    },
    price: {
      type: Number,
      required: false,
    },
    size: {
      type: Array,
      required: false,
    },
    classify: {
      type: Schema.Types.ObjectId,
      required: false,
      ref: "Classify",
    },
    language: {
      type: String,
      required: true,
      enum: ["vi", "en"],
    },
    isDeleted: { type: Boolean, default: false, required: true },
  },
  {
    timestamps: true,
  }
);

const Product = mongoose.model("Product", productSchema);

module.exports = Product;

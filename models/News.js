const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const fileSchema = Schema(
  {
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    classify: { type: Schema.Types.ObjectId, required: false, ref: "Classify" },
    language: {
      type: String,
      required: true,
      enum: ["vi", "en"],
    },
  },
  {
    timestamps: true,
  }
);

const File = mongoose.model("File", fileSchema);

module.exports = File;

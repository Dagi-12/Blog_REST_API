const { required, types } = require("joi");
const mongoose = require("mongoose");

const categorySchema = mongoose.Schema(
  {
    title: { type: String, required: true },
    desc: { type: String, required: false },
    updatedBy: {
      type: mongoose.Types.ObjectId,
      ref: "user",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const CategorySchema = mongoose.model("category", categorySchema);

module.exports = CategorySchema;

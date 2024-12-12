const mongoose = require("mongoose");

const CourseSchema = new mongoose.Schema(
  {
    authorId: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    duration: { type: String, required: true, unique: true },
    image: { type: String, required: true },
    video: { type: String, required: true },
    password: { type: String, required: true },
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  }
);

module.exports = mongoose.model("courses", CourseSchema);

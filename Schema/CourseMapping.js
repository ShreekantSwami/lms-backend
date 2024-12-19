const mongoose = require("mongoose");

const CourseMapping = new mongoose.Schema(
  {
    courseId: { type: String, required: true },
    userId: [{ type: String, required: true }],
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  }
);

module.exports = mongoose.model("coursemappings", CourseMapping);

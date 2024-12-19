const mongoose = require("mongoose");

const CourseSchema = new mongoose.Schema(
  {
    authorId: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    duration: { type: String },
    // imageUrl: { type: String,required:true },
    videoUrl: { type: String, required: true, unqiue: true },
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  }
);

module.exports = mongoose.model("courses", CourseSchema);

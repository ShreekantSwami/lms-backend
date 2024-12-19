const mongoose = require("mongoose");

const UserMappingSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true }, // Array of user IDs
    courseId: [{ type: String, required: true }],
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  }
);

module.exports = mongoose.model("usermappings", UserMappingSchema);

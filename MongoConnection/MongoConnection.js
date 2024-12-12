const mongoose = require("mongoose");

mongoose
  .connect(
    "mongodb+srv://shree20012018:853742691sS@cluster0.fvkca.mongodb.net/LMS?retryWrites=true&w=majority&appName=Cluster0"
  )
  .then(() => console.log("Mongo server connected successfully"));

// mongoose.connect("mongodb://localhost:27017/LMS").then(() => {
//   console.log("Mongo Connected");
// });

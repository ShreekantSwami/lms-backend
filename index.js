const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const app = express();
app.use(express.urlencoded({ extended: false }));
app.use(cors());
app.use(bodyParser.json());
require("./MongoConnection/MongoConnection");
const userSchema = require("./Schema/UserSchema");


app.post("/api/checkUser", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: "Missing required fields" });
  }
  // Check if the user exists in the database
  const checkUser = await userSchema.findOne({ email: email });
  if (checkUser) {
    return res
      .status(200)
      .json({ message: "User Present", checkUser: checkUser });
  }
  return res.status(400).json({ message: "User Doesn't Exists" });
});

app.post("/api/saveUser", async (req, res) => {
  const data = req.body;
  console.log(data);

  // Validate the input data (e.g., check for empty fields, validate email format)
  if (!data.fname || !data.lname || !data.email || !data.password) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  // Check if the email already exists in the database
  const existingUser = await userSchema.findOne({ email: data.email });
  if (existingUser) {
    return res.status(409).json({ message: "User already exists" });
  }

  // Create a new user document
  const response = new userSchema({
    firstName: data.fname,
    lastName: data.lname,
    email: data.email,
    password: data.password,
  });

  try {
    // Save the user document to the database
    await response.save();
    res.json({ message: "User saved successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error saving user" });
  }
});




app.listen(1402, (req, res) => {
  console.log("Srever is running on port 1402");
});

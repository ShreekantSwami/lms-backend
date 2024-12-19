const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const app = express();
app.use(express.urlencoded({ extended: false }));
app.use(cors());
app.use(bodyParser.json());
require("./MongoConnection/MongoConnection");
const userSchema = require("./Schema/UserSchema");
const CourseSchema = require("./Schema/CourseSchema");
const CourseMapping = require("./Schema/CourseMapping");
const UserMapping = require("./Schema/UserMapping");

app.post("/api/checkUser", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: "Missing required fields" });
  }
  // Check if the user exists in the database
  const checkUser = await userSchema.findOne({ email: email });
  if (checkUser) {
    return res.status(200).json({
      message: `${checkUser.role} Login Successfull`,
      checkUser: checkUser,
    });
  }
  return res.status(400).json({ message: "User Doesn't Exists" });
});

app.post("/api/saveUser", async (req, res) => {
  const data = req.body;
  console.log(data);

  // Validate the input data (e.g., check for empty fields, validate email format)
  if (
    !data.fname ||
    !data.lname ||
    !data.email ||
    !data.password ||
    !data.role
  ) {
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
    role: data.role,
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
app.post("/api/saveTutor", async (req, res) => {
  const data = req.body;
  console.log(data);

  // Validate the input data (e.g., check for empty fields, validate email format)
  if (
    !data.fname ||
    !data.lname ||
    !data.email ||
    !data.password ||
    !data.role
  ) {
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
    role: data.role,
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

app.post("/api/createCourse", async (req, res) => {
  const { authorId, description, duration, title, videoUrl } = req.body;
  console.log(authorId, description, duration, title, videoUrl);
  if (!authorId || !description || !duration || !title || !videoUrl) {
    return res.status(400).json({ message: "Missing required fields" });
  }
  const response = new CourseSchema({
    authorId,
    description,
    duration,
    title,
    videoUrl,
  });
  await response.save();
});

app.get("/api/getAllCourses", async (req, res) => {
  try {
    const courses = await CourseSchema.find({});
    res.json(courses);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching courses" });
  }
});

app.post("/api/getCoursesById", async (req, res) => {
  const { tutorId } = req.body;
  console.log(tutorId);
  if (!tutorId) {
    return res.status(400).json({ message: "Missing required fields" });
  }
  try {
    const course = await CourseSchema.find({ authorId: tutorId });
    console.dir(course);
    res.json(course);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching course" });
  }
});
const mongoose = require("mongoose");

app.post("/api/getSpecificCourse", async (req, res) => {
  const { courseId } = req.body;
  // const courseId  = "6761a123f1d826073df532db";

  // Validate if courseId is provided
  if (!courseId) {
    return res
      .status(400)
      .json({ success: false, message: "Missing required fields: courseId" });
  }

  try {
    // Fetch the course from the database
    const course = await CourseSchema.findById(courseId);

    // Check if the course exists
    if (!course) {
      return res
        .status(404)
        .json({ success: false, message: "Course not found" });
    }

    console.log("Fetched course:", course); // Useful for debugging
    res.status(200).json({ success: true, data: course });
  } catch (error) {
    console.error("Error fetching course:", error); // Better error logs
    res.status(500).json({
      success: false,
      message: "Error fetching course",
      error: error.message,
    });
  }
});

app.post("/api/EnrollCourse", async (req, res) => {
  const { courseId, userId } = req.body;

  try {
    // Check if a record with the given courseId exists
    const existingCourse = await CourseMapping.findOne({ courseId });
    const existingUser = await UserMapping.findOne({ userId });

    if (existingUser) {
      // If course exists, add the userId to the userIds array
      await UserMapping.updateOne(
        { userId },
        { $addToSet: { courseId: courseId } } // $addToSet ensures no duplicate userId
      );
    } else {
      // If course doesn't exist, create a new record
      const newCourse = new UserMapping({
        userId: userId, // Initialize with the userId in an array
        courseId: courseId,
        // Initialize with the userId in an array
      });
      await newCourse.save();
    }

    if (existingCourse) {
      // If course exists, add the userId to the userIds array
      await CourseMapping.updateOne(
        { courseId },
        { $addToSet: { userId: userId } } // $addToSet ensures no duplicate userId
      );
      return res.status(200).json({ message: "Course Enrolled" });
    } else {
      // If course doesn't exist, create a new record
      const newCourse = new CourseMapping({
        courseId,
        userId: userId, // Initialize with the userId in an array
      });
      await newCourse.save();
      return res.status(201).json({ message: "Course Enrolled" });
    }
  } catch (error) {
    console.error("Error enrolling user to course:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

app.post("/api/GetUserCourses", async (req, res) => {
  const { userId } = req.body;

  if (!userId) {
    return res.status(400).json({ error: "userId is required." });
  }

  try {
    // Fetch the course IDs for the given userId
    const userCourses = await UserMapping.findOne({ userId });
    if (
      !userCourses ||
      !userCourses.courseId ||
      userCourses.courseId.length === 0
    ) {
      return res.status(404).json({ error: "No courses found for this user." });
    }

    // Fetch course details for the found course IDs
    const courses = await CourseSchema.find({
      _id: { $in: userCourses.courseId },
    });

    // Return the course data in JSON format
    return res.status(200).json({
      userId,
      courses,
    });
  } catch (error) {
    console.error("Error fetching courses for user:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});


app.listen(1402, (req, res) => {
  console.log("Srever is running on port 1402");
});

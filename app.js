// entry files
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

// middleware
const app = express();
app.use(express.json());
app.use(cors());
//  static file access
app.use("/uploads", express.static("uploads"));

// login/register routes
const userAuth = require("./routes/loginRoute");
app.use("/userAuth", userAuth);

// classroom routes
const classrooms = require("./routes/classroomRouter");
app.use("/classroom", classrooms);

// teacher routes
const teacher = require("./routes/teacherRouter");
app.use("/teacher", teacher);

// parent routes
const parent = require("./routes/parentRoute");
app.use("/parent", parent);

// attendance route
const attendance = require ("./routes/attendanceRouter")
app.use("/attendance", attendance)

// result route
const result = require("./routes/resultRoute");
app.use("/result", result);

// student route
const student = require ("./routes/studentRoute")
app.use("/student", student)

const assignments = require("./routes/assigmentRouter");
app.use("/assignments", assignments);

// fee route
const fee = require("./routes/feeRoute");
// app.use("/fee",fee)
app.use(express.json()); // VERY IMPORTANT
app.use("/fee", fee);

// announcement Route
const announcement = require("./routes/announcementRoute");
app.use("/announcement", announcement);

// teacher dashboard route
const teacherDashboard = require("./routes/teacherDashRoute");
app.use("/teacherDash", teacherDashboard);
// admin dashboard route
const admin = require("./routes/adminRouter")
app.use("/admin",admin)

// mongoose.connection to the db
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("connected to MongoDb"))
  .catch((err) => console.log("MongoDB connection error", err));

const Port = 3001;
app.listen(Port, () => {
  console.log(`server is runing on port ${Port}`);
});

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// USER SCHEMA 
const userSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true,unique:true },
    password: { type: String, required: true },
    isActive: { type: Boolean, default: true },
    role: {type: String,enum: ["admin", "teacher", "parent"],required: true,},
    teacher: {type: mongoose.Schema.Types.ObjectId,ref: "Teacher",default: null,},
    parent: {type: mongoose.Schema.Types.ObjectId,ref: "Parent",default: null,},
  },
  { timestamps: true }
);

//  TEACHER SCHEMA 
const teacherSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String },
    phone: { type: String },
    subject: { type: String },
  },
  { timestamps: true }
);

// PARENT SCHEMA 
const parentSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String },
    phone: { type: String, required: true },
    nationalId: { type: String, required: true, unique: true },
    address: { type: String },
  },
  { timestamps: true }
);

// CLASSROOM SCHEMA 
const classroomSchema = new Schema(
  {
    name: { type: String, required: true },
    gradeLevel: { type: String },
    classYear: { type: Number },
    teacher: {type: mongoose.Schema.Types.ObjectId,ref: "Teacher",default: null,},
    students: [{ type: mongoose.Schema.Types.ObjectId, ref: "Student", default: null }],
  },
  { timestamps: true }
);

// STUDENT SCHEMA 
const studentSchema = new Schema(
  {
    name: { type: String, required: true },
    dateOfBirth: { type: Date, required: true },
    gender: { type: String },
    photo: { type: String },
    admissionNumber: { type: String, required: "true",unique:true },
    classroom: { type: mongoose.Schema.Types.ObjectId, ref: "Classroom" },
    parent: { type: mongoose.Schema.Types.ObjectId, ref: "Parent" },
  },
  { timestamps: true }
);

// ASSIGNMENT SCHEMA 
const assignmentSchema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    dueDate: { type: Date },
    classroom: { type: mongoose.Schema.Types.ObjectId, ref: "Classroom" },
    postedBy: { type: mongoose.Schema.Types.ObjectId, ref: "Teacher" },
  },
  { timestamps: true }
);

//  RESULT SCHEMA 
const resultSchema = new Schema({
    student: {type: mongoose.Schema.Types.ObjectId,ref: "Student",required: true,},
    subject: { type: String, required: true },
    marks: { type: Number, required: true },
    grade: { type: String },
    term: {type: String,enum: ["Term 1", "Term 2", "Term 3"],
      required: true,
    },
    year: { type: Number, required: true },
    teacher: { type: mongoose.Schema.Types.ObjectId, ref: "Teacher" },
  },
  { timestamps: true }
);

//  FEE SCHEMA 
const feeSchema = new Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
    },
    amountDue: { type: Number, required: true },
    amountPaid: { type: Number, default: 0 },
    year: { type: Number, required: true },
    term: { type: String },
    status: { type: String, enum: ["Completed", "Unpaid"], default: "Unpaid" },
    balance: { type: Number }, // NEW FIELD
  },
  { timestamps: true }
);


//  ATTENDANCE SCHEMA 
const attendanceSchema = new Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
    },
    date: { type: Date, required: true },
    status: {
      type: String,
      enum: ["Present", "Absent", "Late"],
      required: true,
    },
    markedBy: { type: mongoose.Schema.Types.ObjectId, ref: "Teacher" },
  },
  { timestamps: true }
);

// //  TIMETABLE SCHEMA 
// const timetableSchema = new Schema(
//   {
//     classroom: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Classroom",
//       required: true,
//     },
//     subject: { type: String, required: true },
//     day: {
//       type: String,
//       enum: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
//       required: true,
//     },
//     startTime: { type: String, required: true },
//     endTime: { type: String, required: true },
//     teacher: { type: mongoose.Schema.Types.ObjectId, ref: "Teacher" },
//   },
//   { timestamps: true }
// );

// //  ANNOUNCEMENT SCHEMA 
// const announcementSchema = new Schema({
//     title: { type: String, required: true },
//     message: { type: String, required: true },
//     target: {type: String,enum: ["All", "Teachers", "Parents", "Students", "Classroom"],default: "All",},
//     classroom: {type: mongoose.Schema.Types.ObjectId,ref: "Classroom",default: null,},
//     postedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
//   },
//   { timestamps: true }
// );


// ===================== SUBJECT SCHEMA (Optional) =====================
const subjectSchema = new Schema({
    name: { type: String, required: true, unique: true },
    code: { type: String, required: true },
    teacher: { type: mongoose.Schema.Types.ObjectId, ref: 'Teacher', default: null }
});


//  MODEL EXPORTS 
const User = mongoose.model("User", userSchema);
const Teacher = mongoose.model("Teacher", teacherSchema);
const Parent = mongoose.model("Parent", parentSchema);
const Classroom = mongoose.model("Classroom", classroomSchema);
const Student = mongoose.model("Student", studentSchema);
const Assignment = mongoose.model("Assignment", assignmentSchema);
const Result = mongoose.model("Result", resultSchema);
const Fee = mongoose.model("Fee", feeSchema);
const Attendance = mongoose.model("Attendance", attendanceSchema);
// const Timetable = mongoose.model("Timetable", timetableSchema);
// const Announcement = mongoose.model("Announcement", announcementSchema);
const Subject = mongoose.model("Subject", subjectSchema);

module.exports = {User,Teacher,Parent,Classroom,Student,Assignment,Result,Fee,Attendance,};

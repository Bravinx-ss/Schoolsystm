const { Student, Parent, Classroom } = require("../models/schoolDb");
const multer = require("multer");
const fs = require("fs");
const path = require("path");

// file location folder/directory
const upload = multer({ dest: "uploads/" });
exports.uploadsStudentPhoto = upload.single("photo");

exports.addStudent = async (req, res) => {
  try {
    // destructuring
    const {
      name,
      dateOfBirth,
      gender,
      admissionNumber,
      parentNationalId,
      classroomId,
    } = req.body;
    // check if the nationalid exists
    const parentExist = await Parent.findOne({ nationalId: parentNationalId });
    if (!parentExist)
      return res
        .status(404)
        .json({ message: "Parent with the provided national id not found" });

    // check if the student exist
    const studentExist = await Student.findOne({ admissionNumber });
    if (studentExist)
      return res.json({
        message: "Admission Number has already been assigned to someone else",
      });

    // check if the class exists
    const classExist = await Classroom.findById(classroomId);
    if (!classExist)
      return res.status(500).json({ message: "Classroom not found" });

    // prepare our upload file
    let photo = null;
    if (req.file) {
      const ext = path.extname(req.file.originalname);
      const newFileName = Date.now() + ext;
      const newPath = path.join("uploads", newFileName);
      fs.renameSync(req.file.path, newPath);
      photo = newPath.replace(/\\/g, "/");
    }

    // create a new student document
    const newStudent = new Student({
      name,
      dateOfBirth,
      gender,
      photo,
      admissionNumber,
      classroom: classExist._id,
      parent: parentExist._id,
    });
    const savedStudent = await newStudent.save();

    // adding a student to a class using the $addToSet to prevent duplicates
    await Classroom.findByIdAndUpdate(classExist._id, {
      $addToSet: { students: savedStudent._id }
    });
    console.log(savedStudent);
    res.status(201).json(savedStudent);
  } catch (error) {
    console.error("Add Student Error:", error);
    res.status(500).json({ message: error.message || "Internal Server Error" });
  }
};


// Get all students
exports.getAllStudents = async (req, res) => {
  try {
    const students = await Student.find()
      .populate("classroom")
      .populate("parent");
    res.status(200).json(students);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get single student
exports.getStudentById = async (req, res) => {
  try {
    const { id } = req.params;
    console.log("Fetching student with ID:", id);

    const student = await Student.findById(id)
      .populate("classroom")
      .populate("parent");

    if (!student) {
      console.log("Student not found for ID:", id);
      return res.status(404).json({ message: "Student not found" });
    }

    console.log("Student found:", student);
    res.status(200).json(student);
  } catch (error) {
    console.error("Error in getStudentById:", error.message);
    res.status(500).json({ message: error.message });
  }
};


// Update student
exports.updateStudent = async (req, res) => {
  try {
    const updated = await Student.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!updated) return res.status(404).json({ message: "Student not found" });
    res.status(200).json({ message: "Student updated", student: updated });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// Delete student
exports.deleteStudent = async (req, res) => {
  try {
    const deletedStudent = await Student.findByIdAndDelete(req.params.id);
    if (!deletedS) return res.status(404).json({ message: "Student not found" });
    // remove the student from classroom
    await Classroom.updateMany(
      {students:deletedStudent._id},
      {$pull:{students:deletedStudent._id}}
    )
    res.status(200).json({ message: "Student deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// // Add new student
// exports.addStudent = async (req, res) => {
//   try {
//     const {
//       name,
//       dateOfBirth,
//       gender,
//       photo,
//       admissionNumber,
//       classroom,
//       parent,
//     } = req.body;
//
//     const newStudent = new Student({
//       name,
//       dateOfBirth,
//       gender,
//       photo,
//       admissionNumber,
//       classroom,
//       parent,
//     });
//
//     const savedStudent = await newStudent.save();
//     res
//       .status(201)
//       .json({ message: "Student added successfully", student: savedStudent });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };
//
// // Get all students
// exports.getAllStudents = async (req, res) => {
//   try {
//     const students = await Student.find()
//       .populate("classroom")
//       .populate("parent");
//     res.status(200).json(students);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };
//
// // Get single student
// exports.getStudentById = async (req, res) => {
//   try {
//     const student = await Student.findById(req.params.id)
//       .populate("classroom")
//       .populate("parent");
//     if (!student) return res.status(404).json({ message: "Student not found" });
//     res.status(200).json(student);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };
//
// // Update student
// exports.updateStudent = async (req, res) => {
//   try {
//     const updated = await Student.findByIdAndUpdate(req.params.id, req.body, {
//       new: true,
//     });
//     if (!updated) return res.status(404).json({ message: "Student not found" });
//     res.status(200).json({ message: "Student updated", student: updated });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };
//
// // Delete student
// exports.deleteStudent = async (req, res) => {
//   try {
//     const deleted = await Student.findByIdAndDelete(req.params.id);
//     if (!deleted) return res.status(404).json({ message: "Student not found" });
//     res.status(200).json({ message: "Student deleted" });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };
//
// // // Optional: Find by name (used when marking attendance using name)
// // exports.findStudentByName = async (req, res) => {
// //   try {
// //     const { name } = req.params;
// //     const student = await Student.findOne({ name });
// //     if (!student) return res.status(404).json({ message: "Student not found" });
// //     res.status(200).json(student);
// //   } catch (error) {
// //     res.status(500).json({ message: error.message });
// //   }
// // };

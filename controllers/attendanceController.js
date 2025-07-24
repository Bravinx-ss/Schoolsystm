const { Attendance, Teacher, Student, User } = require("../models/schoolDb");

exports.addAttendance = async (req, res) => {
  try {
    const { student, date, status } = req.body;

    if (!student || !date || !status) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (!["Present", "Absent"].includes(status)) {
      return res.status(400).json({ message: "Invalid attendance status" });
    }

    const userId = req.user.userId;

    const teacherUser = await User.findById(userId);
    if (!teacherUser || teacherUser.role !== "teacher") {
      return res
        .status(403)
        .json({ message: "Only teachers can mark attendance" });
    }

    const teacherId = teacherUser.teacher;
    if (!teacherId) {
      return res
        .status(400)
        .json({ message: "Teacher ID not linked to user account" });
    }

    const normalizedDate = new Date(date);
    normalizedDate.setHours(0, 0, 0, 0);

    const alreadyMarked = await Attendance.findOne({
      student,
      date: normalizedDate,
    });
    if (alreadyMarked) {
      return res
        .status(400)
        .json({
          message: "Attendance already marked for this student on this date",
        });
    }

    const newAttendance = new Attendance({
      student,
      date: normalizedDate,
      status,
      markedBy: teacherId,
    });

    const saved = await newAttendance.save();

    res.status(201).json({
      message: "Attendance recorded successfully",
      data: saved,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// 2. Get All Attendance Records
exports.getAllAttendance = async (req, res) => {
  try {
    const records = await Attendance.find()
      .populate("student", "name admissionNumber")
      .populate("markedBy", "name");
    res.json(records);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


exports.getAttendanceByStudent = async (req, res) => {
  try {
    const { studentId } = req.params;
    const records = await Attendance.find({ student: studentId })
      .populate("student", "name admissionNumber")
      .populate("markedBy", "name");
    res.json(records);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// update attendance
exports.updateAttendance = async (req, res) => {
  try {
    const { status } = req.body;
    const updated = await Attendance.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!updated)
      return res.status(404).json({ message: "Attendance record not found" });
    res.json({ message: "Attendance updated", data: updated });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// delete attendance
exports.deleteAttendance = async (req, res) => {
  try {
    const deletedAttendance = await Attendance.findByIdAndDelete(req.params.id);

    if (!deletedAttendance)
      return res.status(404).json({ message: "Attendance record not found" });

    res
      .status(200)
      .json({ message: "Deleted attendance", data: deletedAttendance });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


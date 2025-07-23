const { Result, Student, Teacher } = require("../models/schoolDb");

// Add a result
exports.addResult = async (req, res) => {
  try {
    const { student, subject, marks, term, year, teacher } = req.body;

    // Optional: calculate grade based on marks
    let grade;
    if (marks >= 80) grade = "A";
    else if (marks >= 70) grade = "B";
    else if (marks >= 60) grade = "C";
    else if (marks >= 50) grade = "D";
    else grade = "E";

    const newResult = new Result({
      student,
      subject,
      marks,
      grade,
      term,
      year,
      teacher,
    });
    await newResult.save();

    res.status(201).json(newResult);
  } catch (error) {
    console.error("Error adding result:", error);
    res.status(500).json({ message: "Failed to add result" });
  }
};

// Get results for a student
exports.getResultsByStudent = async (req, res) => {
  try {
    const studentId = req.params.id;
    const results = await Result.find({ student: studentId })
      .populate("teacher", "name")
      .populate("student", "name");

    if (!results.length)
      return res.status(404).json({ message: "No results found" });

    res.status(200).json(results);
  } catch (error) {
    console.error("Error fetching results:", error);
    res.status(500).json({ message: "Failed to fetch results" });
  }
};

// Update a result
exports.updateResult = async (req, res) => {
  try {
    const resultId = req.params.id;
    const updateData = req.body;

    // Optionally recalculate grade
    if (updateData.marks !== undefined) {
      const marks = updateData.marks;
      if (marks >= 80) updateData.grade = "A";
      else if (marks >= 70) updateData.grade = "B";
      else if (marks >= 60) updateData.grade = "C";
      else if (marks >= 50) updateData.grade = "D";
      else updateData.grade = "E";
    }

    const updatedResult = await Result.findByIdAndUpdate(resultId, updateData, {
      new: true,
    });

    if (!updatedResult)
      return res.status(404).json({ message: "Result not found" });

    res.status(200).json(updatedResult);
  } catch (error) {
    console.error("Error updating result:", error);
    res.status(500).json({ message: "Failed to update result" });
  }
};

// Delete a result
exports.deleteResult = async (req, res) => {
  try {
    const resultId = req.params.id;
    const deleted = await Result.findByIdAndDelete(resultId);

    if (!deleted) return res.status(404).json({ message: "Result not found" });

    res.status(200).json({ message: "Result deleted successfully" });
  } catch (error) {
    console.error("Error deleting result:", error);
    res.status(500).json({ message: "Failed to delete result" });
  }
};

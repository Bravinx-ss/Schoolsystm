const mongoose = require("mongoose");
const { Fee, Student } = require("../models/schoolDb");

// const { Fee } = require("../models/schoolDb");

exports.addFee = async (req, res) => {
  try {
    const { student, amountDue, amountPaid, year, term } = req.body;

    if (!student || !amountDue || !year || !term) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // 🔍 Check for duplicate
    const existingFee = await Fee.findOne({ student, year, term });
    if (existingFee) {
      return res
        .status(409)
        .json({
          message:
            "Fee record already exists for this student, year, and term.",
        });
    }

    // ✅ Continue if not duplicate
    const balance = amountDue - amountPaid;
    const status = balance <= 0 ? "Completed" : "Unpaid";

    const fee = new Fee({
      student,
      amountDue,
      amountPaid,
      year,
      term,
      balance,
      status,
    });
    const savedFee = await fee.save();

    res.status(201).json({ message: "Fee recorded", data: savedFee });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};




// controllers/feeController.js
// const Fee = require("../models/feeModel");

exports.getFeesByStudent = async (req, res) => {
  try {
    const studentId = req.params.id;

    if (!studentId.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: "Invalid student ID format" });
    }

    const fees = await Fee.find({ student: studentId }).populate("student", "name admissionNumber");

    if (fees.length === 0) {
      return res.status(404).json({ message: "No fee records found for this student" });
    }

    res.json(fees);
  } catch (error) {
    console.error("Error fetching student fees:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};


// Get a list of students with total outstanding balances
exports.getStudentsWithFeeBalances = async (req, res) => {
  try {
    const results = await Fee.aggregate([
      {
        $match: {
          student: { $ne: null },
          balance: { $gt: 0 },
        },
      },
      {
        $group: {
          _id: "$student",
          totalAmountDue: { $sum: "$amountDue" },
          totalAmountPaid: { $sum: "$amountPaid" },
          totalBalance: { $sum: "$balance" },
        },
      },
      {
        $lookup: {
          from: "students",
          localField: "_id",
          foreignField: "_id",
          as: "student",
        },
      },
      {
        $unwind: "$student",
      },
      {
        $project: {
          _id: 0,
          studentId: "$student._id",
          name: "$student.name",
          admissionNumber: "$student.admissionNumber",
          totalAmountDue: 1,
          totalAmountPaid: 1,
          totalBalance: 1,
        },
      },
    ]);

    res.status(200).json(results);
  } catch (error) {
    console.error("Error fetching fee balances:", error);
    res.status(500).json({ message: "Server Error" });
  }
};




exports.updatePayment = async (req, res) => {
  try {
    const feeId = req.params.id;
    const { amountPaid } = req.body;

    const fee = await Fee.findById(feeId);
    if (!fee) return res.status(404).json({ message: "Fee record not found" });

    fee.amountPaid = amountPaid;
    fee.balance = fee.amountDue - amountPaid;
    fee.status = fee.balance <= 0 ? "Completed" : "Unpaid";

    await fee.save();

    res.json({ message: "Payment updated", fee });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// 4. Delete Fee (Admin only)
exports.deleteFee = async (req, res) => {
  try {
    const fee = await Fee.findByIdAndDelete(req.params.id);
    if (!fee) {
      return res.status(404).json({ message: "Fee record not found" });
    }
    res.json({ message: "Fee record deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


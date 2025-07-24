const {Announcement, Classroom} = require("../models/schoolDb");
// const Classroom = require("../models/Classroom");

// CREATE an announcement
exports.createAnnouncement = async (req, res) => {
  try {
    const { title, message, target, classroom } = req.body;

    if (!title || !message || !target) {
      return res
        .status(400)
        .json({ message: "Title, message, and target are required" });
    }

    // If target is 'Classroom', validate classroom ID
    let classroomRef = null;
    if (target === "Classroom") {
      if (!classroom) {
        return res
          .status(400)
          .json({
            message:
              "Classroom ID is required for classroom-specific announcements.",
          });
      }
      const foundClassroom = await Classroom.findById(classroom);
      if (!foundClassroom) {
        return res.status(404).json({ message: "Classroom not found." });
      }
      classroomRef = classroom;
    }

    const announcement = new Announcement({
      title,
      message,
      target,
      classroom: classroomRef,
      postedBy: req.user.userId,
    });

    await announcement.save();
    res.status(201).json(announcement);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET all announcements
exports.getAllAnnouncements = async (req, res) => {
  try {
    const announcements = await Announcement.find()
      .populate("postedBy", "name role email")
      .populate("classroom", "name")
      .sort({ createdAt: -1 });

    res.status(200).json(announcements);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET one announcement by ID
exports.getAnnouncementById = async (req, res) => {
  try {
    const announcement = await Announcement.findById(req.params.id)
      .populate("postedBy", "name role")
      .populate("classroom", "name");

    if (!announcement) {
      return res.status(404).json({ message: "Announcement not found" });
    }

    res.status(200).json(announcement);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// UPDATE an announcement
exports.updateAnnouncement = async (req, res) => {
  try {
    const { title, message, target, classroom } = req.body;

    const updateData = {
      title,
      message,
      target,
      classroom: target === "Classroom" ? classroom : null,
    };

    const updated = await Announcement.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Announcement not found" });
    }

    res.status(200).json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE an announcement
exports.deleteAnnouncement = async (req, res) => {
  try {
    const deleted = await Announcement.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({ message: "Announcement not found" });
    }

    res.status(200).json({ message: "Announcement deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

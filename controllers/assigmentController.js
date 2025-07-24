const {Assignment,User,Classroom}= require('../models/schoolDb')

// get all Assignment(admin view
exports.getAllAssignment=async(req,res)=>{
    try {
        const assignments= await Assignment.find()
        .populate('classroom','name gradeLevel ClassYear')
        .populate('postedBy', 'name email phone')
        res.status(200).json(assignments)
    
        
    } catch (error) {
        req.status(400).json({
            message:error.message
        })
    }
}


// add assignment only teachers
// validate user and Classroom existence

exports.addAssignment= async(req,res)=>{
    try {
        // get logged in User
        const userId= req.user.userId
        // fetch the users and populate the teacher field if it exists/
        console.log(userId)
        const user= await User.findById(userId)
        .populate('teacher')

        // BLOCK NON EACHERR FROM POSTING
        if(!user || !user.teacher) return res.status(403).json({
            message:'Only teachers can add assignments'
        })

        // extract the classroomId from the posting/
        const {classroom:classroomId}= req.body

        // check if the classroom exists first
        const classroomExist= await Classroom.findById(classroomId)
        if(!classroomExist) return res.status(404).json({
            message:'Classroom does not exist'
        })

        // prepare the assignments data
        const assignmentData= { 
            ...req.body,
            
            postedBy: user.teacher._id,
        }
        // save the assigment to the db
        const newAssignment= new Assignment(assignmentData)
        const SavedAssignment=await newAssignment.save()
        res.status(201).json({
            message:'Assignment added successfully', SavedAssignment
        })

    } catch (error) {
        res.status(500).json({
            message:error.message
        })
    }
}

// single assignment
exports.getAssignmentById= async(req,res)=>{
    try {
        const assignment= await Assignment.findById(req.params.id)
        .populate('classroom')
        .populate('postedBy')

        if (!assignment)
            return res.status(404).json({message:" Assignment not found"})
        res.json(assignment)

    } catch (error) {
        res.status(500).json({
            message:error.message
        }) 
    }
}

// update assigment
exports.updateAssignment = async (req, res) => {
  try {
    // Find the assignment and update it
    const updatedAssignment = await Assignment.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!updatedAssignment) {
      return res.status(404).json({ message: "Assignment not found" });
    }

    res.status(200).json({
      message: "Assignment Updated Successfully",
      data: updatedAssignment,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteAssignment = async (req, res) => {
  try {
    const deleted = await Assignment.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({ message: "Assignment not found" });
    }

    res.status(200).json({ message: "Assignment deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// geteachers assignment
// included classroom and teacher info

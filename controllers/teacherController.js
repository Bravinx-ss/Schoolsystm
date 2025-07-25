const{Teacher,User, Classroom}= require('../models/schoolDb')
const bcrypt = require('bcrypt');
// add a teacher
exports.addTeacher = async (req, res) => {
    try {
        // check if user exists
        const {email}= req.body
        const existEmail= await Teacher.findOne({email})
        if (existEmail) return res.json({message:"Email already existing"})
         
        const existUserEmail= await Teacher.findOne({email})
        if (existUserEmail) return res.json({message:"Email already existing"})

            // create the new Teacher
            const newTeacher= new Teacher(req.body)
            const savedTeacher= await newTeacher.save()
             
            // we create a corresponding 
            const defaultPassword= "Teacher1234"
            const password= await bcrypt.hash(defaultPassword,10)
            const newUser= new User({
                name:savedTeacher.name,
                email:savedTeacher.email,
                password,
                role:"teacher",
                teacher:savedTeacher._id
            })
            await newUser.save()
            res.status(201).json({message:`Teacher  ${savedTeacher.name},registered successfully`,newUser} )
    } catch (error) {
        res.status(500).json({message:error.message})
    }
}


exports.getAllTeachers= async(req,res)=>{
    try {
      console.log("getTeacher")
          const teacher= await Teacher.find()
        res.json(teacher)
    } catch (error) {
      console.log("catch")
      console.log(error)
        res.status(500).json({message:error.message})
    }
}

// get by Id
exports.getTeacherById= async (req, res) => {
    try {
        const teacher= await Teacher.findById(req.params.id)
        if (!teacher) return res.status(404).json({message:"Teacher not found"})
            res.json({teacher})
    } catch (error) {
        res.status(500).json({message:error.message})
    }
}

exports.updateTeacher = async (req, res) => {
  try {
    const teacherId = req.params.id;
    const { name, email, password, ...otherFields } = req.body;

    // 1. Update teacher info
    const updatedTeacher = await Teacher.findByIdAndUpdate(
      teacherId,
      { name, email, ...otherFields },
      { new: true }
    );

    if (!updatedTeacher) {
      return res.status(404).json({ message: "Teacher not found" });
    }

    // 2. Find and update the corresponding user
    const user = await User.findOne({ teacher: teacherId });
    if (!user) {
      return res.status(404).json({ message: "Linked user not found" });
    }

    // 3. Update user fields
    user.name = name || user.name;
    user.email = email || user.email;

    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      user.password = hashedPassword;
    }

    await user.save();

    res.status(200).json({
      message: "Teacher and linked user updated successfully",
      updatedTeacher,
      updatedUser: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// delete classroom

exports.deletedTeacher= async (req,res)=>{
    // find the class room and delete by id
  try {
    const deletedTeacher= await Teacher.findByIdAndDelete(req.params.id)
    if(!deletedTeacher) return res.status(500).json({message:"Teacher not found Not Found"})

    await Classroom.updateMany(
      {classroom:deletedTeacher._id},
      {$set:{teacher:null}}
    )
  
    res.json({message:` Teacher ${deletedTeacher.name} deleted successfully`})
  } catch (error) {
      res.status(500).json({message:error.message})

  }
}


// get teacher
exports.getMyClasses = async (req, res) => {
  try {
    const userId = req.user._id;

    const user = await User.findById(userId).populate("teacher");

    if (!user || !user.teacher) {
      return res.status(404).json({ message: "Teacher not found" });
    }

    const classes = await Classroom.find({ teacher: user.teacher._id })
      .populate('students');

    res.status(200).json({ message: "Classes", classes });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};


exports.getMyAssigments = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId).populate("teacher");

    if (!user || !user.teacher) {
      return res.status(404).json({ message: "Teacher not found" });
    }

    const assigments = await Classroom.find({ postedBy: user.teacher._id })
      .populate('classroom', 'name gradeLevel classYear')
      .populate('postedBy', 'name email phone');

    res.status(200).json({ message: "Assignments fetched", assigments });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};




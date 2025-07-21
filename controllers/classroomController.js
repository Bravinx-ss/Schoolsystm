const { Classroom}= require('../models/schoolDb')
// all classrooms
exports.addClassroom = async (req, res) => {
    try {
        // receive data fro client
        const newClassroom = req.body
        const savedClassroom = new Classroom(newClassroom)
        await savedClassroom.save()
        res.json({ message: "saved Classroom",savedClassroom })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

// fetching the classrooms
exports.getAllClassrooms= async (req,res)=>{
    try {
        const classroom= await Classroom.find()
        .populate('teacher','name email phone')
        .populate('students', 'name addmisionNumber')
        res.json({classroom})
    } catch (error) {
        res.status(500).json({message:error.message})
    }
}


// get asingle classroom
exports.getAllClassroomById= async(req,res)=>{
   try {
     const classroom = await Classroom.findById(req.params.id)
    .populate('teacher','name email phone')
    .populate('students', 'name addmisionNumber')
    
    if(!classroom)
        return res.status(404).json({message:"classroom not found"})
    res.json({classroom})
   } catch (error) {
            res.status(500).json({message:error.message})

   }

}


// update the classroom
exports.UpdateClassroom= async(req,res)=>{
    try {
        const UpdateClassroom= await Classroom.findByIdAndUpdate(
            req.params.id,
            req.body,
            {new:true}
        )

        if (!UpdateClassroom) return res.status(404).json({message:"not found"})

            res.json({UpdateClassroom})
    } catch (error) {
                res.status(500).json({message:error.message})

    }
}

// delete classroom
exports.deleteClassroom= async (req,res)=>{
    // find the class room and delete by id
    try {
        const deledtClassroom= await Classroom.findByIdAndDelete(req.params.id)
        if(!deledtClassroom) return res.status(500).json({message:"Classroom Not Found"})
            res.json({message:`Classroom ${deledtClassroom.name} deleted succesfully`})
    } catch (error) {
                res.status(500).json({message:error.message})

    }
}
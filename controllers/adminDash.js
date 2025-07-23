const {Student,Teacher,Parent,Classroom,User}= require('../models/schoolDb')
// get dashboard stats
exports.getDashboardStats = async (req, res) => {
    try {
        // we run all count operation parallel for better performance
        const [totalStudents, totalTeachers, totalParents, totalClassrooms, activeUsers] = 
        await Promise.all([
            Student.countDocuments(),
            Teacher.countDocuments(),
            Parent.countDocuments(),
            Classroom.countDocuments(),
            User.countDocuments({isActive:true})
        ])

        // get the most recent students to be registered( sorted by newest)
        const recentStudents = await Student.find()
        .sort({createdAt: -1})
        .limit(5)

        // get recent teachers
        const recentTeachers = await Teacher.find()
        .sort({createdAt: -1})
        .limit(5)

        // return all status
        return res.status(200).json({
            totalStudents,
            totalTeachers,
            totalParents,
            totalClassrooms,
            activeUsers,
            recentStudents,
            recentTeachers
        })
    } catch (error) {
        res.status(500).json({message:error.message})
    }
}

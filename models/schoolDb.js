const mongoose = require('mongoose')
const Schema = mongoose.Schema
// define the user Schema
const userSchema= new Schema({
    name:{type:String,required:true},
    email:{type:String,required:true,unique:true},
    password:{type:String,required:true},
    isActive:{type:Boolean,default:true},
    role:{type:String,enum:['admin','teacher','parent'],required:true},
    teacher:{type:mongoose.Schema.Types.ObjectId,ref:'Teacher',default:null},
    Parent:{type:mongoose.Schema.Types.ObjectId,ref:'Parent',default:null},

},{timestamps:true})

// teacher Schema
const teacherSchema= new Schema({
    name:{type:String,required:true},
    email:{type:String},
    phone:{type:String},
    subject:{type:String}
    
},{timestamps:true})

// PARENT Schema
const parentSchema= new Schema({
    name:{type:String,required:true},
    email:{type:String},
    phone:{type:String,required:true},
    nationalId:{type:String,required:true,unique:true},
    address:{type:String}
},{timestamps:true})

// class schemaa
const classroomScema= new Schema({
    name:{type:String,required:true},
    gradeLevel:{type:String},
    classYear:{type:Number},
    teacher:{type:mongoose.Schema.Types.ObjectId,ref:'Teacher',default:null},
    students:{type:mongoose.Schema.Types.ObjectId,ref:'Student',default:null},
},{timestamps:true})

// student schemaa
const studentSchema= new Schema({
    name:{type:String,required:true},
    dateOfBirth:{type:Date,required:true},
    gender:{type:String},
    photo:{type:String},
    addmisionNumber:{type:String},
    classroom:{type:mongoose.Schema.Types.ObjectId,ref:'Classroom'},
    parent:{type:mongoose.Schema.Types.ObjectId,ref:'Parent'},
},{timestamps:true})

// ASSIGMENTS
const assignmentSchema= new Schema({
    title:{type:String,required:true},
    description:{type:String},
    dueDate:{type:Date},
    classroom:{type:mongoose.Schema.Types.ObjectId,ref:'Classroom'},
    postedBy:{type:mongoose.Schema.Types.ObjectId,ref:'Teacher'},
},{timestamps:true})

//  prepare the exports
const User= mongoose.model('User',userSchema)
const Teacher= mongoose.model('Teacher',teacherSchema)
const Parent= mongoose.model('Parent',parentSchema)
const Classroom= mongoose.model('Classroom',classroomScema)
const Student= mongoose.model('Student',studentSchema)
const Assignment= mongoose.model('Assignment',assignmentSchema)

module.exports = {User,Teacher,Parent,Classroom,Student,Assignment}
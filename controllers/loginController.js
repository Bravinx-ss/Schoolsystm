const jwt = require('jsonwebtoken')
const {User}= require('../models/schoolDb')
const bcrypt = require('bcrypt')
// register logic
  
exports.registerAdmin= async(req,res)=>{
    const {name,email,password,secretKey}= req.body

    // verify admin secret key
    if (!secretKey== process.env.secretKey){
        return res.status(403).json({message:"unauthorized Account Creation"})
    }

    // check if user exists
    const userExists= await User.findOne({email})
    if(userExists)
        return res.status(400).json({message:"Email already exists"})

    // hash password
    const hashedPassword= await bcrypt.hash(password,10)
    const user= new User({
        name,
        email,
        password:hashedPassword,
        role:"admin",
        isActive:true,
        teacher:null,
        parent:null
    })
    const newUser=await user.save()
    res.status(201).json({message:`User ${newUser.role} ${name} Created Successfully  `, newUser})

    }
   
    // login
exports.login= async(req,res)=>{
    const {email,password}=req.body
    // console.log(email,password)
    const user= await User.findOne({email})

    // check the user by the email
    if(!user){
        return res.status(404).json({message:"invalid cridentials"})
    }

    // check if the user is active
    if(!user.isActive){
        return res.status(403).json({message:"Your account has been deactivated" })
    }
    // check if the password is correct
    const isMatch= await bcrypt.compare(password,user.password)
    if(!isMatch){
        return res.status(401).json({message:"invalid credentials .."})
    }

    // generate a token
    const token = jwt.sign(
      {
        userId: user._id,
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );
    res.json({message:"login successfully",
        token,
        user:{
            id:user._id,
            name:user.name,
            email:user.email,
            role:user.role
        }

    })
}    
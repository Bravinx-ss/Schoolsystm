
const {Parent,User} = require('../models/schoolDb')
const bcrypt = require ('bcrypt')

// add parent
exports.addParent = async (req,res) =>{
    try {
        // destructure variable to check if the parent exist
        const {email,nationalId,name} = req.body
        // checking using email
        const existingParentEmail = await User.findOne({email})
        if(existingParentEmail) return res.json({message:"Email already Exists"})
        // check using the id 
        const existingParentId= await Parent.findOne({nationalId})
        if(existingParentId) return res.json({message:"National Id has already been registered"})

        // when all checks are good we now save the new parent

        const newParent = new Parent(req.body)
        const savedParent =  await newParent.save()


        // creating the parent user account
        const defaultPassword = 'parent1234'
        const hashedPassword = await bcrypt.hash(defaultPassword,10)

        const newUser = new User({
            name,email,
            password:hashedPassword,
            role:"parent",
            parent:savedParent._id
        })
        await newUser.save()
        res.status(201).json({parent:savedParent,message:"Parent and User account created successfully"})

    } catch (error) {
        res.status(500).json({message:error.message})
    }
}

// get all parents
exports.getAllParents= async (req,res) => {
    try {
        const parents = await Parent.find()
        res.json(parents)
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

// update parent by admin
exports.updateParent = async (req,res) =>{
    try {
        // console.log("test updated function")
        const {name,email,phone,nationalId}=req.body
        // console.log(name,email,phone,nationalId)
        const parent = await Parent.findById(req.params.id)
        // console.log(parent)
        
        const updateParent = await Parent.findByIdAndUpdate(
          req.params.id,
          { name, email, phone, nationalId },
          { new: true }
        );
        if (!updateParent) return res.status(404).json({message:"Parent is not found"})
        res.status(201).json(parent)
    } catch (error) {
        res.status(500).json({message:error.message})
    }
}

exports.deleteParent = async (req, res) => {
  try {
    const deletedParent = await Parent.findByIdAndDelete(req.params.id);
    if (!deletedParent) {
      return res.status(404).json({ message: "Parent Not Found" });
    }

    // delete also the associated user account
    await User.findOneAndDelete({ parent: req.params.id });

    res
      .status(200)
      .json({ message: "Parent account and linked user deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

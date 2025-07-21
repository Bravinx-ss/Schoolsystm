const jwt = require('jsonwebtoken')
const JWT_SECRET= process.env.JWT_SECRET

const auth= (req,res,next)=>{
    // extract the authorization error/

    const authHeader= req.headers.authorization
    // get actualtoken from the header
    const token= authHeader && authHeader.split(' ')[1]

    // check if we have the token
    if (!token) return res.status(401).json({message:'NO token provided'})
        try {
            // verify the token using the secretKey
            const decode=jwt.verify(token,JWT_SECRET)
            // we attached the payload to the request Object
            // this is the logged  user
            req.user= decode
            // proceed to the next route
            console.log(decode)
            next()
        } catch (error) {
            res.status(500).json({message:error.message})
            
        }

}

// middleware to authorize acces based on the user role
// accepts any number of alowed roles(eg:admin,teacher)
// ... params -accepts any number of arguments and automatically puts them into an array

const authorizeRoles=(...allowedRoles)=>{
    return(req,res,next)=>{
        if(!req.user|| !allowedRoles.includes(req.user.role)){
            return res.status(403).json({message:"Acess denied: Insuficient Permissions"})
        }
        next()
    }
}
module.exports={auth,authorizeRoles}

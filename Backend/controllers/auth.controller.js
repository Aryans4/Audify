const userModel = require("../models/user.model.js")
const jwt=require("jsonwebtoken")
const bcrypt=require("bcryptjs")


async function registerUser(req, res) {
    const { username, email, password, role="user"} = req.body;
    const isUserAlreadyPresent = await userModel.findOne({
        $or: [
            { username },
            { email }
        ]
    })

    if (isUserAlreadyPresent) {
        return res.status(409).json({
            message: "User Already Exists"
        })
    }

    const hash=await bcrypt.hash(password,11)

    const user = await userModel.create({
        username,
        password: hash,
        email,
        role: role === 'artist' ? 'artist' : 'user'
    })

    const token = jwt.sign({
        id: user._id,
        role: user.role
    }, process.env.JWT_SECRET)
    
    res.cookie("token", token)

    return res.status(201).json({
        message: "Registration Successful",
        token,
        user: {
            id: user._id,
            username: user.username,
            email: user.email,
            role: user.role
        }
    })
}
async function loginUser(req,res){
    const {username,email,password}=req.body
    const user=await userModel.findOne({
        $or:[
            {username},
            {email}
        ]
    })

    if(!user){
        return res.status(401).json({
            message:"User not Found"
        })
    }

    const isPasswodValid= await bcrypt.compare(password,user.password)
    if(!isPasswodValid){
        return res.status(401).json({
            message:"Invalid Password"
        })
    }

    const token=jwt.sign({
        id: user._id,
        role: user.role
    },process.env.JWT_SECRET)
    res.cookie("token", token)
    res.status(200).json({
        message:"Login Successful",
        token,
        user: {
            id: user._id,
            username: user.username,
            email:user.email,
            role:user.role
        }
    })

}
async function logOut(req,res){
    res.clearCookie("token")
    res.status(200).json({
        message:"Logout Successful"
    })
}

module.exports = {registerUser,loginUser,logOut}  
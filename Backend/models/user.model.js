const mongoose = require('mongoose')

const userSchema=new mongoose.Schema({
    username: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    email:{
        type: String,
        required: true,
        lowercase: true,
        trim: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type:String,
        enum: ['user','artist'],
        default:'user'
    },
    tokenVersion: {
        type: Number,
        default: 0
    },
    passwordResetTokenHash: {
        type: String,
        select: false,
        index: true
    },
    passwordResetExpires: {
        type: Date,
        select: false
    }

})

const userModel=mongoose.model("user", userSchema)

module.exports=userModel
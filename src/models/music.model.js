const mongoose = require("mongoose")



const  musicSchema= new mongoose.Schema({
    uri: {
        type: String,
        required: true
    },
    title:{
        type:String,
        required: true
    },
    artist: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true
    },
    comments: [
        {
            user: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "user",
                required: true
            },
            text: {
                type: String,
                required: true,
                trim: true,
                maxlength: 300
            },
            timestamp: {
                type: Number,
                default: 0
            },
            createdAt: {
                type: Date,
                default: Date.now
            }
        }
    ]
})

const musicModel=mongoose.model("music",musicSchema)


module.exports=musicModel
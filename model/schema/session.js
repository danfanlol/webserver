import mongoose from "mongoose";
const sessionSchema=new mongoose.Schema( {
    begin:{
        type:Number,
        required:true,
    },
    duration: {
        type:Number,
        required:true,

    },
    tutor: {
        type:String,
        required:true,
    },
    student: {
        type:String,
        default:"",
    },
    subject: {
        type:String,
        required:true,
    }
});

const Session= mongoose.model("Session",sessionSchema)
export default Session;
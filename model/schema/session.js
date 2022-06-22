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
    },

    occupied: {
        type: Boolean,
        get: () => Boolean(this.student),
    }
});

const Session = mongoose.model("Session", sessionSchema);
export default Session;

export const compareSessions = (a, b) =>
        Number(Boolean(a.student)) - Number(Boolean(b.student)) 
        || a.begin - b.begin;
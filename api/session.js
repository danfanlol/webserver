import express from "express";
import Session from "../model/schema/session.js";
const router=express.Router();

router.get("/fromtutor/:tutor",async (req,res) => {
    var tutor=req.params.tutor

    var results=await Session.find({tutor}).sort("begin").lean();
    res.status(200).json(results);
})

router.get("/fromstudent/:student",async (req,res) => {
    var student=req.params.student

    var results=await Session.find({student}).sort("begin").lean();
    res.status(200).json(results);
})

router.get("/fromsubject/:subject",async (req,res) => {
    var subject=req.params.subject
    console.log(req.params);

    var results=await Session.find({subject,student:""}).sort("begin").lean().select("_id begin duration tutor subject student")
    res.status(200).json(results);
})

router.post("/",async (req,res) => {
    try {
        if(!req.isAuthenticated()) return res.status(401).json({message:"Not logged in!"});
    
        if(!req.user.hasPermission("post-session")) return res.status(401).json({message:"You don't have enough permissions!"});
        console.log(req.body);
        var obj={
            begin: req.body.begin,
            duration: req.body.duration,
            tutor: req.user.user,
            subject: req.body.subject,
        };
        var session=new Session(obj)
        await session.save();
        return res.status(200).json(session);
    }catch(e) {
        console.log(e);
        return res.status(400).json({message:"error"})
    }
   
})

export default router;
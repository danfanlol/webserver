import express from "express";
import Session from "../model/schema/session.js";
const router=express.Router();
router.post("/",async (req,res) => {
    if(!req.isAuthenticated()) return res.status(400).json({message:"Not logged in!"});
    if(!req.user.hasPermission("signup")) return res.status(400).json({message:"Not enough permissions!"})
    
    console.log(req.body);
    var session=await Session.findById(req.body.session);
    if(!session) {
        return res.status(401).json({message:"Could not find session!"})
    }
    if(session.student!="") {
        return res.status(401).json({message:"Session already has a student signed up!"})
    }
    session.student=req.user.user;
    await session.save();
    return res.status(200).json(session);
});
export default router;
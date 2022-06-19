import express from "express"
import Session from "../model/schema/session.js";
import User from "../model/schema/user.js";

const router=express.Router();
router.post("/",async (req,res) => {
    if(!req.isAuthenticated()) return res.status(401).json({message:"Not logged in!"})
    var session=await Session.findById(req.body.session);
    if(!session) return res.status(401).json({message:"No such session!"})
    if(!session.student==req.user.user) return res.status(401).json({message:"You are not the student!"});

    if(req.body.operation=="quit") {
        session.student="PLACEMENT";
        await session.save();
        return res.status(200).json({message:"Operation Successful"})
    }
    return res.status(401).json({message:"Invalid operation!"})
})
export default router;
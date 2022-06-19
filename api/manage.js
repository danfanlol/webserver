import express from "express"
import User from "../model/schema/user.js";
const router=express.Router();
router.post("/",async (req,res) => {
    if(!req.isAuthenticated()) return res.status(401).json({message:"Not logged in!"})
    if(!req.user.hasPermission("admin")) return res.status(400).json({message:"Not enough permissions!"})

    console.log(req.body);
    if(req.body.operation=="grant") {
        var user=await User.findOne({user:req.body.user});
        if(!user) {
            return res.status(401).json({message:"Target not found!"});
        }
        user.permissions.push(req.body.permission);
        user.save();
        return res.status(200).json(user);
    }
    if(req.body.operation=="revoke") {
        var user=await User.findOne({user:req.body.user});
        if(!user) {
            return res.status(401).json({message:"Target not found!"});
        }
        user.permissions=user.permissions.filter((item) => {
            return item!=req.body.permission
        })
        user.save();
        return res.status(200).json(user);
    }

});
export default router;
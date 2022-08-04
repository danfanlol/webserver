import express from "express"
import User from "../model/schema/user.js";
import { allowAdminOnly } from "../util/express-middleware.js";
const router=express.Router();
router.post("/",
    allowAdminOnly,
    async (req,res) => {
        console.log(req.body);
        if(req.body.operation=="grant") {
            var user=await User.findById(req.body.userId);
            if(!user) {
                return res.status(401).json({message:"Target not found!"});
            }
            user.permissions.push(req.body.permission);
            user.save();
            return res.status(200).json(user);
        }
        if(req.body.operation=="revoke") {
            var user=await User.findById(req.body.userId);
            if(!user) {
                return res.status(401).json({message:"Target not found!"});
            }
            user.permissions=user.permissions.filter((item) => {
                return item!=req.body.permission
            })
            user.save();
            return res.status(200).json(user);
        }

    }
);
export default router;
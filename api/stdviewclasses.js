import express, { request } from "express"
import Session from "../model/schema/session.js";
import User from "../model/schema/user.js";
import { allowLoggedInOnly } from "../util/express-middleware.js";

const router=express.Router();
router.post("/",
    allowLoggedInOnly,
    async (req,res) => {
        const session=await Session.findById(req.body.session);

        if(!session) return res.status(401).json({message:"No such session!"})
        if(session.studentId.toString() !== req.user._id.toString()) return res.status(401).json({message:"You are not the student!"});

        if(req.body.operation=="quit") {
            session.studentId = null;
            session.confirmed = false;
            await session.save();
            return res.status(200).json({message:"Operation Successful"});
        }
        return res.status(401).json({message:"Invalid operation!"})
    }
)
export default router;
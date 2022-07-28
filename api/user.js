import express from "express";
import User from "../model/schema/user.js";
import { allowAdminOnly } from "../util/express-middleware.js";

const router = express.Router();

router.get("/", (req, res) => {
    const returnObj = {user: req.isAuthenticated() ? req.user.user : ""};
    return res.status(200).json(returnObj);
});

router.get("/:userid",async (req,res) => {
    try {
        var user=await User.findById(req.params.userid).select("-pass -isVerified -resetPasswordToken -resetPasswordExpires");
        console.log(user);
        res.status(200).json(user);
    }catch(e) {
        console.log(e);
        res.status(401).json(e);
    }
    
});

router.post("/delete",
    allowAdminOnly,
    async (request, response, next) => {
        await User.findByIdAndDelete(request.body.userId)
                .then(
                    () => response.status(200).json({}),
                    error => {
                        console.log(error);
                        response.status(404).json(error);
                    },
                );
    }, 
);

export default router;
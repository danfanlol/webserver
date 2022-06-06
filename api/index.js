import express from "express";
import user from "./user.js";
import session from "./session.js"
import classtypes from "./classtypes.js";
import signup from "./signup.js"
import manage from "./manage.js"
import stdviewclasses from "./stdviewclasses.js"
import tutorviewclasses from "./tutorviewclasses.js"
import apiobj from "./api_object/apiobj.js"
const router=express.Router();
// /api

router.use("/user",user)
router.use("/session",session);
router.use("/classtypes",classtypes);
router.use("/signup",signup)
router.use("/manage",manage)
router.use("/stdviewclasses",stdviewclasses);
router.use("/tutorviewclasses",tutorviewclasses);

router.use("/",apiobj.router);
const packaged=apiobj.apiify({hello:{
    tomorrow:function(a,b,c) {
        return {a:5};
    }
}})
console.log(packaged.val.hello);
const buffer=JSON.stringify(packaged);
router.get("/apiobj",(req,res) => {
    res.status(200).send(buffer);
})
export default router;
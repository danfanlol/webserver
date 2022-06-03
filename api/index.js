import express from "express";
import user from "./user.js";
import session from "./session.js"
import classtypes from "./classtypes.js";
import signup from "./signup.js"
import manage from "./manage.js"
import stdviewclasses from "./stdviewclasses.js"
import tutorviewclasses from "./tutorviewclasses.js"
const router=express.Router();
// /api

router.use("/user",user)
router.use("/session",session);
router.use("/classtypes",classtypes);
router.use("/signup",signup)
router.use("/manage",manage)
router.use("/stdviewclasses",stdviewclasses);
router.use("/tutorviewclasses",tutorviewclasses);

export default router;
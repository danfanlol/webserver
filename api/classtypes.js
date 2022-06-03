import express from "express";
import classtypes from "../model/classtypes.js";

const router=express.Router();


router.get("/", (req,res) => {
    res.status(200).json(classtypes.classTypes);
})
export default router;
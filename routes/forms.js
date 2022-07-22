import express from "express"
import { baseViewParams } from "../util/base-view-objects.js";
const router=new express.Router();
router.get("/:type",(req,res) => {
    return res.render("forms/template.ejs", baseViewParams(req));
})

export default router;
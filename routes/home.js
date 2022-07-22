import express from "express";
import { baseViewParams } from "../util/base-view-objects";

const router = express.Router();
router.get("/", (req, res) => {
	res.render("home/index.ejs", baseViewParams(req));
	// res.sendFile(path.join(process.cwd(),"views",fn));
});
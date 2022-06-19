import express from "express";
import { baseViewParams } from "../utils/base-view-objects";

const router = express.Router();
router.get("/", (req, res) => {
	res.render(fn, baseViewParams(req));
	// res.sendFile(path.join(process.cwd(),"views",fn));
});
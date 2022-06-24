import express from "express";

import User from "../model/schema/user.js";
import { baseViewParams } from "../utils/base-view-objects.js";

const router = express.Router();
router.get("/:name/", async (request, response) => {
	response.render("tutor/index.ejs", {
		...baseViewParams(request),
		tutor: await User.findOne({
			user: request.params.name,
		}),
	});
	// res.sendFile(path.join(process.cwd(),"views",fn));
});

export default router;
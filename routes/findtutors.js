import express from "express";
import { baseViewParams } from "../utils/base-view-objects.js";
import Session from "../model/schema/session.js";

const router = express.Router();

router.get("/", async (request, response) => {
	const sessions = (await Session.find({}))
			.sort((a, b) => Number(Boolean(a.student)) - Number(Boolean(b.student)) 
					|| a.begin - b.begin);

	if (request.isAuthenticated()) {
		response.render("findtutors/index.ejs", {
			...baseViewParams(request),
			sessions,
		});
	} else {
		response.redirect("/login");
	}
});

export default router;
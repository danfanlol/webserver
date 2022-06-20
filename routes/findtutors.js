import express from "express";
import { baseViewParams } from "../utils/base-view-objects.js";
import Session from "../model/schema/session.js";
import * as path from "path";

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

router.get("/index.js", (request, response) => {
	// Change path alongside ./frontends/findtutors/vite.config.ts
	response.sendFile(path.resolve("./frontends/findtutors/dist/index.js"));
});

export default router;
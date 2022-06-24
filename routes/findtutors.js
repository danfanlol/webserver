import express from "express";
import { baseViewParams } from "../utils/base-view-objects.js";
import Session, {compareSessions} from "../model/schema/session.js";
import * as path from "path";

const router = express.Router();

router.get("/", async (request, response) => {
	const sessions = (await Session.find())
			.sort(compareSessions(request.user?.user));

	if (request.isAuthenticated()) {
		response.render("findtutors/index.ejs", {
			...baseViewParams(request),
			sessions,
		});
	} else {
		response.redirect("/login");
	}
});

router.get("/app.js", (request, response) => {
	// Change path alongside ./frontends/findtutors/vite.config.ts
	response.sendFile(path.resolve("./frontends/findtutors/dist/index.js"));
});

router.get("/app.css", (request, response) => {
	response.sendFile(path.resolve("./frontends/findtutors/dist/style.css"));
});

export default router;
import express from "express";
import { baseViewParams } from "../util/base-view-objects.js";
import Session, {compareSessions} from "../model/schema/session.js";
import * as path from "path";

const router = express.Router();

router.get("/", async (request, response) => {
	// const sessions = (await Session.find())
	// 		.sort(compareSessions(request.user?.user));

	if (request.isAuthenticated()) {
		response.render("findtutors/index.ejs", {
			...baseViewParams(request),
			// sessions,
			sessions: [],
		});
	} else {
		response.redirect("/login");
	}
});

// router.get("/app.js", (request, response) => {
// 	// Change path alongside ./pages/findtutors/vite.config.ts
// 	response.sendFile(path.resolve("./pages/findtutors/dist/index.js"));
// });

router.get("/app.css", (request, response) => {
	response.sendFile(path.resolve("./pages/dist/style.css"));
});

export default router;
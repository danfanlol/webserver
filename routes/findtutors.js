import express from "express";
import { baseViewParams } from "../util/base-view-objects.js";
import Session, {compareSessions} from "../model/schema/session.js";
import * as path from "path";
import { requestLogin } from "../util/express-middleware.js";

const router = express.Router();

router.get("/",
	requestLogin,
	async (request, response) => {
		// const sessions = (await Session.find())
		// 		.sort(compareSessions(request.user?.user));

		response.render("findtutors/index.ejs", {
			...baseViewParams(request),
			// sessions,
			sessions: [],
		});
	},
);

/* router.get("/app.js", (request, response) => {
	// Change path alongside ./pages/findtutors/vite.config.ts
	response.sendFile(path.resolve("./pages/findtutors/dist/index.js"));
});

router.get("/app.css", (request, response) => {
	response.sendFile(path.resolve("./pages/dist/style.css"));
}); */

export default router;
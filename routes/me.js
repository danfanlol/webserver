import express from "express";

import User from "../model/schema/user.js";
import { baseViewParams } from "../util/base-view-objects.js";

import * as path from "path";
import { requestLogin } from "../util/express-middleware.js";

const router = express.Router();
router.get("/",
	requestLogin,
	async (request, response) => {
		const isTutor = request.user.hasPermission("post-session");
		response.redirect(`/${isTutor ? "tutor" : "student"}/${encodeURIComponent(request.user._id.toString())}`);
	},
);

export default router;
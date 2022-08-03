import express from "express";

import User from "../model/schema/user.js";
import { baseViewParams } from "../util/base-view-objects.js";

import * as path from "path";

const router = express.Router();
router.get("/", async (request, response) => {
	if (!request.isAuthenticated()) {
		response.redirect("/login");
		return;
	}

	const isTutor = request.user.hasPermission("post-session");
	response.redirect(`/${isTutor ? "tutor" : "student"}/${encodeURIComponent(request.user._id)}`);
});

export default router;
import express from "express";

import User from "../model/schema/user.js";
import { baseViewParams } from "../utils/base-view-objects.js";

export const tutorRouter = express.Router();
tutorRouter.get("/:name/", async (request, response) => {
	if (!request.isAuthenticated()) {
		response.redirect("/login");
		return;
	}

	const tutor = await User.findOne({
		user: request.params.name,
	});

	if (!tutor || !tutor.isTutor) {
		response.sendStatus(404);
		return;
	}

	response.render("tutor/index.ejs", {
		...baseViewParams(request),
		tutor,
	});
	// res.sendFile(path.join(process.cwd(),"views",fn));
});

export const studentRouter = express.Router();
studentRouter.get("/:name/", async (request, response) => {
	if (!request.isAuthenticated()) {
		response.redirect("/login");
		return;
	}

	if (!request.user.isStaff && request.user.user !== request.params.name) {
		response.sendStatus(404);
		return;
	}

	const student = await User.findOne({
		user: request.params.name,
	});

	if (!student) {
		response.sendStatus(404);
		return;
	}

	response.render("student/index.ejs", {
		...baseViewParams(request),
		student,
	});
	// res.sendFile(path.join(process.cwd(),"views",fn));
});
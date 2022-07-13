import express from "express";

import User from "../model/schema/user.js";
import { baseViewParams } from "../utils/base-view-objects.js";

import path from "path";

export const tutorRouter = express.Router();
tutorRouter.get("/:name/", async (request, response, next) => {
	if (!request.isAuthenticated()) {
		response.redirect("/login");
		return next();
	}

	const tutor = await User.findOne({
		user: request.params.name,
	});

	if (!tutor || !tutor.isTutor) {
		return next();
	}

	response.render("tutor/index.ejs", {
		...baseViewParams(request),
		tutor,
	});
	// res.sendFile(path.join(process.cwd(),"views",fn));
});

tutorRouter.get("/app.js", (request, response) => {
	// Change path alongside ./pages/tutor/vite.config.ts
	response.sendFile(path.resolve("./pages/tutor/dist/index.js"));
});

tutorRouter.get("/app.css", (request, response) => {
	response.sendFile(path.resolve("./pages/tutor/dist/style.css"));
});

export const studentRouter = express.Router();
studentRouter.get("/:name/", async (request, response, next) => {
	if (!request.isAuthenticated()) {
		response.redirect("/login");
		return next();
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
		return next();
	}

	response.render("student/index.ejs", {
		...baseViewParams(request),
		student,
	});
	// res.sendFile(path.join(process.cwd(),"views",fn));
});
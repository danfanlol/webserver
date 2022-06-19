import express from "express";
import { baseViewParams } from "../utils/base-view-objects.js";

const router = express.Router();

router.get("/", (request, response) => {
	if (request.isAuthenticated()) {
		response.render("findtutors/index.ejs", baseViewParams(request));
	} else {
		response.redirect("/login");
	}
});

export default router;
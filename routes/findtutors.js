import express from "express";

const router = express.Router();

router.get("/", (request, response) => {
	if (request.isAuthenticated()) {
		response.render("findtutors/index.ejs", {
			logged_in: request.isAuthenticated(),
			user: request.user,
			bucket_name: process.env.AWS_BUCKET_NAME,
			dump_name: process.env.AWS_DUMP_NAME,
			type: request.params.type,
		});
	} else {
		response.redirect("/login");
	}
});

export default router;
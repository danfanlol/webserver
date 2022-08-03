import express from "express"
import { baseViewParams } from "../util/base-view-objects.js";
import { allowAdminOnly, requestLogin } from "../util/express-middleware.js";

const router = express.Router();
router.get("/",
	requestLogin,
	allowAdminOnly,
	(request, response) => {
		return response.render("admin/index.ejs", baseViewParams(request));
	},
);

export default router;
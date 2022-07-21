import express from "express"
import { baseViewParams } from "../utils/base-view-objects.js";

const router = express.Router();
router.get("/", (request, response) => {
	if (!request.isAuthenticated()) return response.redirect("/login");
	if (!request.user.isAdmin) return response.status(403).json({message: "Not an admin"});

    return response.render("admin/index.ejs", baseViewParams(request));
});

export default router;
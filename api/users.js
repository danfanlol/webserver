import express from "express";
import User from "../model/schema/user.js";
import { allowAdminOnly } from "../util/express-middleware.js";

const router = express.Router();

router.get("/",
	allowAdminOnly,
	async (request, response, next) => {
		const users = await User.find().select("-pass -isVerified -resetPasswordToken -resetPasswordExpires");
		response.status(200).json(users);
	}, 
);

export default router;
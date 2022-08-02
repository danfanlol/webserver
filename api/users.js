import express from "express";
import Session from "../model/schema/session.js";
import User from "../model/schema/user.js";
import { allowAdminOnly } from "../util/express-middleware.js";

const router = express.Router();

router.get("/",
	allowAdminOnly,
	async (request, response, next) => {
		const users = await User.find().select("-pass -isVerified -resetPasswordToken -resetPasswordExpires");
		response.status(200).json(users.map(user => user.toJSON({virtuals: true})));
	}, 
);

router.get("/countstudentsessions/",
	allowAdminOnly,
	async (request, response, next) => {
		const count = await Session.countDocuments({
			student: request.query?.user,
			startDate: Date.now(),
		});
		response.status(200).json({count});
	},
);

export default router;
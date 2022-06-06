import express from "express";

const router = express.Router();
router.get("/", (req, res) => {
	res.render(fn, {
		logged_in: false,
		user: '',
		bucket_name: process.env.AWS_BUCKET_NAME,
		dump_name: process.env.AWS_DUMP_NAME,
		type: req.params.type,
	});
	// res.sendFile(path.join(process.cwd(),"views",fn));
});
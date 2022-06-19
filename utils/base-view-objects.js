export const baseViewParams = request => ({
	logged_in: request.isAuthenticated(),
	user: request.user,
	bucket_name: process.env.AWS_BUCKET_NAME,
	dump_name: process.env.AWS_DUMP_NAME,
	type: request.params.type,
});
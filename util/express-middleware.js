export const allowAdminOnly = (request, response, next) => {
	if (request.user?.isAdmin) {
		next();
		return;
	}
	response.status(403).json({message: "Admin access required"});
};

export const allowStaffOnly = (request, response, next) => {
	if (request.user?.isStaff) {
		next();
		return;
	}
	response.status(403).json({message: "Staff access required"});
};
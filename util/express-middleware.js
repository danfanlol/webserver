const filter = (predicate, errorMsg) =>
		(request, response, next) => {
			if (predicate(request)) return next();
			response.status(403).json({message: errorMsg});
		};

export const allowAdminOnly = filter(
	request => request.user?.isAdmin,
	"Admin access required",
);

export const allowTutorOnly = filter(
	request => request.user?.isTutor,
	"Tutor access required",
);

export const allowStaffOnly = filter(
	request => request.user?.isStaff,
	"Staff access required",
);

export const allowLoggedInOnly = filter(
	request => request.isAuthenticated(),
	"Not logged in",
);
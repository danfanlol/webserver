export const config = {
	username: "",
	isTutor: false,
	tutorUsername: "",

	set(props: object) {
		Object.assign(this, props);
	},

	get isOwnPage() {
		return this.username === this.tutorUsername;
	},
};
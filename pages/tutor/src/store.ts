export const config = {
	clientUsername: "",
	clientIsTutor: false,
	pageOwnerUsername: "",
	isTutorPage: false,

	set(props: object) {
		Object.assign(this, props);
	},

	get isOwnPage() {
		return this.clientUsername === this.pageOwnerUsername;
	},
};
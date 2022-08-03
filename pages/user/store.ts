export const config = {
	clientId: "",
	clientIsTutor: false,
	pageOwnerId: "",
	isTutorPage: false,

	set(props: object) {
		Object.assign(this, props);
	},

	get isOwnPage() {
		return this.clientId === this.pageOwnerId;
	},
};
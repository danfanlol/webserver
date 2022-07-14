export class Category {
	constructor (
		public label: string,
		public color: {
			main: string,
			dark: string,
			accent: string,
		},
	) {}
}

// TODO separate labels from internal ids
const subjectCategories = new Map<Category, string[]>([
	[new Category("English", {
		main: "hsl(237deg 95% 74%)",
		dark: "hsl(237deg 54% 49%)",
		accent: "#0000",
	}), [
		"World Literature",
	]],
	[new Category("Social Studies", {
		main: "hsl(118deg 94% 44%)",
		dark: "hsl(118deg 94% 24%)",
		accent: "#0000",
	}), [
		"World History",
		"US History",
	]],
	[new Category("Mathematics", {
		main: "hsl(337deg 81% 53%)",
		dark: "hsl(337deg 81% 33%)",
		accent: "hsla(20 61% 80% / 0.5)",
	}), [
		"Math K–7",
		"Prealgebra",
		"Algebra",
		"Precalculus",
		"Calculus AB",
		"Calculus BC",
		"Physics Level 1",
		"Physics Level 2",
		"Physics C: Mechanics",
		"Physics C: Electricity and Magnetism",
		"Statistics",
	]],
	[new Category("Science", {
		main: "hsl(31deg 100% 49%)",
		dark: "hsl(31deg 100% 32%)",
		accent: "hsla(350 61% 80% / 0.5)",
	}), [
		"Biology",
		"Chemistry",
	]],
	[new Category("Language", {
		main: "hsl(192deg 96% 47%)",
		dark: "hsl(192deg 96% 27%)",
		accent: "#0000",
	}), [
		"Spanish",
		"Latin",
	]],
]);
export default subjectCategories;

export const categoriesBySubject = new Map<string, Category>();
for (const [category, subjects] of subjectCategories) {
	for(const subject of subjects) {
		categoriesBySubject.set(subject, category);
	}
}
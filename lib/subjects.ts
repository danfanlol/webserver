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
		main: "hsl(217 65% 54%)",
		dark: "hsl(237 54% 39%)",
		accent: "hsla(240 100% 80% / 0.5)",
	}), [
		"World Literature",
	]],
	[new Category("Social Studies", {
		main: "hsl(160 98% 30%)",
		dark: "hsl(118 94% 20%)",
		accent: "hsla(70 41% 70% / 0.5)",
	}), [
		"World History",
		"US History",
	]],
	[new Category("Mathematics", {
		main: "hsl(337 81% 53%)",
		dark: "hsl(337 81% 33%)",
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
		main: "hsl(31 100% 45%)",
		dark: "hsl(21 100% 25%)",
		accent: "hsla(350 61% 80% / 0.5)",
	}), [
		"Biology",
		"Chemistry",
	]],
	[new Category("Language", {
		main: "hsl(192 96% 45%)",
		dark: "hsl(210 70% 33%)",
		accent: "hsla(200 61% 70% / 0.5)",
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
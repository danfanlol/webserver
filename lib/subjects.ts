export class Category {
	constructor (
		public label: string,
		public color: string,
	) {}
}

// TODO separate labels from internal ids
export default new Map<Category, string[]>([
	[new Category("English", "#3940c1"), []],
	[new Category("Social Studies", "#077804"), []],
	[new Category("Mathematics", "#991044"), [
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
	[new Category("Science", "#9e5203"), []],
	[new Category("Language", "#036d87"), []],
]);
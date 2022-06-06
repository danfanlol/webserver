const qs = selector => document.querySelector(selector);

const observer = new IntersectionObserver(([entry], observer) => {
	if (entry.intersectionRatio > 0.5) {
		// Header is shown!
	} else {
		// Header is hidden
	}
}, {
	threshold: 0.5,
});

observer.observe(qs("header"));


//#region Course list

/* {
	class SampleCourseList extends HTMLElement {
		static containerElement = qs("#sample-course-section");
		static courseNames = [
			"AP United States History",
			"AP Calculus BC",
			"AP Biology",
			"American Voices",
			"AP World History",
			"Precalculus",
			"AP Computer Science A",
			"AP United States Government",
			"Algebra II",
			"AP Literature and Composition",
			"Writing & grammar",
			"Statistics",
		];

		connectedCallback() {
		}
	}

	customElements.define("sample-course-list", SampleCourseList);
} */
<script lang="ts" setup>
import {computed, PropType} from "vue";

import subjectCategories from "../../../../lib/subjects";

import {SessionFilters} from "../../../util";

const props = defineProps({
	filters: {
		type: Object as PropType<SessionFilters>,
		required: true,
	},

	category: {
		type: String,
		required: true,
	},

	selectedSubjects: {
		type: Set as PropType<Set<string>>,
		required: true,
	},
});

const subjects = subjectCategories.get(props.category)!;

const selectAll = computed({
    get: () => subjects.every(subject => props.selectedSubjects.has(subject)),
    set(value: boolean) {
        if (value) {
            subjects.forEach(subject => props.selectedSubjects.add(subject));
        } else {
            subjects.forEach(subject => props.selectedSubjects.delete(subject));
        }
    	props.filters.subjects = [...props.selectedSubjects];
    },
});
// watch(selectedSubjects, () => {
//     props.filters.subjects = [...selectedSubjects.value];
// });

const categoryElementId = (categoryLabel: string) => `category-${categoryLabel}`;
</script>

<template>
	<h4 class="tickbox-option">
		<input type="checkbox"
				:id="categoryElementId(category)"
				v-model="selectAll" />
		<label :for="categoryElementId(category)">{{category}}</label>
	</h4>
</template>
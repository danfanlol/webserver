<script lang="ts" setup>
import {computed, PropType} from "vue";

import subjectCategories, {Category} from "../../../../lib/subjects";

import {SessionFilters} from "../../../util";

const props = defineProps({
	filters: {
		type: Object as PropType<SessionFilters>,
		required: true,
	},

	category: {
		type: Category,
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

const categoryElementId = (category: Category) => `category-${category.label}`;
</script>

<template>
	<h4 class="tickbox-option">
		<input type="checkbox"
				:id="categoryElementId(category)"
				v-model="selectAll" />
		<label :for="categoryElementId(category)">
			<span :style="{
					'background': category.color.dark,
				}">{{category.label}}</span>
		</label>
	</h4>
</template>

<style lang="scss" scoped>
label > span {
	padding: 0.25em 0.5em;
	font-size: 0.75em;
	line-height: 1;

	color: #fff;

	border-radius: 1em;
}
</style>
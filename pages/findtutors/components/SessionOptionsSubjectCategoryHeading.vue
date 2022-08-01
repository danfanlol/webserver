<script lang="ts" setup>
import {computed, PropType} from "vue";

import subjectCategories, {Category} from "../../../lib/subjects";

import {SessionFilters} from "../../util";

const props = defineProps<{
	filters: SessionFilters,
	category: Category,
	selectedSubjects: Set<string>,
}>();

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
			<div :style="{
					'background': category.color.dark,
				}">{{category.label}}</div>
		</label>
	</h4>
</template>

<style lang="scss" scoped>
h4 {
	font-size: 1em;
}

label > div {
	display: inline-block;
	padding: 0.25em 0.5em;
	line-height: 1;

	color: #fff;

	border-radius: 1em;
}
</style>
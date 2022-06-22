<script setup lang="ts">
import {PropType} from "vue";
import subjects from "../../../../lib/subjects.js";

const props = defineProps({
	filters: {
		type: Object as PropType<{
			subjects: string[],
		}>,
		required: true,
	},
});

const updateFilters = () => {
    props.filters.subjects = [...document.querySelectorAll("input[name='subject']:checked")]
            .map(element => element.value);
};
</script>

<template>
    <session-options>
        <option- @change="updateFilters"
                class="subjects">
            <h3>Subject</h3>
            <div v-for="subject of subjects">
                <input type="checkbox"
                        :value="subject"
                        name="subject" />
                <label>{{subject}}</label>
            </div>
        </option->
    </session-options>
</template>


<style lang="scss" scoped>
option- {
    display: flex;
    align-items: center;
    gap: 1em;
    font-size: 0.75em;

    h3 {
        margin: 0;
        margin-right: 0.5em;
    }
}
</style>
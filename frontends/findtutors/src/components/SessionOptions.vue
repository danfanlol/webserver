<script setup lang="ts">
import {PropType} from "vue";

import subjects from "../../../../lib/subjects.js";

import {SessionFilters} from "../util";

const props = defineProps({
	filters: {
		type: Object as PropType<SessionFilters>,
		required: true,
	},
});

const subjectElementId = subject => `subject-${subject}`;

const updateSubjects = () => {
    props.filters.subjects = [...document.querySelectorAll("input[name='subject']:checked")]
            .map(element => element.value);
};
</script>

<template>
    <session-options>
        <option- @change="updateSubjects">
            <h3>Subject</h3>
            <div v-for="subject of subjects">
                <input type="checkbox"
                        :value="subject"
                        name="subject"
                        :id="subjectElementId(subject)" />
                <label :for="subjectElementId(subject)">{{subject}}</label>
            </div>
        </option->
        
        <option->
            <h3>Availability</h3>
            <div>
                <input type="radio"
                        :value="null"
                        v-model="filters.availability"
                        name="availability"
                        id="all" />
                <label for="all">All</label>
            </div>

            <div>
                <input type="radio"
                        :value="true"
                        v-model="filters.availability"
                        name="availability"
                        id="open" />
                <label for="open">Open</label>
            </div>

            <div>
                <input type="radio"
                        :value="false"
                        v-model="filters.availability"
                        name="availability"
                        id="closed" />
                <label for="closed">Closed</label>
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
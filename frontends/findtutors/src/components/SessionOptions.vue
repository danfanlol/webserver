<script setup lang="ts">
import {PropType} from "vue";

import subjects from "../../../../lib/subjects.js";

import {SessionFilters, Availability} from "../util";

const props = defineProps({
	filters: {
		type: Object as PropType<SessionFilters>,
		required: true,
	},
});

const subjectElementId = (subject: string) => `subject-${subject}`;

const updateSubjects = () => {
    props.filters.subjects = [...document.querySelectorAll("input[name='subject']:checked")]
            .map(element => element.value);
};

const globalThis = window.globalThis;
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
                        :value="Availability.All"
                        v-model="filters.availability"
                        name="availability"
                        id="all" />
                <label for="all">All</label>
            </div>

            <div>
                <input type="radio"
                        :value="Availability.Open"
                        v-model="filters.availability"
                        name="availability"
                        id="open" />
                <label for="open">Open</label>
            </div>

            <div>
                <input type="radio"
                        :value="Availability.Closed"
                        v-model="filters.availability"
                        name="availability"
                        id="closed" />
                <label for="closed">Closed</label>
            </div>
        </option->

        <div v-if="globalThis.isTutor"
                class="manage-sessions">
            <div><a href="/forms/tutorviewclasses/">Manage your sessions</a></div>
            <div><a href="/forms/newsession/">Add a session</a></div>
        </div>
    </session-options>
</template>


<style lang="scss" scoped>
session-options {
    display: flex;
    flex-flow: column;
    gap: 1em;

    height: min-content;
    position: sticky;
    top: var(--scroll-padding-top);
    
    white-space: nowrap;
        
    font-size: 0.75em;

    > option- {
        display: flex;
        flex-flow: column;
        // align-items: center;
        // gap: 1em;

        > h3 {
            margin: 0;
            margin-right: 0.5em;
        }
    }

    > .manage-sessions {
        white-space: normal;
        display: flex;
        flex-flow: column;
        gap: 1em;
    }
}
</style>
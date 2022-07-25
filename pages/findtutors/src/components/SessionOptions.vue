<script setup lang="ts">
import {ref, PropType, watch} from "vue";

import SessionOptionsSubjectCategoryHeading from "./SessionOptionsSubjectCategoryHeading.vue";

import subjectCategories from "../../../../lib/subjects";

import {SessionFilters, Availability} from "../../../util";
import {config} from "../store";

const props = defineProps<{
	filters: SessionFilters,
}>();

const subjectElementId = (subject: string) => `subject-${subject}`;

const selectedSubjects = ref(new Set<string>());
watch(selectedSubjects, () => {
    props.filters.subjects = [...selectedSubjects.value];
});
</script>

<template>
    <session-options>
        <option- class="multisection">
            <h3>Subject</h3>
            <div class="option-section" v-for="[category, subjects] of subjectCategories">
                <SessionOptionsSubjectCategoryHeading :category="category"
                        :filters="filters"
                        :selectedSubjects="selectedSubjects" />
                <div class="tickbox-option"
                        v-for="subject of subjects">
                    <input type="checkbox"
                            :value="subject"
                            name="subject"
                            v-model="selectedSubjects"
                            :id="subjectElementId(subject)" />
                    <label :for="subjectElementId(subject)">{{subject}}</label>
                </div>
            </div>
        </option->
        
        <option->
            <h3>Availability</h3>
            <div class="tickbox-option">
                <input type="radio"
                        :value="Availability.All"
                        v-model="filters.availability"
                        name="availability"
                        id="all" />
                <label for="all">All</label>
            </div>

            <div class="tickbox-option">
                <input type="radio"
                        :value="Availability.Open"
                        v-model="filters.availability"
                        name="availability"
                        id="open" />
                <label for="open">Open</label>
            </div>

            <div class="tickbox-option">
                <input type="radio"
                        :value="Availability.Closed"
                        v-model="filters.availability"
                        name="availability"
                        id="closed" />
                <label for="closed">Closed</label>
            </div>
        </option->

        <template v-if="config.clientIsTutor">
            <hr />

            <option->
                <h3>For tutors</h3>

                <div class="tickbox-option">
                    <input type="checkbox"
                            v-model="filters.taughtByYou"
                            id="taught-by-you" />
                    <label for="taught-by-you">Offered by you</label>
                </div>

                <div class="manage-sessions">
                    <div><a href="/forms/tutorviewclasses/">Manage your sessions</a></div>
                </div>
            </option->
        </template>
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
    
    // white-space: nowrap;
        
    font-size: 0.75em;

    h3 {
        margin: 0;
        margin-right: 0.5em;
    }

    h4 {
        margin-bottom: 0.25em;
        font-family: var(--font-large);
    }

    > option- {
        display: flex;
        flex-flow: column;
        // align-items: center;
        &.multisection {
            gap: 0.5em;

            .option-section {
                display: flex;
                flex-flow: column;
                gap: 0.125em;
            }
        }

        > .manage-sessions {
            display: flex;
            flex-flow: column;

            white-space: normal;
            gap: 1em;
            margin-top: 1em;
        }

        :deep(.tickbox-option) {
            display: flex;
            gap: 0.25em;
            align-items: start;

            &:is(h4) {
                align-items: center;
            }

            > input {
                margin: 0;
            }

            > label {
                flex-grow: 1;
            }
        }
    }

    hr {
        width: 100%;
    }
}
</style>
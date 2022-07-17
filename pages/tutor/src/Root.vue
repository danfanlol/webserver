<script setup lang="ts">
import {reactive} from "vue";

import SessionOptions from "./components/SessionOptions.vue";
import SessionCalendar from "./components/SessionCalendar.vue";

import {Availability} from "../../util";

import {config} from "./store";

const props = defineProps({
    clientUsername: {
        type: String,
        required: true,
    },

    clientIsTutor: {
        type: Boolean,
        required: true,
    },
    
    pageOwnerUsername: {
        type: String,
        required: true,
    },

    isTutorPage: {
        type: Boolean,
        required: true,
    },
});

config.set(props);

const filters = reactive({
    subjects: [],
    availability: Availability.All,
});
</script>

<template>
    <h3>Upcoming sessions</h3>
    <Suspense>
        <SessionCalendar :filters="filters" />

        <template #fallback>
            <session-list>
                <div>Loading sessions</div>
            </session-list>
        </template>
    </Suspense>
</template>
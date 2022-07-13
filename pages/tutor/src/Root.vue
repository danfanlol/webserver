<script setup lang="ts">
import {reactive} from "vue";

import SessionOptions from "./components/SessionOptions.vue";
import SessionList from "./components/SessionList.vue";

import {Availability} from "../../util";

import {config} from "./store";

const props = defineProps({
    username: {
        type: String,
        required: true,
    },

    isTutor: {
        type: Boolean,
        required: true,
    },
    
    tutorUsername: {
        type: String,
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
    <Suspense>
        <SessionList :filters="filters" />

        <template #fallback>
            <session-list>
                <div>Loading sessions</div>
            </session-list>
        </template>
    </Suspense>
</template>

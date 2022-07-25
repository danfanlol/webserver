<script setup lang="ts">
import {reactive} from "vue";

import SessionOptions from "./components/SessionOptions.vue";
import SessionList from "./components/SessionList.vue";

import {Availability} from "../../util";

import {config} from "./store";

// May want to make these checks cookie-based in the future?
const props = defineProps<{
    clientUsername: string,
    clientIsTutor: string,
}>();

config.set(props);

const filters = reactive({
    subjects: [],
    availability: Availability.All,
    taughtByYou: false,
});
</script>

<template>
    <SessionOptions :filters="filters" />

    <Suspense>
        <SessionList :filters="filters" />

        <template #fallback>
            <session-list>
                <div>Loading sessions</div>
            </session-list>
        </template>
    </Suspense>
</template>

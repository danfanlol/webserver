<script setup lang="ts">
import {reactive} from "vue";

import SessionOptions from "./components/SessionOptions.vue";
import SessionList from "./components/SessionList.vue";

import {Availability} from "./util";

const filters = reactive({
    subjects: [],
    availability: Availability.All,
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

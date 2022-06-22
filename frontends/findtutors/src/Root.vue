<script setup lang="ts">
import {reactive} from "vue";

import SessionItems from "./components/SessionItems.vue";
import SessionOptions from "./components/SessionOptions.vue";

const filters = reactive({
    subjects: [],
});
</script>

<template>
    <SessionOptions :filters="filters" />

    <session-list>
        <Suspense>
            <SessionItems :filters="filters" />

            <template #fallback>
                <div>
                    Loading sessions
                </div>
            </template>
        </Suspense>
    </session-list>
</template>

<script setup lang="ts">
import {reactive} from "vue";

import SessionOptions from "./components/SessionOptions.vue";
import SessionCalendar from "./components/SessionCalendar.vue";

import {Availability} from "../../util";

import {config} from "./store";

const props = defineProps<{
    clientUsername: string,
    clientIsTutor: boolean,
    pageOwnerUsername: string,
    isTutorPage: boolean,
}>();

config.set(props);

const filters = reactive({
    subjects: [],
    availability: Availability.All,
    taughtByYou: false,
});
</script>

<template>
    <h3>Upcoming sessions</h3>
    <div class="top">
        <div class="note">Dates and times are in your local timezone</div>
        <div>
            <a v-if="!config.isTutorPage && config.isOwnPage"
                    href="/findtutors/">Find more sessions</a>
        </div>
    </div>

    <Suspense>
        <SessionCalendar :filters="filters" />

        <template #fallback>
            <session-calendar>
                <div>Loading sessions</div>
            </session-calendar>
        </template>
    </Suspense>
</template>

<style lang="scss" scoped>
.top {
    display: flex;
    gap: 2ch;
    
    margin-bottom: 0.5em;
    font-size: 0.85em;

    > .note {

        opacity: 0.5;
        font-style: italic;
    }
}
</style>
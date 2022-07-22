<script setup lang="ts">
import UserLists from "./components/UserLists.vue";

const props = defineProps();
</script>

<template>
    <h2>Members</h2>

    <Suspense>
        <UserLists />

        <template #fallback>
            <user-list>
                <div>Loading</div>
            </user-list>
        </template>
    </Suspense>
</template>

<style lang="scss" scoped>
</style>
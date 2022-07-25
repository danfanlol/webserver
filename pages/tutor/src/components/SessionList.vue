<script setup lang="ts">
import {ref, computed, watch, PropType} from "vue";

import SessionItem from "../../../_shared/SessionItem.vue";
import {useSessionFetch} from "../../../_shared/useApiFetch";

import {SessionFilters, Availability} from "../../../util";

import {config} from "../store";

const props = defineProps({
	filters: {
		type: Object as PropType<SessionFilters>,
		required: true,
	},
});


const sessionQuery = computed(() => {
	const params = new URLSearchParams();

	if (props.filters.subjects.length !== 0) {
		params.set("subject", props.filters.subjects.join("|"));
	}

	if (props.filters.availability !== Availability.All) {
		params.set("open", props.filters.availability === Availability.Open ? "1" : "0");
	}

	params.set(config.isTutorPage ? "tutor" : "student", config.pageOwnerUsername);

	return params;
});

const {sessions, hasResults, waiting} = await useSessionFetch(sessionQuery);
</script>

<template>
    <session-list
			:class="{
				waiting,
			}">
		<SessionItem v-for="session of sessions"
				v-if="hasResults"
				:key="session._id"
				:session="session" />
		<div v-else>No results! Check the search filters.</div>
    </session-list>
</template>

<style lang="scss" scoped>
</style>

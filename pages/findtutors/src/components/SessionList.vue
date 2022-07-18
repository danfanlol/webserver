<script setup lang="ts">
import {ref, computed, watch, PropType} from "vue";

import SessionItem from "../../../_shared/SessionItem.vue";
import {useSessionFetch} from "../../../_shared/useSessionFetch";

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

	if (props.filters.taughtByYou) {
		params.set("tutor", config.clientUsername);
	}

	return params;
});

const {latestPromiseResolved, sessions, hasSessions} = await useSessionFetch(sessionQuery);
</script>

<template>
    <session-list
			:class="{
				waiting: !latestPromiseResolved,
			}">
		<SessionItem v-for="session of sessions"
				v-if="hasSessions"
				:key="session._id"
				:session="session"
				:clientUsername="config.clientUsername" />
		<div v-else>No results! Check the search filters.</div>
    </session-list>
</template>

<style lang="scss" scoped>
.waiting {
	opacity: 0.25;
}
</style>

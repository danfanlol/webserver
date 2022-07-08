<script setup lang="ts">
import {ref, computed, watch, PropType} from "vue";

import SessionItem from "./SessionItem.vue";

import {SessionFilters, Availability} from "../util";

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
		params.set("tutor", globalThis.username);
	}

	return params;
});

const reloadResults = async () => {
	const promise = fetch(`/api/session/?${sessionQuery.value}`)
			.then(response => response.json());

	latestPromise.value = promise;
	const newSessions = await promise;

	if (promise !== latestPromise.value) return;
	sessions.value = newSessions;
};

const latestPromise = ref(Promise.resolve());
const latestPromiseResolved = ref(true);
watch(latestPromise, () => {
	latestPromiseResolved.value = false;

	const promise = latestPromise.value;
	promise.finally(() => {
		if (promise !== latestPromise.value) return;
		latestPromiseResolved.value = true;
	});
});

const sessions = ref(await (await fetch("/api/session/")).json());
const hasSessions = computed(() => sessions.value.length !== 0);
watch(props.filters, reloadResults);
</script>

<template>
    <session-list
			:class="{
				waiting: !latestPromiseResolved,
			}">
		<SessionItem v-for="session of sessions"
				v-if="hasSessions"
				:key="session._id"
				:session="session" />
		<div v-else>No results! Check the search filters.</div>
    </session-list>
</template>

<style lang="scss" scoped>
.waiting {
	opacity: 0.25;
}
</style>

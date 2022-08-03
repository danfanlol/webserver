<script setup lang="ts">
import {ref, computed, watch, PropType} from "vue";

import SessionItem from "../../_shared/SessionItem.vue";
import {useSessionFetch} from "../../_shared/useApiFetch";

import {SessionFilters, Availability} from "../../util";

import {config} from "../store";

const props = defineProps<{
	filters: SessionFilters,
}>();

const sessionQuery = computed(() => {
	const params = new URLSearchParams();

	if (props.filters.subjects.length !== 0) {
		params.set("subject", props.filters.subjects.join("|"));
	}

	if (props.filters.availability !== Availability.All) {
		params.set("open", props.filters.availability === Availability.Open ? "1" : "0");
	}

	if (props.filters.taughtByYou) {
		params.set("tutorId", config.clientId);
	}

	params.set("afterDate", Date.now().toString());

	return params;
});

const {sessions, hasResults, reloadResults, waiting} = await useSessionFetch(sessionQuery);
const onDeleteSession = (session: object) => {
	sessions.value.splice(sessions.value.indexOf(session), 1);
	sessions.value = sessions.value; // trigger reaction
};
</script>

<template>
    <session-list
			:class="{
				waiting,
			}">
		<session-list-top>
			<button @click="reloadResults">Reload</button>
			{{sessions.length}} result{{sessions.length !== 1 ? "s" : ""}}
		</session-list-top>
		<session-items v-if="hasResults">
			<SessionItem v-for="session of sessions"
					:key="session._id"
					:session="session"
					:clientId="config.clientId"
					:clientIsTutor="config.clientIsTutor"
					@delete="onDeleteSession" />
		</session-items>
		<div v-else>No results! Check the search filters.</div>
    </session-list>
</template>

<style lang="scss" scoped>
session-list {
	display: flex;
	flex-flow: column;
	width: 100%;

	flex-grow: 1;

	gap: 0.5em;

	> session-list-top {
		text-align: left;
	}

	> session-items {
		display: flex;
		flex-flow: wrap;
		width: 100%;
		height: min-content;
		justify-content: center;
		align-items: center;
		gap: 1em;
	}
}
</style>

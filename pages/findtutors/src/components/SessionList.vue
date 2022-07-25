<script setup lang="ts">
import {ref, computed, watch, PropType} from "vue";

import SessionItem from "../../../_shared/SessionItem.vue";
import {useSessionFetch} from "../../../_shared/useSessionFetch";

import {SessionFilters, Availability} from "../../../util";

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
		params.set("tutor", config.clientUsername);
	}

	params.set("afterDate", Date.now().toString());

	return params;
});

const {reloadSessions, latestPromiseResolved, sessions, hasSessions} = await useSessionFetch(sessionQuery);
const onDeleteSession = (session: object) => {
	sessions.value.splice(sessions.value.indexOf(session), 1);
	sessions.value = sessions.value; // trigger reaction
};
</script>

<template>
    <session-list
			:class="{
				waiting: !latestPromiseResolved,
			}">
		<session-list-top>
			<button @click="reloadSessions">Reload</button>
			{{sessions.length}} result{{sessions.length !== 1 ? "s" : ""}}
		</session-list-top>
		<session-items v-if="hasSessions">
			<SessionItem v-for="session of sessions"
					:key="session._id"
					:session="session"
					:clientUsername="config.clientUsername"
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

	&.waiting {
		opacity: 0.25;
	}

	> session-list-top {
		font-size: 0.75em;
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

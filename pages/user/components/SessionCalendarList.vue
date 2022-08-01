<script setup lang="ts">
import {ref, computed, watch, PropType} from "vue";

import SessionItem from "../../_shared/SessionItem.vue";
import {useSessionFetch} from "../../_shared/useApiFetch";

import {SessionFilters, Availability} from "../../util";

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

const {sessions, waiting} = await useSessionFetch(sessionQuery);

/* const sameDay = (date0: Date, date1: Date) =>
		date0.getUTCFullYear() === date1.getUTCFullYear()
		&& date0.getUTCMonth() === date1.getUTCMonth()
		&& date0.getUTCDate() === date1.getUTCDate(); */

const nextWeekSessions = computed(() => Array.from({length: 7}, (_, nDaysOffset) =>
		sessions.value.filter(session => Math.floor(session.begin / 24) === addDays(startingDate, nDaysOffset).getDay())) // temp weekday check using current database param
);
const startingDate = new Date();
const addDays = (date: Date, nDays: number) => new Date(date.getTime() + nDays * 24 * 60 * 60 * 1000);

const dateString = (date: Date) => date.toLocaleDateString(undefined, {
	weekday: "short",
	month: "short",
	day: "numeric",
	// year: "numeric",
});
</script>

<template>
    <session-calendar-list
			:class="{
				waiting,
			}">
		<div class="note">Dates and times are in your local timezone</div>

		<template v-for="(daySessions, nDaysOffset) of nextWeekSessions">
			<calendar-day-date
					:class="{
						today: nDaysOffset === 0,
					}">{{dateString(addDays(startingDate, nDaysOffset))}}</calendar-day-date>

			<calendar-day-sessions>
				<SessionItem v-for="session of daySessions"
						v-if="daySessions.length !== 0"
						:key="session._id"
						:session="session" />
				<div v-else-if="nDaysOffset === 0">No sessions today!</div>
			</calendar-day-sessions>
		</template>
    </session-calendar-list>
</template>

<style lang="scss" scoped>
session-calendar-list {
	display: grid;
	gap: 1em;
	grid-template-columns: min-content auto;

	> .note {
		grid-column: 1 / -1;
		opacity: 0.5;
		font-style: italic;
	}

	calendar-day-date {
		padding: 0.25em 0.5em;
		margin-bottom: auto;

		border-radius: 1em;
		line-height: 1;
		text-align: right;
		white-space: nowrap;

		font-family: var(--font-heading);

		&.today {
			background: var(--col-red);
			color: #fff;
		}
	}

	calendar-day-sessions {
		display: flex;
		align-items: center;
		gap: 0.5em;
	}
}
</style>

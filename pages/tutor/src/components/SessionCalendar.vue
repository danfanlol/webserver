<script setup lang="ts">
import {ref, computed, watch, PropType} from "vue";

import SessionItem from "./SessionItem.vue";

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

	params.set("tutor", config.tutorUsername);

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

const sessions = ref<any[]>(await (await fetch(`/api/session/?${sessionQuery.value}`)).json());
const hasSessions = computed(() => sessions.value.length !== 0);
watch(props.filters, reloadResults);

const sameDay = (date0: Date, date1: Date) =>
		date0.getUTCFullYear() === date1.getUTCFullYear()
		&& date0.getUTCMonth() === date1.getUTCMonth()
		&& date0.getUTCDate() === date1.getUTCDate();

const currentDate = new Date();

const nWeeksDisplayed = 4;
const nDaysDisplayed = nWeeksDisplayed * 7;

const addDays = (date: Date, nDays: number) => new Date(date.getTime() + nDays * 24 * 60 * 60 * 1000);

const startOfLocalDay = (date: Date) => {
	const newDate = new Date(date)
	newDate.setHours(0, 0, 0, 0);
	return newDate;
};

const startingDate = addDays(startOfLocalDay(currentDate), -currentDate.getDay()); // Start of the current week

const futureSessions = computed(() => Array.from({length: nDaysDisplayed}, (_, nDaysOffset) =>
		sessions.value.filter(session => session.begin !== undefined
				? (Math.floor(session.begin / 24) + 1) % 7 === addDays(startingDate, nDaysOffset).getDay() // temp weekday check using current database param
				: sameDay(addDays(startingDate, nDaysOffset), new Date(Date.parse(session.startDate)))))
);

const dateString = (date: Date) => date.toLocaleDateString(undefined, {
	// weekday: "short",
	month: "short",
	day: "numeric",
	// year: "numeric",
});

const tryCreateSession = async (startDate: Date) => {
	await fetch("/api/session/", {
		method: "POST",
		body: JSON.stringify({
			subject: "US History",
			duration: 1,
			startDate: startDate.getTime(),
		}),
		headers: {
			"Content-Type": "application/json",
		},
	});

	reloadResults();
};
</script>

<template>
    <session-calendar
			:class="{
				waiting: !latestPromiseResolved,
			}">
		<div class="note">Dates and times are in your local timezone</div>

		<calendar-day v-for="(number, i) of nDaysDisplayed">
			<calendar-day-top>
				<div>
					<button v-if="config.isOwnPage"
							@click="tryCreateSession(addDays(startingDate, i))">+</button>
				</div>

				<calendar-day-date
						:class="{
							today: sameDay(currentDate, addDays(startingDate, i)),
						}">{{dateString(addDays(startingDate, i))}}</calendar-day-date>
			</calendar-day-top>

			<calendar-day-sessions>
				<SessionItem v-for="session of futureSessions[i]"
						:key="session._id"
						:session="session" />
			</calendar-day-sessions>
		</calendar-day>

		<!-- <template v-for="(daySessions, nDaysOffset) of nextWeekSessions">
			<calendar-day-date
					:class="{
						today: nDaysOffset === 0,
					}">{{dateString(addDays(currentDate, nDaysOffset))}}</calendar-day-date>

			<calendar-day-sessions>
				<SessionItem v-for="session of daySessions"
						v-if="daySessions.length !== 0"
						:key="session._id"
						:session="session" />
				<div v-else-if="nDaysOffset === 0">No sessions today!</div>
			</calendar-day-sessions>
		</template> -->
    </session-calendar>
</template>

<style lang="scss" scoped>
.waiting {
	opacity: 0.25;
}

session-calendar {
	display: grid;
	grid-template-columns: repeat(7, 1fr);

	font-size: 0.85em;

	> .note {
		grid-column: 1 / -1;
		opacity: 0.5;
		font-style: italic;
	}

	> calendar-day {
		display: flex;
		flex-flow: column;
		border: 1px solid #ddd;
		padding: 0.25em;
		gap: 0.25em;

		calendar-day-top {
			display: flex;
			justify-content: space-between;

			calendar-day-date {
				padding: 0.25em 0.5em;

				border-radius: 1em;
				line-height: 1;
				text-align: right;
				white-space: nowrap;

				font-family: var(--font-large);

				&.today {
					background: var(--col-orange);
					color: #fff;
				}
			}
		}

		calendar-day-sessions {
			display: flex;
			flex-flow: column;
			align-items: center;
			gap: 0.5em;
		}
	}
}
</style>

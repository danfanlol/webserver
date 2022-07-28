<script setup lang="ts">
import {ref, computed, watch, PropType} from "vue";

import SessionItem from "../../_shared/SessionItem.vue";
import {useSessionFetch} from "../../_shared/useApiFetch";

import {SessionFilters, Availability, sameLocalDay, nowGreatest15Minutes} from "../../util";

import {config} from "../store";

const props = defineProps<{
	filters: SessionFilters,
}>();


const currentDate = new Date();

const nWeeksDisplayed = 4;
const nDaysDisplayed = nWeeksDisplayed * 7;

const addDays = (date: Date, nDays: number) => new Date(date.getTime() + nDays * 24 * 60 * 60 * 1000);

const startOfLocalDay = (date: Date) => {
	const newDate = new Date(date)
	newDate.setHours(0, 0, 0, 0);
	return newDate;
};

const dayHasPast = (date: Date) => date.getTime() < startOfLocalDay(currentDate).getTime();

const startingLocalDate = addDays(startOfLocalDay(currentDate), -currentDate.getDay()); // Start of the current week

const futureSessions = computed(() => Array.from({length: nDaysDisplayed}, (_, nDaysOffset) =>
		sessions.value.filter(session => session.startDate
				? sameLocalDay(addDays(startingLocalDate, nDaysOffset), new Date(Date.parse(session.startDate)))
				: (Math.floor(session.begin / 24) + 1) % 7 === addDays(startingLocalDate, nDaysOffset).getDay() // temp weekday check using current database param
		)
));

const dateString = (date: Date) => date.toLocaleDateString([], {
	// weekday: "short",
	month: "short",
	day: "numeric",
	// year: "numeric",
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
	params.set("afterDate", startingLocalDate.getTime().toString());

	return params;
});

const {sessions, reloadResults, waiting} = await useSessionFetch(sessionQuery);
const onDeleteSession = (session: object) => {
	sessions.value.splice(sessions.value.indexOf(session), 1);
	sessions.value = sessions.value; // trigger reaction
};


const createUnpublishedSession = async (startDate: Date) => {
	const newSession = {
		tutor: config.clientUsername,
		subject: "Spanish",
		startDate: nowGreatest15Minutes(startDate).toISOString(),
		duration: 1,
		unpublished: true,
	};

	sessions.value.push(newSession);
};
</script>

<template>
    <session-calendar
			:class="{
				waiting,
			}">
		<session-calendar-top>
			<button @click="reloadResults">Reload</button>&nbsp;
			<template v-if="sessions.length === 0">
				<div v-if="config.isTutorPage">No sessions available!</div>
				<div v-else>You don’t have any upcoming sessions!</div>
			</template>
		</session-calendar-top>

		<calendar-weekday v-for="number, i of 7">
			{{addDays(startingLocalDate, i).toLocaleDateString([], {
				weekday: "short",
			})}}
		</calendar-weekday>

		<calendar-day v-for="number, i of nDaysDisplayed"
				:class="{
					past: dayHasPast(addDays(startingLocalDate, i)),
					weekend: [0, 6].includes(addDays(startingLocalDate, i).getDay()),
				}">
			<calendar-day-top>
				<div>
					<button v-if="config.isOwnPage
							&& config.isTutorPage
							&& !dayHasPast(addDays(startingLocalDate, i))"
							
							@click="createUnpublishedSession(addDays(startingLocalDate, i))">+</button>
				</div>

				<calendar-day-date
						:class="{
							today: sameLocalDay(currentDate, addDays(startingLocalDate, i)),
						}">{{dateString(addDays(startingLocalDate, i))}}</calendar-day-date>
			</calendar-day-top>

			<calendar-day-sessions>
				<SessionItem v-for="session of futureSessions[i]"
						:key="session._id"
						:session="session"
						:clientUsername="config.clientUsername"
						:clientIsTutor="config.clientIsTutor"
						:displayDate="false"
						:isOnDashboard="true"
						:isTutorPage="config.isTutorPage"
						:isOwnPage="config.isOwnPage"
						@delete="onDeleteSession" />
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
session-calendar {
	display: grid;
	grid-template-columns: repeat(7, 1fr);

	font-size: 0.85em;

	> session-calendar-top {
		grid-column: 1 / -1;
	}

	> calendar-weekday {
		text-align: right;
		font-family: var(--font-large);
	}

	> calendar-day {
		display: flex;
		flex-flow: column;
		border: 1px solid #ddd;
		box-shadow: 0 0 0 1px #ddd;
		padding: 0.25em 0.25em 2em 0.25em;
		gap: 0.25em;

		&.past {
			opacity: 0.25;
		}

		&.weekend {
			background: #eeeeee7f;
		}

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

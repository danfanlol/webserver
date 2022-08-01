<script lang="ts" setup>
import {ref, computed} from "vue";

import {sameLocalDay, nowGreatest15Minutes} from "../util";
import subjectCategories, {categoriesBySubject} from "../../lib/subjects";

import DateEntry from "./DateEntry.vue";

const props = defineProps({
	session: {
		type: Object,
		required: true,
	},

	clientUsername: {
		type: String,
	},
	
	clientIsTutor: {
		type: Boolean,
		default: false,
	},

	displayDate: {
		type: Boolean,
		default: true,
	},

	isOnDashboard: {
		type: Boolean,
		default: false,
	},

	isTutorPage: {
		type: Boolean,
		default: false,
	},

	isOwnPage: {
		type: Boolean,
		default: false,
	},
});

const emit = defineEmits<{
	(event: "delete", session: object): void,
}>();

const reserved = computed(() => Boolean(props.session.student)
		&& props.session.student !== props.clientUsername);
const reservedByYou = computed(() => Boolean(props.session.student)
		&& props.session.student === props.clientUsername);
const taughtByYou = computed(() => props.session.tutor === props.clientUsername);

const addHours = (date: Date, nHours: number) => new Date(date.getTime() + nHours * 60 * 60 * 1000);

const startDate = computed(() => new Date(Date.parse(props.session.startDate)));
const endDate = computed(() => addHours(startDate.value, props.session.duration));
const past = computed(() => endDate.value.getTime() < Date.now());
const category = computed(() => categoriesBySubject.get(workingSubject.value));

const dateString = (date: Date, displayDate: boolean=false) => displayDate
		? date.toLocaleString([], {
			weekday: "short",
			year: "numeric",
			month: "short",
			day: "numeric",
			hour: "numeric",
			minute: "numeric",
		})
		: date.toLocaleTimeString([], {
			timeStyle: "short",
		});

const timeDenominationString = (timeSpan: number) => {
	if (timeSpan < 60 * 1000) {
		return "< 1 min";
	} else if (timeSpan < 60 * 60 * 1000) {
		return `${Math.floor(timeSpan / 60 / 1000)} min`;
	} else if (timeSpan < 24 * 60 * 60 * 1000) {
		return `${Math.floor(timeSpan / 60 / 60 / 1000)} hr`;
	} else {
		const nDays = Math.floor(timeSpan / 24 / 60 / 60 / 1000);
		return `${nDays} day${nDays !== 1 ? "s" : ""}`;
	}
};

const fuzzyTime = computed(() => {
	if (isNaN(startDate.value.getTime())) return "";

	const now = Date.now();

	if (now < startDate.value.getTime()) {
		return `In ${timeDenominationString(startDate.value.getTime() - now)}`;
	} else if (now > endDate.value.getTime()) {
		return `${timeDenominationString(now - endDate.value.getTime())} ago`;
	} else {
		return "Currently ongoing!";
	}
});


const waiting = ref(false);

const tryQuitSession = async () => {
	waiting.value = true;
	const session = await fetch("/api/stdviewclasses/", {
		method: "POST",
		body: JSON.stringify({
			session: props.session._id,
			operation: "quit",
		}),
		headers: {
			"Content-Type": "application/json",
		},
	}).finally(() => {
		waiting.value = false;
	});
	props.session.student = "";
	props.session.confirmed = false;
};

const tryReserveSession = async () => {
	waiting.value = true;
	await fetch("/api/signup/", {
		method: "POST",
		body: JSON.stringify({
			sessionId: props.session._id,
		}),
		headers: {
			"Content-Type": "application/json",
		},
	}).finally(() => {
		waiting.value = false;
	});
	props.session.student = props.clientUsername;
};

const tryDeleteSession = async () => {
	waiting.value = true;
	await fetch("/api/tutorviewclasses/", {
		method: "POST",
		body: JSON.stringify({
			session: props.session._id,
			operation: "delete",
		}),
		headers: {
			"Content-Type": "application/json",
		},
	}).finally(() => {
		waiting.value = false;
	});

	emit("delete", props.session);
};

const tryConfirmStudent = async () => {
	waiting.value = true;
	await fetch("/api/tutorviewclasses/", {
		method: "POST",
		body: JSON.stringify({
			session: props.session._id,
			operation: "confirm",
		}),
		headers: {
			"Content-Type": "application/json",
		},
	}).finally(() => {
		waiting.value = false;
	});
	props.session.confirmed = true;
};

const tryKickStudent = async () => {
	waiting.value = true;
	await fetch("/api/tutorviewclasses/", {
		method: "POST",
		body: JSON.stringify({
			session: props.session._id,
			operation: "kick",
		}),
		headers: {
			"Content-Type": "application/json",
		},
	}).finally(() => {
		waiting.value = false;
	});
	props.session.confirmed = false;
	props.session.student = "";
	props.session.reserved = false;
};


const isEditing = ref(props.session.unpublished ?? false);
const newSubject = ref(props.session.subject);
const newStartDate = ref(startDate.value);
const newDuration = ref(props.session.duration);
const newMeetingUrl = ref(props.session.meetingUrl);
const newEndDate = computed({
	get: () => addHours(newStartDate.value, newDuration.value),
	set(value) {
		newDuration.value = (value.getTime() - newStartDate.value.getTime()) / 1000 / 60 / 60;
	},
});
const beginEditSession = () => {
	isEditing.value = true;
};
const endEditSession = () => {
	isEditing.value = false;

	newSubject.value = props.session.subject;
	newStartDate.value = startDate.value;
	newDuration.value = props.session.duration;
	newMeetingUrl.value = props.session.meetingUrl;
};
const tryUpdateSession = async () => {
	waiting.value = true;
	await fetch("/api/session/edit/", {
		method: "POST",
		body: JSON.stringify({
			sessionId: props.session._id,
			subject: newSubject.value,
			startDate: newStartDate.value.getTime(),
			duration: newDuration.value,
			meetingUrl: newMeetingUrl.value,
		}),
		headers: {
			"Content-Type": "application/json",
		},
	}).finally(() => {
		waiting.value = false;
	});

	// temp
	props.session.subject = newSubject.value;
	props.session.startDate = newStartDate.value.toISOString();
	props.session.duration = newDuration.value;
	props.session.meetingUrl = newMeetingUrl.value;

	endEditSession();
};

const tryPublishSession = async () => {
	waiting.value = true;
	const session = await fetch("/api/session/", {
		method: "POST",
		body: JSON.stringify({
			subject: newSubject.value,
			startDate: newStartDate.value.getTime(),
			duration: newDuration.value,
			meetingUrl: newMeetingUrl.value,
		}),
		headers: {
			"Content-Type": "application/json",
		},
	}).finally(() => {
		waiting.value = false;
	})
			.then(response => response.json());
	props.session.unpublished = false;
	Object.assign(props.session, session);
	
	endEditSession();
};

const cancelPublishSession = async () => {
	emit("delete", props.session);
	endEditSession();
};

const workingSubject = computed(() => isEditing ? newSubject.value : props.session.subject);
</script>

<template>
	<session-item :class="{
				reserved: reserved && (!isOnDashboard || !taughtByYou),
				unclaimed: isOwnPage && !session.reserved && taughtByYou,
				past,
				unregistered: isOwnPage && !isTutorPage && !reservedByYou,
				editing: isEditing,
				'reserved-by-you': reservedByYou,
				'no-category': category === undefined,
			}"
			:style="{
				'--session-col-main': category?.color.main ?? 'inherit',
				'--session-col-dark': category?.color.dark ?? 'inherit',
				'--session-col-accent': category?.color.accent ?? 'inherit',
			} as any">
		<h3 v-if="!isEditing">{{session.subject}}</h3>
		<h3 v-else>
			<select v-model="newSubject">
				<optgroup v-for="[category, subjects] of subjectCategories"
						:label="category.label"
						:style="{
							'background': category.color.dark,
						}">
					<option v-for="subject of subjects"
							:value="subject">
						{{subject}}
					</option>
				</optgroup>
			</select>
		</h3>

		<session-people>
			<div v-if="!isTutorPage">Tutor: <a :href="`/tutor/${session.tutor}`"><b>{{session.tutor}}</b></a></div>

			<template v-if="taughtByYou && isOnDashboard">
				<div v-if="!session.reserved"
						class="notice">Unclaimed</div>
				<template v-else-if="!session.confirmed">
					<div>Requestee: <a :href="`/student/${session.student}`"><b>{{session.student}}</b></a></div>
					<div v-if="!past"
							:class="{waiting}">
						<button @click="tryConfirmStudent">Confirm</button>&nbsp;
						<button @click="tryKickStudent">Reject</button>
					</div>
				</template>
				<div v-else>
					<div>Student: <a :href="`/student/${session.student}`"><b>{{session.student}}</b></a></div>
					<div v-if="!past"
							:class="{waiting}">
						<button @click="tryKickStudent">Kick</button>
					</div>
				</div>
			</template>

			<template v-else>
				<div v-if="reserved"
						class="notice">Reserved</div>
				<div v-else-if="reservedByYou && !past && !clientIsTutor"
						:class="{waiting}"
						class="buttons">
					<i>Signed up</i>&#x2003;
					<button @click="tryQuitSession">Unregister</button>
				</div>
				<div v-else-if="!taughtByYou && !past && !clientIsTutor"
						:class="{waiting}"
						class="buttons">
					<button @click="tryReserveSession">Register</button>
				</div>

				<div v-if="reservedByYou && !session.confirmed"
						class="notice">Not yet confirmed!</div>
			</template>
		
			<template v-if="session.confirmed && !isEditing">
				<div v-if="!session.meetingUrl && taughtByYou"
						class="notice">
					Awaiting meeting link!
				</div>
				<div v-else-if="session.meetingUrl && (taughtByYou || reservedByYou)"
						class="meeting-link">
					<a :href="session.meetingUrl"
							target="_blank">Join meeting</a>
				</div>
			</template>

			<div v-if="isEditing"
					class="meeting-link-editor">
				Meeting link:
				<input v-model.lazy="newMeetingUrl"
						type="text"
						placeholder="https://zoom.us/XXXXXXXXX" />
			</div>
		</session-people>

		<session-time v-if="!isEditing">
			<div class="fuzzy-time">{{fuzzyTime}}</div>
			<div><b>{{dateString(startDate, displayDate)}}</b></div>
			<div>– <b>{{dateString(endDate, !sameLocalDay(startDate, endDate))}}</b></div>
			<div>({{session.duration * 60}} min)</div>
		</session-time>

		<session-time v-else>
			<div>
				Start:<br />
				<DateEntry v-model="newStartDate"
						:fallbackValue="nowGreatest15Minutes()" />
			</div>

			<div>
				End:<br />
				<DateEntry v-model="newEndDate"
						:fallbackValue="addHours(nowGreatest15Minutes(), newDuration)" />
			</div>

			<div>
				Duration:
				<input type="number"
						v-model="newDuration"
						min="0"
						max="24"
						step="0.25"
						title=""
						placeholder="1" /> hours
			</div>
		</session-time>

		<div v-if="taughtByYou"
				:class="{waiting}"
				class="buttons">
			<button v-if="!isEditing"
					@click="beginEditSession">Edit session</button>
			<template v-else-if="!session.unpublished">
				<button @click="tryUpdateSession">Save changes</button>
				<button @click="endEditSession">Cancel</button>
			</template>
			<template v-else>
				<button @click="tryPublishSession">Publish new session</button>
				<button @click="cancelPublishSession">Delete session</button>
			</template>
		</div>

		<div v-if="taughtByYou && !past && !session.unpublished"
				:class="{waiting}"
				class="buttons">
			<button @click="tryDeleteSession"
					class="danger">Delete session</button>
		</div>
	</session-item>
</template>

<style lang="scss" scoped>
session-item {
	--session-col-main: hsl(337deg 81% 53%);
	--session-col-dark: hsl(337, 81%, 33%);
	--session-col-accent: hsla(20, 61%, 80%, 0.5);

	min-width: 13.5em;
	max-width: 26ch; // temp?
	padding: 0.5em 0;
	display: flex;
	flex-flow: column;
	gap: 0.5em;

	background: radial-gradient(circle at top right, var(--session-col-accent) 3em, #0000 3.125em),
			radial-gradient(circle at bottom right, var(--session-col-dark), var(--session-col-main));
	border-radius: 1.8em .5em / 2em .5em;
	color: #fff;

	> * {
		padding: 0 1rem;
	}

	--session-box-shadow-col: var(--session-col-main);
	box-shadow: 0 0.125em 2em -0.5em var(--session-box-shadow-col);

	transition: opacity 0.1s ease-in-out;

	&.no-category {
		color: inherit;
		// border: 2px solid;

		--session-box-shadow-col: currentcolor;
	}

	&.reserved-by-you {
		outline: 4px dashed var(--session-col-main);
		outline-offset: 2px;
	}

	&.reserved {
		opacity: 0.3;
		transform: scale(0.875);
	}

	&:is(.unclaimed, .past, .unregistered) {
		opacity: 0.5;
	}

	&.editing {
		opacity: unset;
	}

	> h3 {
		margin: 0;

		optgroup {
			color: #fff;
			font-family: var(--font-large);

			option {
				color: #000;
				background: #fff;
				font-family: var(--font-body);
			}
		}
	}

	> session-people {
		padding-top: 0.5em;
		padding-bottom: 0.5em;

		background: #0000003f;
		box-shadow: 0 2em 2em #0000003f inset;

		&:empty {
			display: none;
		}

		> .meeting-link-editor {
			margin-top: 0.5em;
		}
	}

	> session-time {
		display: flex;
		gap: 0.25em;
		flex-flow: column;
		text-align: right;

		color: #ffffffef;
	}

	> .buttons {
		display: flex;
		flex-flow: row wrap;
		gap: 0.5em;
	}

	.notice {
		font-style: italic;
		text-align: right;

		margin-top: 0.25em;
	}

	.fuzzy-time {
		margin-bottom: 0.5em;
	}

	.meeting-link {
		text-align: right;
		font-weight: 800;
	}

	input[type="text"] {
		width: 100%;
	}

	input[type="number"] {
		width: 8ch;
	}
	
	input:is([type="text"], [type="number"], [type="datetime-local"]) {
		padding: 0.25em;

		background: #0000001f;
		color: inherit;
		border: 2px solid #ffffff7f;
		border-radius: 0.5em;
		box-shadow: 0 0.5em 2em #0000007f inset;
	}

	select {
		width: 100%;
		text-overflow: ellipsis;
		font-size: unset;
		font-family: inherit;

		option {
			font-family: var(--font-body);
		}

		> optgroup {
			font-size: 0.85rem;
		}
	}

	select,
	button {
		padding: 0.25em;
		
		background: var(--session-col-accent);
		color: inherit;
		border: 2px solid #ffffff7f;
		border-radius: 1em;
		box-shadow: 0 -0.25em 0.75em var(--session-col-dark) inset,
				0 0.25em 0.5em var(--session-col-dark);

		filter: saturate(1.5) brightness(1.0625);

		&:hover {
			filter: saturate(1.25) brightness(1.5);
		}

		&:active,
		&:focus {
			filter: brightness(1.25);
			background: var(--session-col-dark);
			box-shadow: 0 0.25em 0.75em #0000003f inset;
		}

		&.danger {
			background: #f57;
		}
	}
}
</style>
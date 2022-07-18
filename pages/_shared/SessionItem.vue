<script lang="ts" setup>
import {ref, computed} from "vue";

import {sameLocalDay} from "../util";
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
const category = computed(() => categoriesBySubject.get(workingSubject.value)!);

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


const waiting = ref(false);

const tryQuitSession = async () => {
	waiting.value = true;
	await fetch("/api/stdviewclasses/", {
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


const isEditing = ref(false);
const newSubject = ref(props.session.subject);
const newStartDate = ref(startDate.value);
const newDuration = ref(props.session.duration);
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

	endEditSession();
};

const workingSubject = computed(() => isEditing ? newSubject.value : props.session.subject);
</script>

<template>
	<session-item :class="{
				reserved: isOnDashboard
						? reserved && !taughtByYou
						: reserved,
				unclaimed: isOnDashboard && !session.reserved && taughtByYou,
				past,
				unregistered: isOnDashboard && !isTutorPage && !reservedByYou,
				editing: isEditing,
				'reserved-by-you': reservedByYou,
			}"
			:style="{
				'--session-col-main': category.color.main,
				'--session-col-dark': category.color.dark,
				'--session-col-accent': category.color.accent,
			} as any">
		<h3 v-if="!isEditing">{{session.subject}}</h3>
		<h3 v-else>
			<select v-model="newSubject">
				<optgroup v-for="[category, subjects] of subjectCategories"
						:label="category.label">
					<option v-for="subject of subjects"
							:value="subject">
						{{subject}}
					</option>
				</optgroup>
			</select>
		</h3>

		<session-people>
			<div v-if="!isTutorPage">Offered by <a :href="`/tutor/${session.tutor}`"><b>{{session.tutor}}</b></a></div>

			<template v-if="taughtByYou && isOnDashboard">
				<div v-if="!session.reserved"
						class="unclaimed-notice">Unclaimed</div>
				<template v-else-if="session.reserved && !session.confirmed">
					<div>Requested by <a :href="`/student/${session.student}`"><b>{{session.student}}</b></a></div>
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
				<div v-if="reserved">Reserved</div>
				<div v-else-if="reservedByYou && !past"
						:class="{waiting}">
					<i>Signed up</i>
					&#x2002;•&#x2002;
					<button @click="tryQuitSession">Unregister</button>
				</div>
				<div v-else-if="!taughtByYou && !past"
						:class="{waiting}">
					<button @click="tryReserveSession">Register</button>
				</div>
			</template>
		</session-people>

		<session-time v-if="!isEditing">
			<div><b>{{dateString(startDate, displayDate)}}</b></div>
			<div>– <b>{{dateString(endDate, !sameLocalDay(startDate, endDate))}}</b></div>
			<div>({{session.duration * 60}} min)</div>
		</session-time>

		<session-time v-else>
			Start
			<DateEntry v-model="newStartDate" />
			<br />
			End
			<DateEntry v-model="newEndDate" />
			<br />
			Duration:
			<input type="number"
					v-model="newDuration"
					min="0"
					max="24"
					step="0.25"
					title="" /> hours
		</session-time>

		<div v-if="taughtByYou"
				:class="{waiting}">
			<button v-if="!isEditing"
					@click="beginEditSession">Edit session</button>
			<template v-else>
				<button @click="tryUpdateSession">Save changes</button>&nbsp;
				<button @click="endEditSession">Cancel</button>
			</template>
		</div>

		<div v-if="taughtByYou && !past"
				:class="{waiting}">
			<button @click="tryDeleteSession">Cancel session</button>
		</div>
	</session-item>
</template>

<style lang="scss" scoped>
.waiting {
	opacity: 0.25;
}

session-item {
	--session-col-main: hsl(337deg 81% 53%);
	--session-col-dark: hsl(337, 81%, 33%);
	--session-col-accent: hsla(20, 61%, 80%, 0.5);

	background: radial-gradient(circle at top right, var(--session-col-accent) 3em, #0000 3.125em),
			radial-gradient(circle at bottom right, var(--session-col-dark), var(--session-col-main));
	border-radius: 1.8em .5em / 2em .5em;
	color: #fff;
	padding: 0.5em 1em;

	box-shadow: 0 0.125em 2em -0.5em var(--session-col-main);

	transition: opacity 0.1s ease-in-out;

	&.reserved-by-you {
		animation: none;

		outline: 4px dashed var(--session-col-main);
		outline-offset: 2px;
	}

	&:is(.unclaimed, .past, .unregistered) {
		opacity: 0.5;
	}

	&.editing {
		opacity: unset;

		select {
			width: 100%;
			text-overflow: ellipsis;
			font-size: unset;

			> optgroup {
				font-size: 0.85rem;
			}
		}
	}

	.unclaimed-notice {
		font-style: italic;
	}
}
</style>
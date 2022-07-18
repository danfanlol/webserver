<script lang="ts" setup>
import {ref, computed} from "vue";

import {categoriesBySubject} from "../../lib/subjects";

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
const category = computed(() => categoriesBySubject.get(props.session.subject)!);


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

	newStartDate.value = startDate.value;
};
const tryUpdateSession = async () => {
	waiting.value = true;
	await fetch("/api/session/edit/", {
		method: "POST",
		body: JSON.stringify({
			sessionId: props.session._id,
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
	props.session.startDate = newStartDate.value.toISOString();
	props.session.duration = newDuration.value;

	endEditSession();
};
</script>

<template>
	<session-item :class="{
				reserved: isOnDashboard
						? reserved && !taughtByYou
						: reserved,
				unclaimed: isOnDashboard
						? !session.reserved && taughtByYou
						: false,
				past,
				editing: isEditing,
				'reserved-by-you': reservedByYou,
			}"
			:style="{
				'--session-col-main': category.color.main,
				'--session-col-dark': category.color.dark,
				'--session-col-accent': category.color.accent,
			} as any">
		<h3>{{session.subject}}</h3>

		<session-people >
			<div v-if="!isTutorPage">Offered by <a :href="`/tutor/${session.tutor}`"><b>{{session.tutor}}</b></a></div>

			<template v-if="taughtByYou && isOnDashboard">
				<div v-if="!session.reserved"
						class="unclaimed-notice">Unclaimed</div>
				<template v-else-if="session.reserved && !session.confirmed">
					<div>Requested by <a :href="`/student/${session.student}`"><b>{{session.student}}</b></a></div>
					<div v-if="!past"
							:class="{waiting}">
						<button @click="tryConfirmStudent">Confirm</button> <button @click="tryKickStudent">Reject</button>
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
			<div>{{displayDate
					? startDate.toLocaleString([], {
						weekday: 'short',
						year: 'numeric',
						month: 'short',
						day: 'numeric',
						hour: 'numeric',
						minute: 'numeric',
					})
					: startDate.toLocaleTimeString([], {
						timeStyle: 'short',
					})}}</div>
			<div><b>{{session.duration * 60}} min</b></div>
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
					max="24" /> hours
		</session-time>

		<div v-if="taughtByYou"
				:class="{waiting}">
			<button v-if="!isEditing"
					@click="beginEditSession">Edit session</button>
			<template v-else>
				<button @click="tryUpdateSession">Save changes</button>
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

	&.unclaimed {
		opacity: 0.5;
	}

	&.past {
		opacity: 0.5;
	}

	&.editing {
		opacity: unset;
	}

	.unclaimed-notice {
		font-style: italic;
	}
}
</style>
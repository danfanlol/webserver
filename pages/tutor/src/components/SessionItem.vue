<script lang="ts" setup>
import {ref, computed} from "vue";

import {config} from "../store";

const props = defineProps({
	session: {
		type: Object,
		required: true,
	},
});

const waiting = ref(false);

const reserved = computed(() => Boolean(props.session.student)
		&& props.session.student !== config.username);
const reservedByYou = computed(() => Boolean(props.session.student)
		&& props.session.student === config.username);
const taughtByYou = computed(() => props.session.tutor === config.username);

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
	props.session.student = config.username;
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
</script>

<template>
	<session-item :class="{
				reserved: reserved && !taughtByYou,
				unclaimed: !session.reserved && taughtByYou,
				'reserved-by-you': reservedByYou,
			}">
		<h3>{{session.subject}}</h3>

		<session-people v-if="!taughtByYou">
			<div v-if="reserved">Reserved</div>
			<div v-else-if="reservedByYou"
					:class="{waiting}">
				<i>Signed up</i>
				&#x2002;•&#x2002;
				<button @click="tryQuitSession">Unregister</button>
			</div>
			<div v-else
					:class="{waiting}">
				<button @click="tryReserveSession">Register</button>
			</div>
		</session-people>

		<session-people v-else>
			<div v-if="!session.reserved"
					class="unclaimed-notice">Unclaimed</div>
			<template v-else-if="session.reserved && !session.confirmed">
				<div>Requested by <a :href="`/student/${session.student}`"><b>{{session.student}}</b></a></div>
				<div :class="{waiting}">
					<button @click="tryConfirmStudent">Confirm</button> <button @click="tryKickStudent">Reject</button>
				</div>
			</template>
			<div v-else>
				Student: <a :href="`/tutor/${session.tutor}`"><b>{{session.student}}</b></a>
				<div :class="{waiting}">
					<button @click="tryKickStudent">Kick</button>
				</div>
			</div>
		</session-people>

		<session-time>
			<div>Starts at <b>{{session.begin}}</b></div>
			<div>Up to <b>{{session.duration * 60}} min</b></div>
		</session-time>

		<div v-if="taughtByYou"
				:class="{waiting}">
			<button @click="tryDeleteSession">Cancel session</button>
		</div>
	</session-item>
</template>

<style lang="scss" scoped>
.waiting {
	opacity: 0.25;
}

session-item.unclaimed {
	opacity: 0.5;
}

.unclaimed-notice {
	font-style: italic;
}
</style>
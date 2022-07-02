<script lang="ts" setup>
import {ref, computed} from "vue";

const props = defineProps({
	session: {
		type: Object,
		required: true,
	},
});

const waiting = ref(false);

const reserved = computed(() => Boolean(props.session.student)
		&& props.session.student !== globalThis.username);
const reservedByYou = computed(() => Boolean(props.session.student)
		&& props.session.student === globalThis.username);
const taughtByYou = computed(() => props.session.tutor === globalThis.username);

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
	});
	waiting.value = false;
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
	});
	waiting.value = false;
	props.session.student = globalThis.username;
};
</script>

<template>
	<session-item :class="{
				reserved,
				'reserved-by-you': reservedByYou,
			}">
		<h3>{{session.subject}}</h3>

		<session-people>
			<div>Offered by <a :href="`/tutor/${session.tutor}`"><b>{{session.tutor}}</b></a></div>
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

		<session-time>
			<div>Starts at <b>{{session.begin}}</b></div>
			<div>Up to <b>{{session.duration * 60}} min</b></div>
		</session-time>
	</session-item>
</template>

<style lang="scss" scoped>
.waiting {
	opacity: 0.25;
}
</style>
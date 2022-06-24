<script lang="ts" setup>
import {computed} from "vue";

const props = defineProps({
	session: {
		type: Object,
		required: true,
	},
});

const reserved = computed(() => Boolean(props.session.student)
		&& props.session.student !== globalThis.username);
const reservedByYou = computed(() => Boolean(props.session.student)
		&& props.session.student === globalThis.username);

const tryReserveSession = async () => {
	await fetch("/api/signup/", {
		method: "POST",
		body: JSON.stringify({
			sessionId: props.session._id,
		}),
		headers: {
			"Content-Type": "application/json",
		},
	});
};
</script>

<template>
	<session-item :class="{
				reserved,
				'reserved-by-you': reservedByYou,
			}">
		<h3>{{session.subject}}</h3>

		<session-people>
			<div>Offered by <b>{{session.tutor}}</b></div>
			<div v-if="reserved">Reserved</div>
			<div v-else-if="reservedByYou"><i>Reserved by you</i></div>
			<div v-else>
				<button @click="tryReserveSession">Register</button>
			</div>
		</session-people>

		<session-time>Starts at <b>{{session.begin}}</b>&#x2002;•&#x2002;Up to <b>{{session.duration * 60}} min</b></session-time>
	</session-item>
</template>

<style lang="scss" scoped>
</style>
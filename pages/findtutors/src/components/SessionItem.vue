<script lang="ts" setup>
import {ref, computed} from "vue";

import {config} from "../store";

import {categoriesBySubject} from "../../../../lib/subjects";

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

const category = computed(() => categoriesBySubject.get(props.session.subject)!);

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
</script>

<template>
	<session-item :class="{
				reserved,
				'reserved-by-you': reservedByYou,
			}"
			:style="{
				'--session-col-main': category.color.main,
				'--session-col-dark': category.color.dark,
				'--session-col-accent':  category.color.accent,
			} as any">
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

session-item {
	--session-col-main: hsl(337deg 81% 53%);
	--session-col-dark: hsl(337, 81%, 33%);
	--session-col-accent: hsla(20, 61%, 80%, 0.5);

	background: radial-gradient(at top right, var(--session-col-accent) 4em, #0000 4.125em),
			radial-gradient(circle at bottom right, var(--session-col-dark), var(--session-col-main));
	border-radius: 1.8em .5em / 2em .5em;
	color: #fff;
	padding: 0.5em 1em;

	box-shadow: 0 0.125em 2em -0.5em var(--session-col-main);

	&.reserved-by-you {
		animation: none;

		outline: 4px dashed var(--session-col-main);
		outline-offset: 2px;
	}
}
</style>
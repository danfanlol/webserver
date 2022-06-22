<script lang="ts" setup>
import {computed} from "vue";

const props = defineProps({
	session: {
		type: Object,
		required: true,
	},
});

const reserved = computed(() => Boolean(props.session.student));

const reserveSession = async () => {
	await fetch("/api/signup/", {
		method: "POST",
		body: {
			id: props.session._id,
		},
	});
};
</script>

<template>
	<session-item :class="{
				reserved,
			}"
			@click="() => !reserved && reserveSession()">
		<h3>{{session.subject}}</h3>

		<session-people>
			<div>Offered by <b>{{session.tutor}}</b></div>
			<div v-if="reserved">Reserved</div>
		</session-people>

		<session-time>Starts at <b>{{session.begin}}</b>&#x2002;•&#x2002;Up to <b>{{session.duration * 60}} min</b></session-time>
	</session-item>
</template>

<style lang="scss" scoped>
</style>
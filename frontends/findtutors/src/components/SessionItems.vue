<script setup lang="ts">
import {ref, computed, watch, PropType} from "vue";

const props = defineProps({
	filters: {
		type: Object as PropType<{
			subjects: string[],
		}>,
		required: true,
	},
});

const sessions = ref(await (await fetch("/api/session/")).json());

const sessionQuery = computed(() => {
	if (props.filters.subjects.length === 0) {
		return "";
	}
	return `subject=${props.filters.subjects.join("|")}`;
});

const reloadResults = async () => {
	sessions.value = await (await fetch(`/api/session/?${sessionQuery.value}`)).json();
};

watch(props.filters, reloadResults);
</script>

<template>
	<session-item v-for="session of sessions"
			:class="{
				occupied: Boolean(session.student),
			}">
		<h3>{{session.subject}}</h3>

		<session-people>
			<div>Offered by <b>{{session.tutor}}</b></div>
			<div v-if="session.student">Reserved by <b>{{session.student}}</b></div>
		</session-people>

		<session-time>Starts at <b>{{session.begin}}</b>&#x2002;•&#x2002;Up to <b>{{session.duration * 60}} min</b></session-time>
	</session-item>
</template>
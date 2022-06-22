<script setup lang="ts">
import {ref, computed, watch, PropType} from "vue";

import SessionItem from "./SessionItem.vue";

import {SessionFilters} from "../util";

const props = defineProps({
	filters: {
		type: Object as PropType<SessionFilters>,
		required: true,
	},
});

const sessions = ref(await (await fetch("/api/session/")).json());

const sessionQuery = computed(() => {
	const params = new URLSearchParams();

	if (props.filters.subjects.length !== 0) {
		params.set("subject", props.filters.subjects.join("|"));
	}

	if (props.filters.availability !== null) {
		params.set("open", props.filters.availability ? "1" : "0");
	}

	return params;
});

const reloadResults = async () => {
	sessions.value = await (await fetch(`/api/session/?${sessionQuery.value}`)).json();
};

watch(props.filters, reloadResults);
</script>

<template>
	<SessionItem v-for="session of sessions"
			:key="session._id"
			:session="session" />
</template>

<style lang="scss" scoped>
</style>
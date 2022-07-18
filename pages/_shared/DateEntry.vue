<script lang="ts" setup>
import { computed } from 'vue';

const props = defineProps<{
	modelValue: Date,
}>();
const emit = defineEmits<{
	(event: "update:modelValue", date: Date),
}>();

const date = computed(() => isNaN(props.modelValue.getTime()) ? new Date() : props.modelValue);
if (date.value !== props.modelValue) {
	emit("update:modelValue", date.value);
}

const toLocalIsoTimeString = (date: Date) => `${date.getFullYear()}-${
			(date.getMonth() + 1).toString().padStart(2, "0")}-${
			date.getDate().toString().padStart(2, "0")}T${
			date.getHours().toString().padStart(2, "0")}:${
			date.getMinutes().toString().padStart(2, "0")}`

const localIsoTimeString = computed({
	// Extract YYYY-MM-DDTHH:mm
	get: () => toLocalIsoTimeString(date.value),
	set(value: string) {
		emit("update:modelValue", new Date(Date.parse(value)));
	},
});
</script>

<template>
	<input type="datetime-local"
			v-model="localIsoTimeString"
			:min="toLocalIsoTimeString(new Date())" />
</template>
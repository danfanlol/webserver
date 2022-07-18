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

const localIsoTimeString = computed({
	// Extract YYYY-MM-DDTHH:mm
	get: () => `${date.value.getFullYear()}-${
			(date.value.getMonth() + 1).toString().padStart(2, "0")}-${
			date.value.getDate().toString().padStart(2, "0")}T${
			date.value.getHours().toString().padStart(2, "0")}:${
			date.value.getMinutes().toString().padStart(2, "0")}`,
	set(value: string) {
		emit("update:modelValue", new Date(Date.parse(value)));
	},
});
</script>

<template>
	<input type="datetime-local"
			v-model="localIsoTimeString" />
</template>
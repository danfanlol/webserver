<script lang="ts" setup>
import UserItem from "./UserItem.vue";

const props = defineProps<{
	users: any[],
	listLabel: string,
}>();

const emit = defineEmits<{
	(event: "deleteUser", user: any): void,
}>();
</script>

<template>
	<table>
		<UserItem v-for="user of users"
				:key="user._id"
				:user="user"
				:listLabel="listLabel"
				
				@delete="deletedUser => $emit('deleteUser', deletedUser)" />
	</table>
</template>

<style lang="scss" scoped>
table {
	border-spacing: 0;
}
</style>

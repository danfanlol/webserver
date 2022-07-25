<script lang="ts" setup>
import UserItem from "./UserItem.vue";

const props = defineProps<{
	users: any[],
	listLabel: string,
}>();
</script>

<template>
	<table>
		<UserItem v-for="user of users"
				:key="user._id"
				:user="user"
				:listLabel="listLabel" />
	</table>
</template>
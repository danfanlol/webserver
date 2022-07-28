<script setup lang="ts">
import {ref, computed, watch, PropType} from "vue";

import UserList from "./UserList.vue";

import {useUserFetch} from "../../_shared/useApiFetch";

const props = defineProps();

const {users, hasResults, waiting} = await useUserFetch();

const admins = computed(() => users.value.filter(user => user.isAdmin));
const tutors = computed(() => users.value.filter(user => user.isTutor));
const students = computed(() => users.value.filter(user => !user.isTutor));

const deleteUser = (user: any) => {
	users.value.splice(users.value.indexOf(user), 1);
};
</script>

<template>
	<div class="user-lists"
			:class="{
				waiting,
			}">
		<h3>Admins</h3>
		<UserList :users="admins"
				listLabel="admins"
				@deleteUser="deleteUser" />

		<h3>Tutors</h3>
		<UserList :users="tutors"
				listLabel="tutors"
				@deleteUser="deleteUser" />

		<h3>Students</h3>
		<UserList :users="students"
				listLabel="students"
				@deleteUser="deleteUser" />
	</div>
</template>

<style lang="scss" scoped>
// .user-lists {
// 	display: grid;
// 	grid-template-columns: auto 1fr;
// 	gap: 0 .5em;

// 	> h3 {
// 		grid-column: 1 / -1;
// 	}
// }
</style>

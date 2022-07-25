<script setup lang="ts">
import {ref, computed, watch, PropType} from "vue";

import UserList from "./UserList.vue";

import { useUserFetch } from "../../_shared/useUserFetch";

const props = defineProps();

const {latestPromiseResolved, users, hasResults} = await useUserFetch();

const admins = computed(() => users.value.filter(user => user.isAdmin));
const tutors = computed(() => users.value.filter(user => user.isTutor));
const students = computed(() => users.value.filter(user => !user.isTutor));
</script>

<template>
	<div class="user-lists"
			:class="{
				waiting: !latestPromiseResolved,
			}">
		<h3>Admins</h3>
		<UserList :users="admins"
				listLabel="admins" />

		<h3>Tutors</h3>
		<UserList :users="tutors"
				listLabel="tutors" />

		<h3>Students</h3>
		<UserList :users="students"
				listLabel="students" />
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

.waiting {
	opacity: 0.25;
}
</style>

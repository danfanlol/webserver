<script setup lang="ts">
import {ref, computed, watch, PropType} from "vue";

import UserItem from "./UserItem.vue";

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
		<UserItem v-for="user of admins"
				:key="user._id"
				:user="user" />

		<h3>Tutors</h3>
		<UserItem v-for="user of tutors"
				:key="user._id"
				:user="user" />

		<h3>Students</h3>
		<UserItem v-for="user of students"
				:key="user._id"
				:user="user" />
	</div>
</template>

<style lang="scss" scoped>
.waiting {
	opacity: 0.25;
}
</style>

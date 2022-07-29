<script setup lang="ts">
import {ref, reactive, watch} from "vue";

const props = defineProps<{
	user: any,
	listLabel: string,
}>();

const emit = defineEmits<{
	(event: "delete", user: any): void,
}>();

const waiting = ref(false);

const newPermissions = reactive({
	isTutor: props.user.isTutor,
	isAdmin: props.user.isAdmin,
});

const edited = ref(false);
watch(newPermissions, () => {
	edited.value = props.user.isTutor !== newPermissions.isTutor
			|| props.user.isAdmin !== newPermissions.isAdmin;
});
const endEdit = () => {
	Object.assign(newPermissions, {
		isTutor: props.user.isTutor,
		isAdmin: props.user.isAdmin,
	});
};

watch(props.user, () => {
	if (edited.value) return;
	endEdit();
});

const tryUpdatePermissions = async () => {
	waiting.value = true;
	await Promise.all([
		fetch("/api/manage/", {
			method: "POST",
			body: JSON.stringify({
				operation: newPermissions.isTutor ? "grant" : "revoke",
				permission: "post-session",
				user: props.user.user,
			}),
			headers: {
				"Content-Type": "application/json",
			},
		}),

		fetch("/api/manage/", {
			method: "POST",
			body: JSON.stringify({
				operation: newPermissions.isAdmin ? "grant" : "revoke",
				permission: "admin",
				user: props.user.user,
			}),
			headers: {
				"Content-Type": "application/json",
			},
		}),
	]).finally(() => {
		waiting.value = false;
	});

	Object.assign(props.user, newPermissions);
	edited.value = false;
};

const tryDeleteUser = async () => {
	waiting.value = true;
	await fetch("/api/user/delete", {
		method: "POST",
		body: JSON.stringify({
			userId: props.user._id,
		}),
		headers: {
			"Content-Type": "application/json",
		},
	}).finally(() => {
		waiting.value = false;
	});

	emit("delete", props.user);
};
</script>

<template>
	<tr :class="{
		waiting,
		edited,
	}">
		<td>{{user.user}}</td>
		<td>
			<a :href="`mailto:${user.email}`">{{user.email}}</a>
		</td>

		<td class="permissions">
			<input type="checkbox"
					v-model="newPermissions.isTutor"
					:id="`${user._id}-tutor-${listLabel}`" />
			<label :for="`${user._id}-tutor-${listLabel}`">Tutor</label>

			<input type="checkbox"
					v-model="newPermissions.isAdmin"
					:id="`${user._id}-admin-${listLabel}`" />
			<label :for="`${user._id}-admin-${listLabel}`">Admin</label>

			<template v-if="edited">
				<button @click="tryUpdatePermissions">Save changes</button>&nbsp;
				<button @click="endEdit">Cancel</button>
			</template>
		</td>

		<td>
			<template v-if="!user.isTutor && !user.isAdmin">
				<button @click="tryDeleteUser">Delete user</button>
			</template>
		</td>
	</tr>
</template>

<style lang="scss" scoped>
tr {
	&:nth-child(even) {
		background: var(--col-cyan-1f);
	}

	&.edited {
		background: var(--col-button-yellow-light);
	}
}

td:not(:last-child) {
	padding-right: 1em;
}

.permissions > label + * {
	margin-left: 1em;
}
</style>

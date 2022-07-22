import {ref, computed, watch, unref, ComputedRef} from "vue";

export const useUserFetch = async () => {
	const users = ref<any[]>([]);

	const reloadUsers = async () => {
		const promise = fetch(`/api/users/`)
				.then(response => response.json());
	
		latestPromise.value = promise;
		const newSessions = await promise;
	
		if (promise !== latestPromise.value) return;
		users.value = newSessions;
	};
	
	const latestPromise = ref(Promise.resolve());
	const latestPromiseResolved = ref(true);
	watch(latestPromise, () => {
		latestPromiseResolved.value = false;
	
		const promise = latestPromise.value;
		promise.finally(() => {
			if (promise !== latestPromise.value) return;
			latestPromiseResolved.value = true;
		});
	});

	await reloadUsers();

	const hasResults = computed(() => users.value.length !== 0);

	return {reloadUsers, latestPromise, latestPromiseResolved, users, hasResults};
};
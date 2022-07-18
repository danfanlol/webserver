import {ref, computed, watch, unref, ComputedRef} from "vue";

export const useSessionFetch = async (sessionQuery: ComputedRef<URLSearchParams>) => {
	const sessions = ref<any[]>([]);

	const reloadSessions = async () => {
		const promise = fetch(`/api/session/?${unref(sessionQuery)}`)
				.then(response => response.json());
	
		latestPromise.value = promise;
		const newSessions = await promise;
	
		if (promise !== latestPromise.value) return;
		sessions.value = newSessions;
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

	await reloadSessions();
	watch(sessionQuery, reloadSessions);

	const hasSessions = computed(() => sessions.value.length !== 0);

	return {reloadSessions, latestPromise, latestPromiseResolved, sessions, hasSessions};
};
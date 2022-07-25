import {ref, computed, watch, unref, ComputedRef} from "vue";

/* export const useSessionFetch = async (sessionQuery: ComputedRef<URLSearchParams>) => {
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
};*/

const useApiFetch = async <T=any>(url: string | ComputedRef<string>) => {
	const results = ref<T[]>([]);
	const hasResults = computed(() => results.value.length !== 0);

	let aborter: AbortController;

	const waiting = ref(false);
	const reloadResults = async () => {
		if (waiting.value) {
			aborter?.abort();
		}

		aborter = new AbortController();
		waiting.value = true;
		results.value = await fetch(unref(url), {signal: aborter.signal})
				.then(response => response.json(), () => results.value)
				.finally(() => {
					waiting.value = false;
				});
	};
	await reloadResults();

	return {results, hasResults, reloadResults, waiting};
};

export const useSessionFetch = async (sessionQuery: ComputedRef<URLSearchParams>) => {
	const url = computed(() => `/api/session/?${unref(sessionQuery)}`);

	const {results, hasResults, reloadResults, waiting} = await useApiFetch(url);
	watch(sessionQuery, reloadResults);

	return {
		sessions: results,
		hasResults,
		reloadResults,
		waiting,
	};
};

export const useUserFetch = async () => {
	const {results, hasResults, reloadResults, waiting} = await useApiFetch("/api/users/");

	return {
		users: results,
		hasResults,
		reloadResults,
		waiting,
	};
};
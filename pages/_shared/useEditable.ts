import {ref, reactive, computed} from "vue";

export const useEditable = <T=any>(object: T, getPartial: (object: T) => Partial<T>) => {
	const editing = ref(false);

	const partial = reactive(getPartial(object));

	const workingObject = computed(() => editing.value ? partial : object);
	return {workingObject};
};
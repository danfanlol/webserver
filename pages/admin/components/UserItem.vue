<script setup lang="ts">
import {ref, computed, watch, PropType} from "vue";

const props = defineProps<{
	user: any,
}>();
</script>

<template>
	<div class="user">
		{{user.user}}
		<a :href="`mailto:${user.email}`">{{user.email}}</a>	
	</div>
</template>

<style lang="scss" scoped>
</style>

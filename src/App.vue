<template>
	<div id="app_wrapper">
		<router-view />
	</div>
	<Toast :position="isDesktop ? 'top-right' : 'top-center'" style="opacity: 1" />
</template>

<script>
import { mapGetters } from "vuex"
export default {
	name: "app",
	computed: {
		...mapGetters([
			"isDesktop"
		])
	}
}
</script>

<style>
html, body {
	height: 100%;
	margin: 0;
	font-family: sans-serif;
	-webkit-overflow-scrolling: auto; /* disable the inertial scrolling (mobile) */
}

#app {
	position: absolute;
	top: 0;
	right: 0;
	bottom: 0;
	left: 0
}

#app_wrapper {
	display: flex;
	height: 100%;
	overflow: hidden;
}

.p-dialog-content { /* for PrimeVue component 'Dialog' */
    display: flex;
	flex: 1;
}
</style>

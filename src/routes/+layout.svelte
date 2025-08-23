<script lang="ts">
	import '../app.css';
	import favicon from '$lib/assets/favicon.svg';
	import { navigating } from '$app/stores';
	import { onMount } from 'svelte';

	let { children } = $props();
	let pageElement: HTMLElement;
	let isNavigating = $state(false);

	$effect(() => {
		if ($navigating && !isNavigating) {
			// Start navigation - fade out current page
			isNavigating = true;
			if (pageElement) {
				pageElement.classList.remove('page-transition-ready');
				pageElement.classList.add('page-transition-out');
			}
		} else if (!$navigating && isNavigating) {
			// Navigation complete - wait for fade-out to complete before fading in
			isNavigating = false;
			if (pageElement) {
				// Small delay to let the previous page fully fade out
				setTimeout(() => {
					pageElement?.classList.remove('page-transition-out');
					pageElement?.classList.add('page-transition-in');
					// Fade in the new content
					setTimeout(() => {
						pageElement?.classList.remove('page-transition-in');
						pageElement?.classList.add('page-transition-ready');
					}, 150);
				}, 50);
			}
		}
	});

	onMount(() => {
		// Initial page load animation - remove hidden state and fade in
		if (pageElement) {
			// Immediately start the fade-in
			setTimeout(() => {
				pageElement?.classList.remove('page-transition-in');
				pageElement?.classList.add('page-transition-ready');
			}, 150);
		}
	});
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<!-- Static background that doesn't fade -->
<div class="fixed inset-0 -z-10 bg-gradient-to-br from-gray-900 via-gray-800 to-black">
	<!-- Asphalt texture overlay -->
	<div
		class="absolute inset-0 opacity-10"
		style="background-image: radial-gradient(circle at 1px 1px, rgba(255,255,255,0.3) 1px, transparent 0); background-size: 20px 20px;"
	></div>
	<!-- Lane stripes -->
	<div class="absolute inset-0 opacity-20">
		<div class="absolute top-1/4 right-0 left-0 h-1 -skew-y-1 transform bg-white"></div>
		<div class="absolute top-2/4 right-0 left-0 h-1 skew-y-1 transform bg-white"></div>
		<div class="absolute top-3/4 right-0 left-0 h-1 -skew-y-1 transform bg-white"></div>
	</div>
</div>

<main bind:this={pageElement} class="page-transition page-transition-in">
	{@render children?.()}
</main>

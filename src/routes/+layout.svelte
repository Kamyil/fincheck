<script lang="ts">
	import '../app.css';
	import favicon from '$lib/assets/favicon.svg';

	let { children } = $props();
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

<main class="relative z-10 min-h-screen">
	{@render children?.()}
</main>

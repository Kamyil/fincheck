<script lang="ts">
	import Navbar from '$lib/components/common/Navbar.svelte';

	let { children } = $props();
</script>

<main>
	{@render children()}

	<Navbar />
</main>

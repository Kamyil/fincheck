<script lang="ts">
	import '../app.css';
	import Navbar from '$lib/components/common/Navbar.svelte';

	let { children } = $props();
</script>

<div class="flex justify-center dark:bg-stone-800 dark:text-white">
	{@render children()}
</div>

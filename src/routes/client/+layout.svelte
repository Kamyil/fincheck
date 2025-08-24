<script lang="ts">
	import ClientNavigation from '$lib/components/ClientNavigation.svelte';

	let { data, children } = $props();
</script>

<div class="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
	<ClientNavigation user={data.user} />
	{@render children()}
</div>

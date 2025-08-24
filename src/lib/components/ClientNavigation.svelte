<script lang="ts">
	import { goto } from '$app/navigation';
	import CarIcon from 'lucide-svelte/icons/car';
	import Button from '$lib/components/common/Button.svelte';

	let { user } = $props();

	function handleLogout() {
		goto('/logout');
	}
</script>

<nav class="border-b border-gray-800 bg-gray-900/50 backdrop-blur-sm">
	<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
		<div class="flex h-16 items-center justify-between">
			<div class="flex items-center">
				<a href="/client" class="flex items-center">
					<div class="flex h-10 w-10 items-center justify-center rounded-lg bg-red-600">
						<CarIcon class="h-5 w-5 text-white" />
					</div>
					<span class="ml-3 text-xl font-bold text-white">Pan Samochodzik</span>
				</a>
			</div>
			<div class="flex items-center space-x-4">
				{#if user}
					<span class="text-gray-300">Witaj, {user.username}</span>
				{/if}
				<Button type="button" variant="gray_outline" size="small" onClick={handleLogout}>
					Wyloguj
				</Button>
			</div>
		</div>
	</div>
</nav>

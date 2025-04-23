<script lang="ts">
	import { Car as CarIcon, Menu as MenuIcon } from 'lucide-svelte';
</script>

<nav
	class="fixed bottom-2 flex w-[95vw] items-center justify-around rounded text-center dark:bg-stone-800 dark:text-white"
>
	<div class="flex items-center justify-around gap-x-2">
		<CarIcon class="text-primary" />
		<span>Pan samochodzik</span>
	</div>

	<button>
		<MenuIcon />
	</button>
</nav>

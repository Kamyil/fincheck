<script lang="ts">
	import { i18n } from '$lib/i18n';
	import { ParaglideJS } from '@inlang/paraglide-sveltekit';
	import '../app.css';
	import Navbar from '$lib/components/common/Navbar.svelte';

	let { children } = $props();
</script>

<ParaglideJS {i18n}>
	<div class="flex justify-center dark:bg-stone-800 dark:text-white">
		{@render children()}
	</div>
</ParaglideJS>

<script lang="ts">
	import { twMerge } from 'tailwind-merge';

	interface Props {
		classes?: string;
		children?: import('svelte').Snippet;
	}

	let { classes = '', children }: Props = $props();
</script>

<h1 class={twMerge('text-primary mb-5 font-semibold', classes)}>
	{@render children?.()}
</h1>

<style>
</style>

<script lang="ts">
	import { twMerge } from 'tailwind-merge';

	interface Props {
		classes?: string;
		children?: import('svelte').Snippet;
	}

	let { classes = '', children }: Props = $props();
</script>

<div
	class={twMerge(
		'flex h-72 w-full items-center justify-center text-center text-stone-700 ',
		classes
	)}
>
	<h1>{@render children?.()}</h1>
</div>

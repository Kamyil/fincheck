<script lang="ts">
	import { twMerge } from 'tailwind-merge';

	interface Props {
		classes?: string;
		visibleWhen: boolean;
		children?: import('svelte').Snippet;
	}

	let { classes = '', visibleWhen, children }: Props = $props();
</script>

{#if visibleWhen === true}
	<span class={twMerge('text-red-600 text-sm mt-2', classes)}>
		{@render children?.()}
	</span>
{/if}

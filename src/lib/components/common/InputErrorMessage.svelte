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
	<span class={twMerge('mt-2 text-sm text-red-600', classes)}>
		{@render children?.()}
	</span>
{/if}

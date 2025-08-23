<script lang="ts">
	import { twMerge } from 'tailwind-merge';

	interface Props {
		classes?: string;
		children?: import('svelte').Snippet;
		scrollable?: boolean;
		loading?: Promise<any>;
	}

	let { classes = '', children, scrollable = false, loading }: Props = $props();

	let isLoading = $state(!!loading);

	$effect(() => {
		if (loading) loading.then(() => (isLoading = false));
	});
</script>

<tbody class={twMerge('overflow-x-auto ', classes)} class:overflow-y-auto={scrollable}>
	{#if loading}
		{#await loading then}
			{@render children?.()}
		{/await}
	{:else}
		{@render children?.()}
	{/if}
</tbody>

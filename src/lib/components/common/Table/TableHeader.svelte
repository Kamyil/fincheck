<script lang="ts">
	import { twMerge } from 'tailwind-merge';

	interface Props {
		classes?: string;
		children?: import('svelte').Snippet;
	}

	let { classes = '', children }: Props = $props();
</script>

<thead class={twMerge('border-b-1', classes)}>
	{@render children?.()}
</thead>

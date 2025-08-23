<script lang="ts">
	import { twMerge } from 'tailwind-merge';

	interface Props {
		classes?: string;
		children?: import('svelte').Snippet;
		variant?: keyof typeof variants;
	}

	let { classes = '', children, variant = 'with-shadow' }: Props = $props();

	let variants = {
		'with-shadow': 'shadow-md',
		'with-border': 'border rounded border-stone-100'
	} as const;
</script>

<div class={twMerge('p-5 shadow-md', variants[variant], classes)}>
	{@render children?.()}
</div>

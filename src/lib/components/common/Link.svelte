<script lang="ts">
	import type { Snippet } from 'svelte';
	import { twMerge } from 'tailwind-merge';

	let variants = {
		primary: 'text-primary',
		secondary: 'text-secondary',
		neutral: 'text-zinc-500'
	} as const;

	type Props = {
		href: string;
		variant?: keyof typeof variants;
		classes?: string;
		children?: Snippet;
	};
	let { variant = 'primary', children, href, classes }: Props = $props();
</script>

<a {href} class="{variants[variant]} {twMerge('', classes)}">
	{#if children}
		{@render children()}
	{/if}
</a>

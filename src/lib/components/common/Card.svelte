<script module lang="ts">
	export let variants = {
		default: 'border-gray-700 bg-gray-900/50 shadow-red-600/10',
		dark: 'border-gray-800 bg-gray-950/50 shadow-gray-600/10',
		light: 'border-gray-200 bg-white/50 shadow-gray-600/10'
	} as const;

	export let sizes = {
		small: 'p-4',
		medium: 'p-6',
		large: 'p-8'
	} as const;
</script>

<script lang="ts">
	import type { Snippet } from 'svelte';
	import { twMerge } from 'tailwind-merge';

	type Props = {
		onclick?: () => void;
		variant?: keyof typeof variants;
		size?: keyof typeof sizes;
		classes?: string;
		clickable?: boolean;
		children?: Snippet;
		[key: string]: any;
	};

	let {
		onclick,
		variant = 'default',
		size = 'medium',
		classes = '',
		clickable = false,
		children,
		...rest
	}: Props = $props();
</script>

<div
	class={twMerge(
		'rounded-2xl border shadow-2xl',
		'group',
		variants[variant],
		sizes[size],
		clickable &&
			'cursor-pointer transition-all duration-300 hover:border-red-600/50 hover:bg-gray-800/50 hover:shadow-red-600/20',
		classes
	)}
	{onclick}
	{...rest}
>
	{@render children?.()}
</div>

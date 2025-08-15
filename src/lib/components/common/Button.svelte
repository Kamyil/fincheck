<script lang="ts">
	import { twMerge } from 'tailwind-merge';

	// Variants and sizes can be defined as constants
	const variants = {
		primary: 'bg-primary',
		transparent: 'bg-transparent border-none'
	} as const;

	const sizes = {
		small: 'w-30 h-10 text-xs p-2 hover:shadow-lg',
		small_square: 'w-10 h-10 text-xs p-2 hover:shadow-lg',
		medium: 'w-60 h-14 text-sm p-2 hover:shadow-2xl',
		medium_square: 'w-14 h-14 text-sm p-2 hover:shadow-2xl',
		large: 'w-80 h-20 p-2 hover:shadow-2xl'
	} as const;

	type ButtonType = 'button' | 'submit' | 'reset';

	// Using $props rune
	let {
		type = 'button' as ButtonType,
		variant = 'primary' as keyof typeof variants,
		onClick = (() => {}) as (e: MouseEvent) => void,
		classes = '',
		size = 'small' as keyof typeof sizes,
		id = '',
		formaction
	} = $props();

	// For type safety
	const sizeClass = sizes[size];
	const variantClass = variants[variant];
</script>

<button
	{id}
	{type}
	class={twMerge(
		sizeClass,
		'flex items-center justify-center rounded-lg bg-gradient-to-r transition-all duration-200 active:scale-95',
		variantClass,
		classes
	)}
	onclick={onClick}
	{formaction}
>
	<slot />
</button>

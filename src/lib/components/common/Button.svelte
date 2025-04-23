<script context="module" lang="ts">
	export let variants = {
		primary: 'bg-primary',
		transparent: 'bg-transparent border-none'
	} as const;

	export let sizes = {
		small: 'w-30 h-10 text-xs p-2 hover:shadow-lg',
		small_square: 'w-10 h-10 text-xs p-2 hover:shadow-lg',
		medium: 'w-60 h-14 text-sm p-2 hover:shadow-2xl',
		medium_square: 'w-14 h-14 text-sm p-2 hover:shadow-2xl',
		large: 'w-80 h-20 p-2 hover:shadow-2xl'
	} as const;
</script>

<script lang="ts">
	import { twMerge } from 'tailwind-merge';

	/** HTML button type */
	export let type: HTMLButtonElement['type'] = 'button';

	/** This is the prop of my component */
	export let variant: keyof typeof variants = 'primary';

	/** triggers given function on mouse click */
	export let onClick = () => {};

	/** Standard prop for modyfing component's look using Tailwind classes */
	export let classes = '';

	/** size of the button. By default it's set to small */
	export let size: keyof typeof sizes = 'small';

	/** Standard HTML id */
	export let id = '';
</script>

<button
	{id}
	{type}
	class={twMerge(
		sizes[size],
		'flex items-center justify-center rounded-lg bg-gradient-to-r transition-all duration-200 active:scale-95',
		variants[variant],
		classes
	)}
	on:click={onClick}
	{...$$restProps}
>
	<slot />
</button>

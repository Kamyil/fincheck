<script module lang="ts">
	export let variants = {
		primary:
			'text-white from-primary_lighter to-primary hover:shadow-gray-300 focus-visible:ring-primary',
		dark: 'text-white from-stone-400 to-stone-700 focus-visible:ring-stone-500',
		neutral: 'text-black bg-transparent border-2 border-zinc-300 focus-visible:ring-zinc-400',
		green:
			'text-white from-green-500 to-green-700 hover:shadow-green-600 focus-visible:ring-green-600',
		green_outline:
			'text-green-500 border-1 border-green-500 hover:bg-green-500 hover:text-white focus-visible:ring-green-500',
		red: 'text-white from-red-500 to-red-700 hover:shadow-red-600 focus-visible:ring-red-600',
		red_outline:
			'text-red-500 border-1 border-red-500 hover:bg-red-500 hover:text-white focus-visible:ring-red-500',
		red_secondary:
			'text-red-600 border-2 border-red-600 bg-transparent hover:bg-red-600 hover:text-white focus-visible:ring-red-600',
		orange: 'text-white from-orange-500 to-orange-700 focus-visible:ring-orange-600',
		blue: 'text-white bg-blue-600 hover:bg-blue-700 focus-visible:ring-blue-600',
		purple: 'text-white bg-purple-600 hover:bg-purple-700 focus-visible:ring-purple-600',
		gray_outline:
			'text-gray-300 border border-gray-600 bg-transparent hover:bg-gray-800 hover:text-white focus-visible:ring-gray-600',
		close:
			'text-gray-500 bg-transparent border-none hover:text-gray-700 focus-visible:ring-gray-400',
		transparent:
			'bg-transparent border-none text-primary hover:shadow-none focus-visible:ring-primary'
	} as const;

	export let sizes = {
		tiny: 'w-15 h-7 text-xs p-1',
		tiny_square: 'w-7 h-7 text-xs p-1',
		small: 'w-30 h-10 text-xs p-2',
		small_square: 'w-10 h-10 text-xs p-2',
		medium: 'w-60 h-14 text-sm p-2',
		medium_square: 'w-14 h-14 text-sm p-2',
		large: 'w-80 h-20 p-2',
		icon_small: 'w-8 h-8 p-2 rounded-full',
		icon_medium: 'w-10 h-10 p-2 rounded-full',
		full_width: 'w-full h-12 px-4 py-3'
	} as const;

	const STANDARD_ICON_SIZE = 13;
	const STANDARD_ICON_STROKE_WIDTH = 2;
</script>

<script lang="ts">
	import type { Snippet } from 'svelte';
	import { twMerge } from 'tailwind-merge';
	import { fade } from 'svelte/transition'; // Import fade transition

	type Props = {
		onClick?: () => Promise<any> | void;
		variant?: keyof typeof variants;
		classes?: string;
		size?: keyof typeof sizes;
		id?: string;
		children?: Snippet;
		disabled?: boolean;
		title?: string;
		icon?: ConstructorOfATypedSvelteComponent;
		iconClasses?: string;
		iconPosition?: 'left' | 'right' | 'center';
		buttonInstance?: HTMLButtonElement;
		[key: string]: any;
	};
	let {
		type = 'button',
		variant = 'primary',
		onClick = () => {},
		classes = '',
		size = 'small',
		id,
		children,
		title,
		icon: Icon,
		iconPosition = 'left',
		iconClasses = '',
		buttonInstance = $bindable(),
		disabled,
		...rest
	}: Props = $props();

	let isLoading = $state(false);
	let isDisabled = $derived(disabled || isLoading);

	async function handleClick() {
		if (isDisabled) return;

		let result = onClick();

		if (result instanceof Promise) {
			isLoading = true;
			try {
				await result;
			} catch (error) {
				console.error("Button's async onClick failed:", error);
			} finally {
				setTimeout(() => {
					isLoading = false;
				}, 100);
			}
		}
	}
</script>

<button
	bind:this={buttonInstance}
	{id}
	{type}
	disabled={isDisabled}
	{title}
	class={twMerge(
		'relative overflow-hidden',
		'group flex items-center justify-center rounded-lg bg-gradient-to-r',
		'cursor-pointer transition-all duration-200',
		'active:scale-95 active:brightness-95',
		'hover:scale-[103%] active:scale-95 active:brightness-95',
		'focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none',
		'disabled:cursor-not-allowed',
		// Props-driven classes come first
		sizes[size],
		variants[variant],
		classes,
		// The conditional styles
		isDisabled && !isLoading && 'from-stone-200 to-stone-200 text-stone-400 shadow-none'
	)}
	onclick={handleClick}
	{...rest}
>
	<div
		class="flex items-center justify-center transition-opacity"
		class:invisible={isLoading}
		class:opacity-50={isLoading}
		class:blur-sm={isLoading}
		class:scale-95={isLoading}
	>
		{#if Icon && iconPosition === 'left'}
			<Icon {STANDARD_ICON_STROKE_WIDTH} size={STANDARD_ICON_SIZE} class={twMerge(iconClasses)} />
		{/if}
		<span class="mx-1 group-disabled:opacity-70">
			{#if Icon && iconPosition === 'center'}
				<span>
					<Icon
						{STANDARD_ICON_STROKE_WIDTH}
						size={STANDARD_ICON_SIZE}
						class={twMerge(iconClasses)}
					/>
				</span>
			{/if}
			{@render children?.()}
		</span>
		{#if Icon && iconPosition === 'right'}
			<Icon {STANDARD_ICON_STROKE_WIDTH} size={STANDARD_ICON_SIZE} class={twMerge(iconClasses)} />
		{/if}
	</div>

	{#if isLoading}
		<div
			class="absolute inset-0 flex items-center justify-center bg-black/10"
			transition:fade={{ duration: 100 }}
			aria-label="Loading"
			role="status"
		>
			<svg
				class="h-5 w-5 animate-spin text-current"
				xmlns="http://www.w3.org/2000/svg"
				fill="none"
				viewBox="0 0 24 24"
			>
				<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"
				></circle>
				<path
					class="opacity-75"
					fill="currentColor"
					d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
				></path>
			</svg>
		</div>
	{/if}
</button>

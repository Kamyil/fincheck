<script lang="ts" module>
	export let variants = {
		primary: 'peer-checked:bg-primary',
		primary_without_bg:
			'bg-transparent after:bg-transparent border-1 border-stone-800 after:border-transparent after:bg-gray-600 peer-checked:bg-transparent peer-checked:border-stone-800 peer-checked:after:border-transparent peer-checked:after:bg-primary',
		success: 'peer-checked:bg-green-600'
	} as const;
</script>

<script lang="ts">
	import { createBubbler } from 'svelte/legacy';

	const bubble = createBubbler();
	import { twMerge } from 'tailwind-merge';

	interface Props {
		classes?: string;
		id?: string | undefined;
		/** This is the prop of my component */
		variant?: keyof typeof variants;
		/** Speicifies if toggle should be turned on by default on load or not  */
		checked?: boolean;
		/** Defines if Toggle should be disabled or not */
		disabled?: boolean;
		children?: import('svelte').Snippet;
	}

	let {
		classes = '',
		id = undefined,
		variant = 'primary_without_bg',
		checked = $bindable(false),
		disabled = false,
		children
	}: Props = $props();
</script>

<label class="relative inline-flex cursor-pointer items-center">
	<!--    TODO: change it to bind:value -->
	<input
		type="checkbox"
		class="peer sr-only"
		bind:checked
		{disabled}
		aria-disabled={disabled}
		{id}
		onchange={bubble('change')}
	/>
	<span
		class={twMerge(
			"peer h-8 w-[58px] rounded-full bg-gray-200 peer-focus:ring-4 peer-focus:outline-none after:absolute after:top-[4px] after:left-[4px] after:h-6 after:w-6 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:after:border-white",
			!disabled ? 'peer-checked:after:translate-x-full ' : '',
			variants[variant],
			classes
		)}
	></span>
	<span class="ml-3 text-sm font-medium {disabled ? 'text-gray-300' : 'text-gray-900'}"
		>{@render children?.()}</span
	>
</label>

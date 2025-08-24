<script lang="ts" module>
	export let variants = {
		'with-shadow': 'shadow-md',
		'with-border': 'border-stone-200'
	} as const;
</script>

<script lang="ts">
	import { createBubbler } from 'svelte/legacy';

	const bubble = createBubbler();
	import { twMerge } from 'tailwind-merge';

	interface Props {
		/**
		 * Standard prop for modyfing component's look using Tailwind classes
		 */
		classes?: string;
		/**
		 * Remote form object
		 */
		form?: any;
		/**
		 * If true, marks the input with red outline.
		 * If string, shows both red outline and the string as an error message.
		 */
		error?: boolean | string;
		/** normal HTML input's placeholder  */
		placeholder?: string;
		/** value on init. Can be binded */
		value?: string | number | null | undefined;
		// ^  TODO: Determine value type automatically based on passed input['type']

		/** Optional label that will be attached on top of the input */
		label?: string;
		id?: string | null;
		/** Name of form element. If not set, defaults to value of id */
		name?: string | null;
		autocomplete?: HTMLInputElement['autocomplete'] | undefined;
		/**
		 * When true, it will disable user's ability to type anything into that input
		 * This prop is useful in rare cases like Colorpicker where we want user to select
		 * something via dropdown that is triggered on Input click, but in the same time
		 * user should not be able to type anything into input
		 */
		readonly?: boolean;
		/** text-based type of the input */
		type?:
			| 'email'
			| 'hidden'
			| 'image'
			| 'month'
			| 'number'
			| 'password'
			| 'reset'
			| 'search'
			| 'tel'
			| 'text'
			| 'time'
			| 'url'
			| 'week';
		/** stylistic variant of the input */
		variant?: keyof typeof variants;
		/** minimum amount of value
		 * @default 0
		 */
		min?: number;
		max?: number;
		minlength?: number | undefined;
		maxlength?: number | undefined;
		inputInstance?: HTMLInputElement | null;
		labelInstance?: HTMLLabelElement | null;
		/** Optional hint that will be attached on bottom of the input */
		hint?: string;
		onChange?: () => void;
		required?: boolean;
	}

	let {
		classes = '',
		form = undefined,
		error = false,
		placeholder = '',
		value = $bindable(''),
		label = '',
		id = null,
		name = id,
		autocomplete = undefined,
		readonly = false,
		type = 'text',
		variant = 'with-border',
		min = undefined,
		max = undefined,
		minlength = undefined,
		maxlength = undefined,
		inputInstance = $bindable(),
		labelInstance = $bindable(),
		hint = '',
		required = false,
		onChange = () => {}
	}: Props = $props();

	// Simple and clean error handling
	const errorMessage = $derived(
		// Handle direct error prop (string)
		typeof error === 'string'
			? error
			: // Handle remote form errors (simple object format)
				form?.result?.errors?.[name] || null
	);
	const hasError = $derived(!!errorMessage || error === true);
</script>

{#if label}
	<label
		for={id}
		class="mb-1 mt-2 block text-xs font-medium text-zinc-500"
		bind:this={labelInstance}
	>
		{label}
	</label>
{/if}

<input
	bind:this={inputInstance}
	bind:value
	class={twMerge(
		'md:text-md border-1 relative w-full rounded-md border-transparent p-4 text-gray-900 transition-all duration-150 read-only:cursor-not-allowed read-only:bg-stone-100 sm:text-sm',
		variants[variant],
		classes
	)}
	class:readonly
	class:error={hasError}
	{id}
	{name}
	{autocomplete}
	{readonly}
	{placeholder}
	{required}
	{minlength}
	{maxlength}
	{...{ type }}
	{...min !== undefined ? { min } : {}}
	{...max !== undefined ? { max } : {}}
	onchange={onChange}
	onblur={bubble('blur')}
	oninput={bubble('input')}
	onkeyup={bubble('keyup')}
/>

{#if hint}
	<span class="mb-2 ml-2 mt-1 block text-sm text-green-800">
		{hint}
	</span>
{/if}

{#if errorMessage}
	<span class="mb-2 ml-2 mt-1 block text-sm text-red-600">
		{errorMessage}
	</span>
{/if}

<style lang="postcss">
	@reference "tailwindcss";

	/*  BUG: Disable arrows on input number on Firefox */
	input[type='number'].disabled,
	input[type='number'].readonly {
		outline: transparent;
		-moz-appearance: textfield;
	}

	.error {
		@apply border-red-600;
	}
</style>

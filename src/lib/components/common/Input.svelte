<script lang="ts" module>
	export let variants = {
		'with-shadow': 'shadow-md',
		'with-border': 'border-stone-200'
	} as const;
</script>

<script lang="ts">
	import { twMerge } from 'tailwind-merge';

	type Props = {
		/**
		 * Standard prop for modyfing component's look using Tailwind classes
		 */
		classes?: string;

		/**
		 * if true, then marks whole input (and potentially label) with red color.
		 */
		error?: boolean;

		/** normal HTML input's placeholder  */
		placeholder?: string;

		/** value on init. Can be binded */
		value?: string | null | undefined;

		/** Optional label that will be attached on top of the input */
		label?: string | undefined;

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

		inputInstance?: HTMLInputElement | null;
		labelInstance?: HTMLLabelElement | null;

		/** Optional hint that will be attached on bottom of the input */
		hint?: string;

		onchange?: HTMLInputElement['onchange'];
		oninput?: HTMLInputElement['oninput'];
		onkeyup?: HTMLInputElement['onkeyup'];
	};
	let {
		classes = '',
		error = false,
		placeholder = '',
		value = '',
		label = '',
		id = null,
		name = id,
		autocomplete = undefined,
		readonly = false,
		type = 'text',
		variant = 'with-border',
		inputInstance = null,
		labelInstance = null,
		hint = '',
		onchange,
		onblur,
		oninput,
		onkeyup
	}: Props = $props();
</script>

{#if label}
	<label
		for={id}
		class="mb-1 ml-2 mt-2 block text-sm font-medium text-zinc-500"
		bind:this={labelInstance}
	>
		{label}
	</label>
{/if}

<input
	bind:this={inputInstance}
	bind:value
	class={twMerge(
		'md:text-md border-1 relative w-full rounded-md border-transparent p-4 text-gray-900 transition-all duration-150 sm:text-sm',
		variants[variant],
		classes
	)}
	class:error
	{id}
	{name}
	{autocomplete}
	{readonly}
	{placeholder}
	{...{ type }}
	{onchange}
	{onblur}
	{oninput}
	{onkeyup}
/>

{#if hint}
	<span class="mb-2 ml-2 mt-1 block text-sm text-green-800">
		{hint}
	</span>
{/if}

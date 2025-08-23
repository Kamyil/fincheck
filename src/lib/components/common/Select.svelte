<!--
  @component Select
    This component is a handy abstraction over "svelte-select" library
    {@link https://svelte-select-examples.vercel.app/examples/props/input-attributes}
    that simplifies and streamlines it's usage to make it easier for us
-->
<script lang="ts">
	import { run } from 'svelte/legacy';

	import Arrow from '$lib/components/common/Arrow.svelte';
	import type { SvelteComponent } from 'svelte';
	import { twMerge } from 'tailwind-merge';
	import Select from 'svelte-select';

	type ValueType = string | number | boolean | null;

	type SelectOption = {
		/** @required - Displays a value but with a proper format to see for user */
		label: string;
		/** @required - Proper raw value to be submittable via form */
		value: string | number | boolean;
		/** @optional */
		group?: string;
		/** @optional */
		selectable?: boolean;
		/** @optional - allows to apply html classes to both option and this element when selected */
		classes?: string;
	};

	interface Props {
		/**
		 * In normal HTML & Svelte fashion - it behaves the same way you would expect from it.
		 * You can pass the value, which will be reflected properly when submitting the form.
		 * You can also bind the value using Svelte's normal `bind:value` syntax to reactively update the variable when user selects something.
		 * However, when you look at the source code of this component, you will see that this value is not being binded to `bind:value`, but rather
		 * `bind:justValue`. It's caused by weird "svelte-select" behavior. Since this component forces you to pass array of objects containing labels and values,
		 * this library then binds the `bind:value` to the objects rather than values themselves. `bind:justValue` fixes that, so this component gives you more normal
		 * way to interact with this select, where selecting an item binds the ACTUAL value rather than object to the form
		 *
		 * @see https://svelte-select-examples.vercel.app/examples/props/just-value
		 * @see https://svelte-select-examples.vercel.app/examples/props/value
		 */
		value?: ValueType | undefined;
		justValue?: any | undefined;
		options?: SelectOption[];
		id?: string | undefined;
		/** Defines normal name's attribute for select. By default it's set to "id" */
		name?: string | undefined;
		/** Displays little chevron (arrow) indicating that this select is expandable */
		showChevron?: boolean;
		/** Customizes default chevron (arrow) icon. Pass the icon that goes into down direction, since on list open it will be rotated to up direction */
		chevronIcon?: SvelteComponent | string | undefined;
		clearable?: boolean;
		disabled?: boolean;
		/** When turned on, allows user to search items in search input inside the select */
		searchable?: boolean;
		width?: string;
		height?: string;
		maxWidth?: string;
		placeholder?: string;
		hasError?: boolean | undefined;
		closeListOnChange?: boolean;
		/** Standard prop for modyfing component's look using Tailwind classes */
		classes?: string;
		/** Optional hint that will be attached on bottom of the input */
		hint?: string;
		onChange?: () => void;
		activeOptionColor?: string | undefined;
	}

	let {
		value = $bindable(undefined),
		justValue = $bindable(undefined),
		options = [],
		id = undefined,
		name = id,
		showChevron = true,
		chevronIcon = undefined,
		clearable = false,
		disabled = false,
		searchable = true,
		width = '100%',
		height = '54px',
		maxWidth = '100%',
		placeholder = 'Wybierz',
		hasError = false,
		closeListOnChange = true,
		classes = '',
		hint = '',
		onChange = () => {},
		activeOptionColor = undefined
	}: Props = $props();

	let selectValue = $state(options.find((v) => v.value == value) ?? (null as SelectOption | null));

	function updateValue(value: SelectOption | null) {
		selectValue = value;
	}

	function handleSelectChange() {
		value = selectValue?.value;
	}

	let isListOpen: boolean = $state(false);

	/**
	 * Warning! Don't add whitespaces and comments between slots :)
	 * @see https://github.com/sveltejs/svelte/issues/4546
	 */
	$effect(() => {
		updateValue(options.find((v) => v.value == value) ?? null);
	});
</script>

<Select
	bind:value={selectValue}
	bind:justValue
	on:change={() => {
		handleSelectChange();
		onChange();
	}}
	on:clear={() => {
		value = undefined;
		onChange();
	}}
	{id}
	items={options}
	{clearable}
	{searchable}
	{name}
	{disabled}
	{placeholder}
	{hasError}
	{closeListOnChange}
	{showChevron}
	class={twMerge(classes)}
	bind:listOpen={isListOpen}
	--width={width}
	--height={height}
	--selectedItemBackground="var(--primary-color)"
	--disabledBackground="rgb(120, 113, 108);"
	--item-is-active-bg={activeOptionColor ?? 'var(--primary-color)'}
	--font-size="13px"
	--borderRadius="2px"
	--maxWidth={maxWidth}
	--chevron-background="transparent"
	--item-active-background="transparent"
	--internal-padding="0"
>
	<div slot="chevron-icon">
		{#if chevronIcon}
			<span style="rotate: {isListOpen ? 0 : 180}deg;">
				{chevronIcon}
			</span>
		{:else}
			<Arrow direction={isListOpen ? 'up' : 'down'} classes="w-4 h-4" />
		{/if}
	</div>

	<svelte:fragment slot="input-hidden" let:value>
		<input type="hidden" {name} value={value?.value ?? null} />
	</svelte:fragment>

	<div slot="selection" let:selection class={twMerge(selection?.classes)}>
		{#if selection?.label}
			{selection?.label}
		{:else if selection}
			{selection}
		{:else}
			{placeholder}
		{/if}
	</div>

	<div slot="item" let:item let:index class={twMerge(item?.classes)}>
		{item.label}
	</div>
</Select>

{#if hint}
	<span class="mt-1 mb-2 ml-2 block text-sm text-green-800">
		{hint}
	</span>
{/if}

<style>
	:global(.svelte-select) {
		max-width: var(--maxWidth);
	}

	:global(.value-container input) {
		min-width: 100px;
	}
</style>

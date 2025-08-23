<!--
  @component Checkbox

  Handy and styled abstraction over default input[type="checkbox"] element
-->
<script lang="ts">
	import { twMerge } from 'tailwind-merge';

	let sizes = {
		small: 'size-4',
		standard: 'size-7'
	} as const;

	interface Props {
		/**
		 * input's id attribute
		 * @default id
		 */
		id: string;
		/**
		 * input's name attribute
		 * @default id
		 */
		name?: string;
		/** @default false */
		value?: boolean;
		/** @default false */
		disabled?: boolean;
		/** @default 'standard' */
		size?: keyof typeof sizes;
		classes?: string;
		hasError?: boolean;
		onChange: (prevValue: boolean, nextValue: boolean) => void;
	}
	let {
		id,
		name = id,
		value = $bindable(),
		size = 'standard',
		disabled = false,
		classes = '',
		hasError = false,
		onChange = () => {}
	}: Props = $props();
</script>

<input
	{id}
	{name}
	{disabled}
	type="checkbox"
	bind:checked={value}
	class={twMerge(
		`hover:checked:border-checkbox_checked hover:checked:bg-checkborder-checkbox_checked focus:ring-checkborder-checkbox_checked checked:border-checkbox_checked focus:checked:bg-checkbox_checked checked:bg-checkbox_checked ring-checkbox_checked checked:hover:bg-checkbox_checked
 checked:ring-checkbox_checked relative float-left
appearance-none rounded border-[0.1rem] border-solid
 border-stone-300 outline-none hover:cursor-pointer focus:shadow-none focus:transition-[border-color_0.2s]
 disabled:cursor-not-allowed disabled:bg-stone-100 disabled:peer-checked:border-slate-700 checked:disabled:border-stone-400 checked:disabled:bg-stone-200
 `,
		sizes[size],
		hasError
			? 'border-4 border-red-600 checked:border-red-600 hover:border-red-600 hover:checked:border-red-600 disabled:border-red-600 checked:disabled:border-red-600'
			: '',
		classes
	)}
	oninput={(event) => {
		let prevValue = value;
		let nextValue = !value;

		value = !value;
		onChange(prevValue, nextValue);
	}}
	class:error={hasError}
/>

<script lang="ts">
	import { twMerge } from 'tailwind-merge';
	import { type Snippet } from 'svelte';

	interface Props {
		classes?: string;
		/** When true, it will mark text with red color */
		error?: boolean;
		/** When true, it will have darker background */
		striped?: boolean;
		/** When true, each table row will be separated with a dark border at the bottom  */
		bordered?: boolean;
		children?: Snippet;
		index?: number;
	}

	let { classes = '', error = false, striped = true, bordered = false, children }: Props = $props();
</script>

<tr
	class={twMerge('border-b border-gray-700 p-2 text-gray-100 transition-all duration-150', classes)}
	class:error
	class:even:bg-gray-100={striped}
	class:bordered
>
	{@render children?.()}
</tr>

<style lang="postcss">
	@reference "tailwindcss";

	.error {
		@apply bg-red-50 text-red-800 even:bg-red-50;
	}
</style>

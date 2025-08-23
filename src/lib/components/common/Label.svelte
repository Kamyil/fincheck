<script lang="ts">
	import { twMerge } from 'tailwind-merge';

	interface Props {
		/** Standard prop for modifying the appearance of the component using Tailwind classes */
		classes?: string;
		/** Default label's for attribute (renamed since for is a reserved JS keyword) */
		htmlFor?: string;
		children?: import('svelte').Snippet;
	}

	let { classes = '', htmlFor = '', children }: Props = $props();
</script>

<label
	for={htmlFor}
	class={twMerge('mt-2 mb-1 ml-2 block text-sm font-medium text-zinc-500', classes)}
>
	{@render children?.()}
</label>

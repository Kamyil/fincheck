<script lang="ts" module>
	export let variants = {
		info: 'text-blue-800 bg-blue-50 ',
		success: 'text-sm rounded-lg text-green-800 bg-green-50 ',
		warning: 'text-yellow-800 bg-yellow-50 ',
		danger: 'text-red-800 bg-red-50 ',
		neutral: 'text-gray-800 bg-gray-50 ',
	} as const;
</script>

<script lang="ts">
	

	interface Props {
		/**
	 * Standard prop for modyfing component's look using Tailwind classes
	 */
		classes?: string;
		variant: keyof typeof variants;
		children?: import('svelte').Snippet;
	}

	let { classes = '', variant, children }: Props = $props();
</script>

<div class="p-4 mb-4 text-sm rounded-lg {variants[variant]} {classes}" role="alert">
	{@render children?.()}
</div>

<!--
@component ButtonGroup
Stylistic component only.
Applies proper `border: none;`s to proper buttons within the group
-->
<script lang="ts">
	import { twMerge } from 'tailwind-merge';
	interface Props {
		children?: import('svelte').Snippet;
	}

	let { children }: Props = $props();
</script>

<div
	class={twMerge(
		'BUTTON_GROUP flex [&>*:first-child]:rounded-r-none  [&>*:last-child]:rounded-l-none'
	)}
>
	{@render children?.()}
</div>

<!-- TODO: In future, remove style tag and implement children targeted styles using this plugin when it will be stable -->
<!-- https://www.npmjs.com/package/tailwind-children -->
<style lang="postcss">
	@reference "tailwindcss";

	/* Target all buttons except the first and last, and remove border-radius */
	:global(.BUTTON_GROUP > *:not(:first-child):not(:last-child)) {
		@apply rounded-none;
		border-left: none;
		border-right: none;
	}
</style>

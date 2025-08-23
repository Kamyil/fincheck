<script lang="ts">
	import { preventDefault } from 'svelte/legacy';

	interface Props {
		text: string;
		length: number;
	}

	let { text, length }: Props = $props();

	let expanded: boolean = $state(false);

	let lengthToCut = $derived(Math.min(length, text.length));
	let showPart = $derived(expanded ? text : text.substring(0, lengthToCut));
	let restPart = $derived(text.substring(lengthToCut + 1));
</script>

{showPart}

{#if !expanded && restPart}
	...
{/if}

{#if restPart}
	<br />
	<button
		class="cursor-pointer underline"
		onclick={preventDefault((e) => {
			// Stop the main link
			e.stopPropagation();

			expanded = !expanded;
		})}
	>
		{expanded ? 'zwiń' : 'rozwiń'}
	</button>
{/if}

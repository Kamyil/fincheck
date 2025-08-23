<script lang="ts">
	import { type ColorName, COLORS, getColorObject } from '$lib/colors';
	import Dropdown from '$lib/components/common/Dropdown.svelte';
	import { createEventDispatcher } from 'svelte';

	interface Props {
		targetElement: HTMLElement;
	}

	let { targetElement }: Props = $props();
	// export let selectedColor: ColorName;

	const dispatch = createEventDispatcher<{
		/** event name */
		colorpick: {
			/** event data that subscriber will receive under `event.detail.colorName` property */
			colorName: ColorName;
		};
	}>();
</script>

{#if targetElement}
	<Dropdown {targetElement} classes="grid gap-4 grid-cols-6">
		{#each Object.keys(COLORS) as colorKey}
			{@const color = getColorObject(colorKey)}

			<button
				type="button"
				class="
					h-14 w-14
					{color.BORDER} {color.BACKGROUND}
					rounded-md border-1
					border-transparent transition-all duration-150
					hover:scale-105 active:scale-95
      	"
				onclick={() => {
					dispatch('colorpick', {
						colorName: colorKey
					});
				}}
			>
			</button>
		{/each}
	</Dropdown>
{/if}

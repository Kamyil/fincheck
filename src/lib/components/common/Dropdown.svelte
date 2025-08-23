<script lang="ts">
	import { onMount } from 'svelte';
	import { slide } from 'svelte/transition';

	const TRANSITION_DURATION = 150;
	let element: HTMLElement = $state();

	interface Props {
		classes?: string;
		targetElement: HTMLElement | null;
		visible?: boolean;
		children?: import('svelte').Snippet;
	}

	let { classes = '', targetElement, visible = $bindable(false), children }: Props = $props();

	function handleClickOutside(
		event: globalThis.MouseEvent & {
			currentTarget: EventTarget & Window;
		}
	) {
		if (element && !element.contains(event.target as Node)) {
			visible = false;
		}
	}

	onMount(() => {
		targetElement?.addEventListener('click', () => {
			visible = !visible;
		});
	});
</script>

{#if visible}
	<div
		bind:this={element}
		transition:slide={{ duration: TRANSITION_DURATION }}
		class="absolute z-10 mt-1 rounded-md bg-white p-5 shadow-xl transition-all duration-150 {classes}"
	>
		{@render children?.()}
	</div>
{/if}
<svelte:window
	onmousedown={(event) => {
		handleClickOutside(event);
	}}
/>

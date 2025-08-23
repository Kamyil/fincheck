<script lang="ts">
	import { twMerge } from 'tailwind-merge';

	interface Props {
		classes?: string;
		direction?: keyof typeof rotationClasses;
		shape?: 'chevron' | 'triangle';
	}

	let { classes = '', direction = 'down', shape = 'chevron' }: Props = $props();

	let rotationClasses = {
		up: 'rotate-0',
		'up-right': 'rotate-45',
		right: 'rotate-90',
		down: 'rotate-180',
		left: '-rotate-90'
	};
</script>

{#if shape === 'chevron'}
	<svg
		class={twMerge('transition ease-in-out', classes, rotationClasses[direction])}
		xmlns="http://www.w3.org/2000/svg"
		width="1em"
		height="1em"
		viewBox="0 0 24 24"><path d="M7.41 15.41L12 10.83l4.59 4.58L18 14l-6-6l-6 6z" /></svg
	>
{:else if shape === 'triangle'}
	<svg
		class={twMerge('transition ease-in-out', classes, rotationClasses[direction])}
		xmlns="http://www.w3.org/2000/svg"
		width="1em"
		height="1em"
		viewBox="0 0 256 256"
		><path
			d="M236.78 211.81A24.34 24.34 0 0 1 215.45 224H40.55a24.34 24.34 0 0 1-21.33-12.19a23.51 23.51 0 0 1 0-23.72l87.43-151.87a24.76 24.76 0 0 1 42.7 0l87.45 151.87a23.51 23.51 0 0 1-.02 23.72"
		/></svg
	>
{/if}

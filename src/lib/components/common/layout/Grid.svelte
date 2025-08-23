<!-- @component Grid
1st part of handy abstraction over CSS Grid.
Allows to create grid layouts with the same familiar 12-column system as Bootstrap, which covers most of the layouts
This component mainly is a parent with `display: grid;` applied, allowing you to pass <Column> components inside
You can also specify the gap between columns via `gap` prop
-->
<script lang="ts">
	import { twMerge } from 'tailwind-merge';

	interface Props {
		gap?: keyof typeof gapClasses;
		classes?: string;
		children?: import('svelte').Snippet;
	}

	let { gap = '6', classes = '', children }: Props = $props();

	const gapClasses = {
		'1': 'gap-1',
		'2': 'gap-2',
		'3': 'gap-3',
		'4': 'gap-4',
		'5': 'gap-5',
		'6': 'gap-6',
		'7': 'gap-7',
		'8': 'gap-8',
		'9': 'gap-9',
		'10': 'gap-10',
		'11': 'gap-11',
		'12': 'gap-12',
		'14': 'gap-14',
		'16': 'gap-16',
		'20': 'gap-20',
		'24': 'gap-24',
		'28': 'gap-28',
		'32': 'gap-32',
		'36': 'gap-36',
		'40': 'gap-40'
	};
</script>

<div class={twMerge('grid grid-cols-12', gapClasses[gap], classes)}>
	{@render children?.()}
</div>

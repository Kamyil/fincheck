<!-- @migration-task Error while migrating Svelte code: This migration would change the name of a slot making the component unusable -->
<!-- @migration-task Error while migrating Svelte code: This migration would change the name of a slot making the component unusable -->
<!-- @component WithTooltip
    @deprecated Use {@attach tooltip({ message: '' })} directly on elements/components instead
    Extends given content with ability to have an extra tooltip
    It's a weird way to apply a tooltip, but so far I didn't found a working way of applying a tooltip
    So this component should be used like this

```svelte
<WithTooltip>
    <div slot="trigger">
        Element with a "trigger" slot will show the tooltip when hovering over this element with mouse
    </div>

    <div slot="content">
        Tooltip content to show
    <div>
</WithTooltip>
```
    TODO: Find a way to make simple `<Tooltip targetElementId="some-id"></Tooltip>` working
-->
<script lang="ts">
	import { createTooltip, melt } from '@melt-ui/svelte';
	import type { FloatingConfig } from '@melt-ui/svelte/internal/actions/floating';
	import { fade } from 'svelte/transition';

	export let placement: NonNullable<FloatingConfig>['placement'] = 'top';
	export let group: string | boolean | undefined = undefined;

	let {
		elements: { trigger, content, arrow },
		states: { open }
	} = createTooltip({
		forceVisible: true,
		openDelay: 0,
		closeDelay: 0,
		closeOnPointerDown: false,
		positioning: {
			placement: placement
		},
		group
	});
</script>

<span use:melt={$trigger}>
	<slot name="trigger" />
</span>

{#if $open}
	<span
		use:melt={$content}
		transition:fade={{ duration: 100 }}
		class="z-50 rounded-lg bg-white p-6 shadow-2xl"
	>
		<div use:melt={$arrow} />
		<slot name="content" />
	</span>
{/if}

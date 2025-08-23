<script lang="ts">
	import shallowRoute from '$lib/utilities/shallowRouteAction';
	import { twMerge } from 'tailwind-merge';

	interface Props {
		asLink?: boolean | undefined;
		href: string | undefined;
		shallowRouteCallback: (data?: Record<string, any>) => (void | App.PageState) | undefined;
		classes?: string;
		children?: import('svelte').Snippet;
	}

	let { asLink = true, href, shallowRouteCallback, classes = '', children }: Props = $props();
</script>

{#if asLink && href}
	{#if shallowRouteCallback}
		<a class={twMerge('block', classes)} {href} use:shallowRoute={shallowRouteCallback}>
			{@render children?.()}
		</a>
	{:else}
		<a class={twMerge('block', classes)} {href}>
			{@render children?.()}
		</a>
	{/if}
{:else}
	<div class={classes}>
		{@render children?.()}
	</div>
{/if}

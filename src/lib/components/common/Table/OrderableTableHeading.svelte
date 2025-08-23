<!--
    @component OrderableTableHeading
    This component stylistically is the exact same copy of the TableHeader component.
    However this component is enhanced with ordering capabilities, allowing you to simply
    connect order properties that will allow user to sort/order data by clicking on this version of TableHeader
    The only thing you need to do is to pass a column name inside the column prop and this component will
    automatically handle adding and toggling order URL params by itself when clicking on it
-->
<script lang="ts">
	import { twMerge } from 'tailwind-merge';
	import { SortOrder } from '$lib/api';
	import { getOrderParametersFor, toggleOrder } from '$lib/utilities/order';
	import Arrow from '$lib/components/common/Arrow.svelte';
	import { page } from '$app/state';

	interface Props {
		classes?: string;
		columnName: string;
		children?: import('svelte').Snippet;
	}

	let { classes = '', columnName, children }: Props = $props();

	let order = $derived(getOrderParametersFor(columnName, page.url));

	function orderData() {
		toggleOrder(columnName, page.url);
	}

	const arrowClasses = 'w-2 mr-2 fill-primary';
</script>

<th
	scope="col"
	class={twMerge('px-6 py-3', classes)}
	class:cursor-pointer={Object.keys(order).length > 0}
	onclick={orderData}
>
	<div class="flex justify-center underline">
		{#if order.active}
			{#if order.direction === SortOrder.ASC}
				<Arrow shape="triangle" direction="up" classes={arrowClasses} />
			{:else if order.direction === SortOrder.DESC}
				<Arrow shape="triangle" direction="down" classes={arrowClasses} />
			{/if}
		{/if}

		{@render children?.()}
	</div>
</th>

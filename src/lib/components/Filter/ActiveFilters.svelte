<script lang="ts">
	import Button from '$lib/components/common/Button.svelte';
	import XIcon from 'lucide-svelte/icons/x';
	import { twMerge } from 'tailwind-merge';
	import type { FilterDefinitions, Filters } from '$lib/utilities/filters';

	interface Props {
		/**
		 * Additional css classes for the component wrapper
		 */
		classes?: string;

		/**
		 * Object containing all filter definitions and their current values
		 */
		filters: Filters<FilterDefinitions<any>> | undefined;

		/**
		 * Keys that should not be displayed as active filters (e.g. 'search')
		 */
		excludeKeys?: string[];

		/**
		 * Callback triggered when a filter is removed - provides filter key and optional value
		 */
		onRemoveFilter: (key: string, value?: string | null) => void;

		/**
		 * Callback triggered when all filters are cleared
		 */
		onRemoveAllFilters: () => void;
	}

	let {
		classes = '',
		filters = {},
		excludeKeys = ['search'],
		onRemoveFilter = () => {},
		onRemoveAllFilters = () => {}
	}: Props = $props();

	function handleRemoveFilter(key: string, value: string | null = null) {
		onRemoveFilter(key, value);
	}

	function handleRemoveAllFilters() {
		onRemoveAllFilters();
	}

	let hasActiveFilters = $state(false);

	$effect(() => {
		hasActiveFilters = Object.entries(filters).some(
			([key, filter]) => !excludeKeys.includes(key) && filter.value !== null && filter.value !== ''
		);
	});

	function splitFilterValue(filter: FilterDefinitions<any>, value: string) {
		// if filter has a separator property (e.g. ','), split the value by this separator
		if (filter.separator && typeof value === 'string') {
			return value.split(filter.separator);
		}
		// for filters without separator, return a single-item array
		return [value];
	}
</script>

<div class={twMerge(classes, 'flex flex-wrap gap-2')}>
	{#each Object.entries(filters) as [key, filter]}
		{#if filter.value && !excludeKeys.includes(key)}
			{#if filter.separator}
				{#each splitFilterValue(filter, filter.value) as splitValue}
					<!-- render multiple filter tags for separator-based filters (e.g. multi-select values) -->
					<div
						class="flex h-8 w-fit cursor-pointer items-center gap-2 rounded-lg border border-primary p-2 text-xs font-normal text-primary transition-all active:scale-95"
					>
						<span>{filter.label}:</span>
						<span>{splitValue}</span>
						<Button
							classes="text-primary"
							variant="transparent"
							size="tiny_square"
							type="button"
							title="Usuń filtr"
							icon={XIcon}
							iconPosition="center"
							onclick={() => handleRemoveFilter(key, splitValue)}
						/>
					</div>
				{/each}
			{:else}
				<!-- render single filter tag for regular filters -->
				<div
					class="flex h-8 w-fit cursor-pointer items-center gap-2 rounded-lg border border-primary p-2 text-xs font-normal text-primary transition-all active:scale-95"
				>
					<span>{filter.label}:</span>
					{#if key === 'start_date' || key === 'end_date'}
						<span>{new Date(filter.value).toLocaleDateString('pl-PL')}</span>
					{:else}
						<span>{filter.value}</span>
					{/if}
					<Button
						classes="text-primary"
						variant="transparent"
						size="tiny_square"
						type="button"
						title="Usuń filtr"
						icon={X}
						iconPosition="center"
						onclick={() => handleRemoveFilter(key)}
					/>
				</div>
			{/if}
		{/if}
	{/each}

	{#if hasActiveFilters}
		<Button
			classes="w-fit h-8"
			variant="primary"
			size="tiny"
			icon={X}
			iconPosition="right"
			onclick={handleRemoveAllFilters}
		>
			Usuń wszystkie filtry
		</Button>
	{/if}
</div>

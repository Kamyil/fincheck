<script lang="ts">
	import { run } from 'svelte/legacy';

	import { type Writable, writable } from 'svelte/store';
	import { melt, createDatePicker } from '@melt-ui/svelte';
	import { fly } from 'svelte/transition';
	import Arrow from './Arrow.svelte';
	import type { DateValue } from '@internationalized/date';
	import { twMerge } from 'tailwind-merge';
	import { CalendarDate, GregorianCalendar } from '@internationalized/date';
	import { getMonth, getYear, getDate } from 'date-fns';
	import CalendarIcon from '$lib/components/common/icons/CalendarIcon.svelte';

	const valueStore: Writable<DateValue | undefined> = writable(currentValueObject());

	interface Props {
		id?: string;
		name?: any;
		value: string | null | undefined;
		classes?: string;
		datepickerClasses?: string;
		/**
		 * if true, then marks whole input (and potentially label) with red color.
		 */
		error?: boolean;
		onChange?: ({
			previous,
			next
		}: {
			previous: DateValue | undefined;
			next: DateValue | undefined;
		}) => void;
	}

	let {
		id = '',
		name = id,
		value = $bindable(),
		classes = '',
		datepickerClasses = '',
		error = false,
		onChange = () => {}
	}: Props = $props();

	function currentValueObject() {
		if (!value) {
			return undefined;
		}

		const date = new Date(value);

		return new CalendarDate(
			new GregorianCalendar(),
			getYear(date),
			getMonth(date) + 1,
			getDate(date)
		);
	}

	const {
		elements: {
			calendar,
			heading,
			grid,
			cell,
			prevButton,
			nextButton,
			trigger,
			content,
			segment,
			field
		},
		states: { months, headingValue, weekdays, open, value: meltUiValue, segmentContents },
		helpers: { isDateDisabled, isDateUnavailable }
	} = createDatePicker({
		hourCycle: 24,
		onValueChange: ({ curr, next }) => {
			onChange({ previous: curr, next: next });

			value = next?.toString();

			// needed by Melt-UI in order to not break binding value with input
			return next;
		},
		forceVisible: true,
		value: valueStore,
		// defaultValue: $valueStore,
		locale: 'pl',
		weekdayFormat: 'short',
		closeOnEscape: true,
		preventDeselect: false
	});
	run(() => {
		(value, ($valueStore = currentValueObject()));
	});
</script>

<div class="relative flex items-center" use:melt={$field}>
	<input
		{id}
		{name}
		type="hidden"
		bind:value={$valueStore}
		onchange={(e) => (value = e.currentTarget.value)}
	/>

	<div
		class={twMerge('rounded-md p-2 text-gray-900 transition-all duration-150 ', classes)}
		class:error
	>
		{#each $segmentContents as seg}
			<div use:melt={$segment(seg.part)}>
				{seg.value}
			</div>
		{/each}
	</div>

	<button type="button" class="h-fill absolute right-1 w-6" use:melt={$trigger}>
		<CalendarIcon classes="text-[1rem]" />
	</button>
</div>

{#if $open}
	<div
		transition:fly={{ y: -30, duration: 200 }}
		use:melt={$content}
		class={twMerge('z-[60]', datepickerClasses)}
	>
		<div use:melt={$calendar}>
			<header>
				<button use:melt={$prevButton}>
					<Arrow direction="left" />
				</button>
				<div use:melt={$heading}>
					{$headingValue}
				</div>
				<button use:melt={$nextButton}>
					<Arrow direction="right" />
				</button>
			</header>
			<div>
				{#each $months as month}
					<table use:melt={$grid}>
						<thead aria-hidden="true">
							<tr>
								{#each $weekdays as day}
									<th>
										<div>
											{day}
										</div>
									</th>
								{/each}
							</tr>
						</thead>
						<tbody>
							{#each month.weeks as weekDates}
								<tr>
									{#each weekDates as date}
										<td
											role="gridcell"
											aria-disabled={$isDateDisabled(date) || $isDateUnavailable(date)}
										>
											<div use:melt={$cell(date, month.value)}>
												{date.day}
											</div>
										</td>
									{/each}
								</tr>
							{/each}
						</tbody>
					</table>
				{/each}
			</div>
		</div>
	</div>
{/if}

<style lang="postcss">
	@reference "tailwindcss";

	.error {
		@apply border-red-600;
	}

	[data-melt-datefield-field] div:last-of-type {
		@apply flex w-full items-center;
	}

	[data-melt-popover-content] {
		@apply min-w-[320px] rounded-lg bg-white shadow-sm;
	}

	[data-melt-datefield-label] {
		@apply font-medium text-stone-800 select-none;
	}

	[data-melt-datefield-label][data-invalid] {
		@apply text-red-500;
	}

	[data-melt-datefield-field] {
		@apply flex w-full items-center rounded-lg border bg-white p-1.5 text-stone-800;
	}

	[data-melt-datefield-field] .separator {
		@apply px-2;
	}

	[data-melt-datefield-field][data-invalid] {
		@apply border-red-400;
	}

	[data-melt-datefield-segment][data-invalid] {
		@apply text-red-500;
	}

	[data-melt-datefield-segment]:not([data-segment='literal']) {
	}

	[data-melt-datefield-validation] {
		@apply self-start text-red-500;
	}

	[data-melt-calendar] {
		@apply w-full rounded-lg bg-white p-3 text-stone-700 shadow-lg;
	}

	header {
		@apply flex items-center justify-between pb-2;
	}

	header + div {
		@apply flex items-center gap-6;
	}

	[data-melt-calendar-prevbutton] {
		@apply hover:bg-primary/20 rounded-lg p-1 transition-all;
	}

	[data-melt-calendar-nextbutton] {
		@apply hover:bg-primary/20 rounded-lg p-1 transition-all;
	}

	[data-melt-calendar-prevbutton][data-disabled] {
		@apply pointer-events-none rounded-lg p-1 opacity-40;
	}

	[data-melt-calendar-nextbutton][data-disabled] {
		@apply pointer-events-none rounded-lg p-1 opacity-40;
	}

	[data-melt-calendar-heading] {
		@apply font-semibold;
	}

	th {
		@apply text-sm font-semibold;
	}

	th {
		div {
			@apply flex h-6 w-6 items-center justify-center p-4;
		}
	}
	[data-melt-calendar-grid] {
		@apply w-full;
	}

	[data-melt-calendar-cell] {
		@apply hover:bg-primary/90 focus:ring-primary flex h-6 w-6 cursor-pointer items-center justify-center rounded-lg p-4 select-none hover:text-white focus:ring;
	}

	[data-melt-calendar-cell][data-highlighted] {
		@apply bg-primary text-white;
	}

	[data-melt-calendar-cell][data-range-highlighted] {
		@apply bg-primary text-white;
	}

	[data-melt-calendar-cell][data-disabled] {
		@apply pointer-events-none opacity-40;
	}

	[data-melt-calendar-cell][data-unavailable] {
		@apply pointer-events-none text-red-400 line-through;
	}

	[data-melt-calendar-cell][data-selected] {
		@apply bg-primary text-white;
	}

	[data-melt-calendar-cell][data-outside-visible-months] {
		@apply pointer-events-none cursor-default opacity-40 hover:bg-transparent;
	}

	[data-melt-calendar-cell][data-outside-month] {
		@apply pointer-events-none cursor-default opacity-0 hover:bg-transparent;
	}

	input[type='date']::-webkit-inner-spin-button,
	input[type='date']::-webkit-calendar-picker-indicator {
		display: none;
		-webkit-appearance: none;
	}

	[data-melt-datefield-label][data-invalid] {
		@apply text-red-500;
	}

	[data-melt-datefield-field] {
		@apply flex w-full min-w-[200px] items-center rounded-lg border p-1.5;
	}

	[data-melt-datefield-field][data-invalid] {
		@apply border-red-400;
	}

	[data-melt-datefield-segment][data-invalid] {
		@apply text-red-500;
	}

	[data-melt-datefield-segment]:not([data-segment='literal']) {
		@apply px-0.5;
	}
</style>

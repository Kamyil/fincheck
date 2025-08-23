<script lang="ts">
	type SwitchOption = {
		label: string;
		value?: string;
		href?: string;
	};

	interface Props {
		value: SwitchOption['value'];
		onChange?: (newValue: typeof value) => void;
		options: SwitchOption[];
	}

	let { value = $bindable(), onChange = () => {}, options }: Props = $props();
</script>

<div
	class="bg-neutral flex items-center rounded-md border border-stone-300 p-1 data-[orientation='vertical']:flex-col"
>
	<input type="hidden" bind:value />

	{#each options as option}
		{#if option.href}
			<a href={option.href} class="toggle-item" class:active={option.value === value}>
				{option.label}
			</a>
		{:else}
			<button
				class="toggle-item"
				class:active={option.value === value}
				onclick={() => {
					value = option.value;
					onChange(option.value);
				}}
			>
				{option.label}
			</button>
		{/if}
	{/each}
</div>

<style lang="postcss">
	@reference "tailwindcss";

	.toggle-item {
		@apply text-stone-800;
		@apply text-xs;
		@apply hover:text-primary;
		@apply outline-none;
		@apply w-fit;
		@apply h-12;
		@apply font-bold;
		@apply p-4;
		@apply flex;
		@apply justify-center;
		@apply items-center;
		@apply bg-neutral;
	}

	.toggle-item.active {
		@apply bg-white text-stone-900;
		@apply border border-stone-300;
		@apply rounded;
		@apply shadow;
	}
</style>

<script lang="ts">
	import CarIcon from 'lucide-svelte/icons/car';
	import Card from '$lib/components/common/Card.svelte';
	import Button from '$lib/components/common/Button.svelte';
	import type { Vehicle } from '$lib/server/db/schema';

	type Props = {
		vehicle: Vehicle;
		onEdit: (vehicle: Vehicle) => void;
		onDelete: (vehicle: Vehicle) => void;
		onView: (vehicle: Vehicle) => void;
	};

	let { vehicle, onEdit, onDelete, onView }: Props = $props();
</script>

<Card clickable onclick={() => onView(vehicle)}>
	{#snippet children()}
		<!-- Vehicle Icon -->
		<div
			class="mb-4 flex h-16 w-16 items-center justify-center rounded-full border border-red-600 bg-red-600/20 group-hover:bg-red-600/30"
		>
			<CarIcon class="h-8 w-8 text-red-400" />
		</div>

		<!-- Vehicle Info -->
		<div class="mb-6">
			<h3 class="mb-2 text-xl font-bold text-white">
				{vehicle.make}
				{vehicle.model}
			</h3>
			<div class="space-y-1 text-sm text-gray-300">
				<div class="flex justify-between">
					<span class="text-gray-400">Rocznik:</span>
					<span>{vehicle.year}</span>
				</div>
				{#if vehicle.registration}
					<div class="flex justify-between">
						<span class="text-gray-400">Rejestracja:</span>
						<span>{vehicle.registration}</span>
					</div>
				{/if}
				{#if vehicle.vin}
					<div class="flex justify-between">
						<span class="text-gray-400">VIN:</span>
						<span class="ml-2 truncate">{vehicle.vin}</span>
					</div>
				{/if}
			</div>
		</div>

		<!-- Action Buttons -->
		<div class="flex space-x-2" onclick={(e) => e.stopPropagation()}>
			<Button variant="blue" size="small" onClick={() => onEdit(vehicle)}>Edytuj</Button>
			<Button variant="red" size="small" onClick={() => onDelete(vehicle)}>Usuń</Button>
		</div>
	{/snippet}
</Card>

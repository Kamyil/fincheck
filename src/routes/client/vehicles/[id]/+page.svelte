<script lang="ts">
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import CarIcon from 'lucide-svelte/icons/car';
	import ArrowLeftIcon from 'lucide-svelte/icons/arrow-left';
	import CalendarIcon from 'lucide-svelte/icons/calendar';
	import MapPinIcon from 'lucide-svelte/icons/map-pin';
	import FuelIcon from 'lucide-svelte/icons/fuel';
	import PaletteIcon from 'lucide-svelte/icons/palette';
	import HashIcon from 'lucide-svelte/icons/hash';
	import GaugeIcon from 'lucide-svelte/icons/gauge';
	import ClipboardListIcon from 'lucide-svelte/icons/clipboard-list';
	import PlusIcon from 'lucide-svelte/icons/plus';
	import Button from '$lib/components/common/Button.svelte';
	import AddHealthRecordModal from '../components/AddHealthRecordModal.svelte';
	import EditHealthRecordModal from '../components/EditHealthRecordModal.svelte';
	import HealthRecordsList from '../components/HealthRecordsList.svelte';
	import VehicleHealthAnalytics from '$lib/components/VehicleHealthAnalytics.svelte';
	import {
		getHealthRecordsForVehicle,
		deleteHealthRecord
	} from '$lib/vehicles/health-records.remote';
	import type { VehicleHealthRecord } from '$lib/server/db/schema';

	let { data } = $props();
	let vehicle = data.vehicle;

	let addHealthRecordModal: AddHealthRecordModal;
	let editHealthRecordModal: EditHealthRecordModal;
	let currentEditRecord: VehicleHealthRecord | null = $state(null);

	// Use the remote function directly instead of manual state
	let healthRecordsQuery = $derived(getHealthRecordsForVehicle(vehicle.id));

	function goBack() {
		goto('/client/vehicles');
	}

	function openAddHealthRecordModal() {
		addHealthRecordModal?.openModal();
	}

	function handleEditRecord(record: VehicleHealthRecord) {
		currentEditRecord = record;
		editHealthRecordModal?.openModal();
	}

	async function handleDeleteRecord(record: VehicleHealthRecord) {
		if (confirm('Czy na pewno chcesz usunąć ten wpis z księgi zdrowia?')) {
			try {
				let result = await deleteHealthRecord(record.id);
				if (result.success) {
					// Refresh the query - this should update the UI automatically
					getHealthRecordsForVehicle(vehicle.id).refresh();
				} else {
					console.error('Delete failed:', result.error);
				}
			} catch (error) {
				console.error('Delete error:', error);
			}
		}
	}

	function onAddHealthRecordClose() {
		getHealthRecordsForVehicle(vehicle.id).refresh(); // Refresh after adding
	}

	function onEditHealthRecordClose() {
		currentEditRecord = null;
	}

	function onEditHealthRecordUpdated() {
		getHealthRecordsForVehicle(vehicle.id).refresh(); // Refresh after editing
	}
</script>

<svelte:head>
	<title>{vehicle.make} {vehicle.model} - Pan Samochodzik</title>
	<meta
		name="description"
		content="Szczegóły pojazdu {vehicle.make} {vehicle.model} w Pan Samochodzik"
	/>
</svelte:head>

<div class="relative overflow-hidden">
	<!-- Main Content -->
	<section class="relative z-10 mx-4 px-4 py-8 sm:mx-6 sm:px-6 lg:mx-8 lg:px-8">
		<div class="mx-auto max-w-6xl">
			<!-- Breadcrumb and Back Button -->
			<div class="mb-6 flex items-center space-x-4">
				<Button variant="red" onClick={goBack} classes="flex items-center space-x-2">
					<ArrowLeftIcon class="h-4 w-4" />
					<span>Powrót do pojazdów</span>
				</Button>
			</div>

			<!-- Vehicle Header -->
			<div class="mb-8 flex items-center justify-between">
				<div class="flex items-center space-x-4">
					<div
						class="flex h-16 w-16 items-center justify-center rounded-full border border-red-600 bg-red-600/20"
					>
						<CarIcon class="h-8 w-8 text-red-400" />
					</div>
					<div>
						<h1 class="text-3xl font-bold text-white">
							{vehicle.make}
							{vehicle.model}
						</h1>
						<p class="text-gray-400">Rocznik {vehicle.year}</p>
					</div>
				</div>
			</div>

			<div class="grid grid-cols-1 gap-8">
				<!-- Vehicle Health Analytics -->
				<div>
					<svelte:boundary>
						{#await healthRecordsQuery}
							<div
								class="rounded-2xl border border-gray-700 bg-gray-900/50 p-6 shadow-2xl shadow-red-600/10"
							>
								<div class="py-8 text-center">
									<div
										class="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] text-red-400"
									></div>
									<p class="mt-4 text-gray-400">Ładowanie analiz...</p>
								</div>
							</div>
						{:then result}
							{#if result.success && result.records && result.records.length > 0}
								<div
									class="rounded-2xl border border-gray-700 bg-gray-900/50 p-6 shadow-2xl shadow-red-600/10"
								>
									<h2 class="mb-6 text-xl font-semibold text-white">Analizy zdrowia pojazdu</h2>
									<div class="mb-4 rounded bg-gray-800 p-2 text-sm text-white">
										Debug: Passing {result.records.length} records to analytics
									</div>
									<VehicleHealthAnalytics records={result.records} />
								</div>
							{/if}
						{/await}
					</svelte:boundary>
				</div>

				<!-- Vehicle Information -->
				<div>
					<div
						class="rounded-2xl border border-gray-700 bg-gray-900/50 p-6 shadow-2xl shadow-red-600/10"
					>
						<h2 class="mb-6 text-xl font-semibold text-white">Informacje o pojeździe</h2>

						<div class="grid grid-cols-1 gap-6 md:grid-cols-2">
							<!-- Basic Info -->
							<div class="space-y-4">
								<div class="flex items-center space-x-3">
									<CarIcon class="h-5 w-5 text-red-400" />
									<div>
										<p class="text-sm text-gray-400">Marka i model</p>
										<p class="font-medium text-white">{vehicle.make} {vehicle.model}</p>
									</div>
								</div>

								<div class="flex items-center space-x-3">
									<CalendarIcon class="h-5 w-5 text-red-400" />
									<div>
										<p class="text-sm text-gray-400">Rok produkcji</p>
										<p class="font-medium text-white">{vehicle.year}</p>
									</div>
								</div>

								{#if vehicle.registration}
									<div class="flex items-center space-x-3">
										<MapPinIcon class="h-5 w-5 text-red-400" />
										<div>
											<p class="text-sm text-gray-400">Numer rejestracyjny</p>
											<p class="font-medium text-white">{vehicle.registration}</p>
										</div>
									</div>
								{/if}
							</div>

							<!-- Additional Info -->
							<div class="space-y-4">
								{#if vehicle.color}
									<div class="flex items-center space-x-3">
										<PaletteIcon class="h-5 w-5 text-red-400" />
										<div>
											<p class="text-sm text-gray-400">Kolor</p>
											<p class="font-medium text-white">{vehicle.color}</p>
										</div>
									</div>
								{/if}

								{#if vehicle.mileage}
									<div class="flex items-center space-x-3">
										<GaugeIcon class="h-5 w-5 text-red-400" />
										<div>
											<p class="text-sm text-gray-400">Przebieg</p>
											<p class="font-medium text-white">{vehicle.mileage.toLocaleString()} km</p>
										</div>
									</div>
								{/if}

								{#if vehicle.vin}
									<div class="flex items-center space-x-3">
										<HashIcon class="h-5 w-5 text-red-400" />
										<div>
											<p class="text-sm text-gray-400">Numer VIN</p>
											<p class="break-all font-medium text-white">{vehicle.vin}</p>
										</div>
									</div>
								{/if}
							</div>
						</div>
					</div>
				</div>

				<!-- Health Record Book Section -->
				<div>
					<div
						class="rounded-2xl border border-gray-700 bg-gray-900/50 p-6 shadow-2xl shadow-red-600/10"
					>
						<div class="mb-6 flex items-center justify-between">
							<div class="flex items-center space-x-3">
								<ClipboardListIcon class="h-6 w-6 text-red-400" />
								<h2 class="text-xl font-semibold text-white">Księga Zdrowia</h2>
							</div>
							<Button
								variant="red"
								onClick={openAddHealthRecordModal}
								classes="flex items-center space-x-2"
							>
								<PlusIcon class="h-4 w-4" />
								<span>Dodaj wpis</span>
							</Button>
						</div>

						<svelte:boundary>
							{#await healthRecordsQuery}
								<div class="py-8 text-center">
									<div
										class="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] text-red-400"
									></div>
									<p class="mt-4 text-gray-400">Ładowanie wpisów...</p>
								</div>
							{:then result}
								{#if result.success && result.records}
									<HealthRecordsList
										records={result.records}
										onEdit={handleEditRecord}
										onDelete={handleDeleteRecord}
									/>
								{:else}
									<p class="text-red-400">Błąd: {result.error}</p>
								{/if}
							{/await}
						</svelte:boundary>
					</div>
				</div>
			</div>
		</div>
	</section>
</div>

<!-- Modals -->
<AddHealthRecordModal
	bind:this={addHealthRecordModal}
	vehicleId={vehicle.id}
	onClose={onAddHealthRecordClose}
	onRecordAdded={onAddHealthRecordClose}
/>

<EditHealthRecordModal
	bind:this={editHealthRecordModal}
	vehicleId={vehicle.id}
	record={currentEditRecord}
	onClose={onEditHealthRecordClose}
	onRecordUpdated={onEditHealthRecordUpdated}
/>
